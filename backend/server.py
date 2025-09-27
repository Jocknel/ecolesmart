from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timedelta, date
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr, validator, model_validator
from bson import ObjectId
import os
import logging
import jwt
import uuid
import re
import httpx
from pathlib import Path
from decimal import Decimal
import asyncio
from datetime import timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configuration MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Configuration sécurité
SECRET_KEY = os.environ.get('SECRET_KEY', 'ecole-secret-key-guinea-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 heures

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Application FastAPI
app = FastAPI(
    title="École Smart - Plateforme de Gestion Scolaire",
    description="Système de gestion scolaire pour les écoles en Guinée avec paiements mobiles",
    version="1.0.0"
)

api_router = APIRouter(prefix="/api")

# Modèles Pydantic
class UserRole(str):
    ELEVE = "eleve"
    ENSEIGNANT = "enseignant"
    PARENT = "parent"
    ADMINISTRATEUR = "administrateur"

class ClasseLevel(str):
    CP1 = "CP1"
    CP2 = "CP2" 
    CE1 = "CE1"
    CE2 = "CE2"
    CM1 = "CM1"
    CM2 = "CM2"
    SIXIEME = "6ème"
    CINQUIEME = "5ème"
    QUATRIEME = "4ème"
    TROISIEME = "3ème"
    SECONDE = "2nde"
    PREMIERE = "1ère"
    TERMINALE = "Tle"

class UserCreate(BaseModel):
    email: EmailStr
    mot_de_passe: str = Field(min_length=6)
    confirmer_mot_de_passe: str = Field(min_length=6)
    nom: str = Field(min_length=2, max_length=100)
    prenoms: str = Field(min_length=2, max_length=200)
    role: str = Field(default=UserRole.PARENT)
    telephone: Optional[str] = None
    code_admin: Optional[str] = None  # Code spécial pour créer un admin
    
    @validator('confirmer_mot_de_passe')
    def validate_password_confirmation(cls, v, values):
        if 'mot_de_passe' in values and v != values['mot_de_passe']:
            raise ValueError('Les mots de passe ne correspondent pas')
        return v
    
    @model_validator(mode='after')
    def validate_admin_role(self):
        if self.role == 'administrateur':
            # Les codes valides fixes
            valid_codes = ['ADMIN_ECOLE_2024', 'PREMIER_ADMIN_2024']
            
            # Si ce n'est pas un code fixe, ce pourrait être un code temporaire
            if self.code_admin not in valid_codes:
                # Validation des codes temporaires sera faite dans la route register
                if not self.code_admin or not self.code_admin.startswith('ADMIN_'):
                    raise ValueError('Code administrateur requis pour ce rôle')
        elif self.role not in ['parent', 'enseignant', 'eleve', 'administrateur']:
            raise ValueError('Rôle non autorisé pour l\'inscription publique')
        return self
    
    @validator('telephone')
    def validate_phone(cls, v):
        if v:
            clean_phone = re.sub(r"[\s\-\.]", "", v)
            if not re.match(r"^(\+224|224)?[6-7][0-9]{8}$", clean_phone):
                raise ValueError('Format de numéro guinéen invalide')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    mot_de_passe: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class GoogleSessionRequest(BaseModel):
    session_id: str

class EleveCreate(BaseModel):
    nom: str = Field(min_length=2, max_length=100)
    prenoms: str = Field(min_length=2, max_length=200)
    date_naissance: date
    sexe: str = Field(pattern="^(masculin|feminin)$")
    classe: str
    telephone_parent: Optional[str] = None
    adresse: Optional[str] = None
    annee_scolaire: str = Field(default="2024-2025")
    
    @validator('telephone_parent')
    def validate_parent_phone(cls, v):
        if v:
            clean_phone = re.sub(r"[\s\-\.]", "", v)
            if not re.match(r"^(\+224|224)?[6-7][0-9]{8}$", clean_phone):
                raise ValueError('Format de numéro guinéen invalide')
        return v

class FactureCreate(BaseModel):
    eleve_id: str
    titre: str = Field(min_length=5, max_length=200)
    description: Optional[str] = None
    montant_total: float = Field(gt=0)
    date_echeance: date
    type_frais: List[str] = Field(default=["scolarite"])

class PaiementCreate(BaseModel):
    facture_id: str
    montant: float = Field(gt=100)  # Minimum 100 GNF
    numero_payeur: str
    nom_payeur: Optional[str] = None
    
    @validator('numero_payeur')
    def validate_payer_phone(cls, v):
        clean_phone = re.sub(r"[\s\-\.]", "", v)
        if not re.match(r"^(\+224|224)?[6-7][0-9]{8}$", clean_phone):
            raise ValueError('Numéro de téléphone guinéen invalide')
        return v

class PresenceCreate(BaseModel):
    eleve_id: str
    date_cours: date = Field(default_factory=date.today)
    matiere: str
    present: bool = True
    motif_absence: Optional[str] = None

class NoteCreate(BaseModel):
    eleve_id: str
    matiere: str
    type_evaluation: str = Field(pattern="^(devoir|composition|controle|examen|oral)$")
    note: float = Field(ge=0, le=20)  # Notes sur 20
    coefficient: float = Field(default=1.0, ge=0.5, le=5.0)
    date_evaluation: date
    trimestre: str = Field(pattern="^(T1|T2|T3)$")
    annee_scolaire: str = Field(default="2024-2025")
    commentaire: Optional[str] = None

class MatiereCreate(BaseModel):
    nom: str = Field(min_length=2, max_length=100)
    code: str = Field(min_length=2, max_length=20)
    coefficient: float = Field(default=1.0, ge=0.5, le=5.0)
    enseignant_id: Optional[str] = None
    classes: List[str] = Field(default=[])
    couleur: str = Field(default="#3B82F6")

class BulletinRequest(BaseModel):
    eleve_id: str
    trimestre: str = Field(pattern="^(T1|T2|T3)$")
    annee_scolaire: str = Field(default="2024-2025")
    format_export: str = Field(default="pdf", pattern="^(pdf|csv)$")

class EvenementCreate(BaseModel):
    titre: str = Field(min_length=3, max_length=200)
    description: Optional[str] = None
    date_debut: date
    date_fin: Optional[date] = None
    type_evenement: str = Field(pattern="^(cours|examen|vacances|reunion|activite|autre)$")
    classe: Optional[str] = None  # Si spécifique à une classe
    matiere: Optional[str] = None  # Si spécifique à une matière

class TrimestreCreate(BaseModel):
    nom: str = Field(min_length=3, max_length=50)
    code: str = Field(pattern="^(T1|T2|T3)$")
    date_debut: date
    date_fin: date
    date_debut_vacances: Optional[date] = None
    date_fin_vacances: Optional[date] = None
    annee_scolaire: str = Field(default="2024-2025")
    actif: bool = Field(default=True)

class EmploiDuTempsCreate(BaseModel):
    classe: str
    jour_semaine: int = Field(ge=1, le=7)  # 1=Lundi, 7=Dimanche
    heure_debut: str = Field(pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$")  # Format HH:MM
    heure_fin: str = Field(pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$")
    matiere: str
    enseignant_id: Optional[str] = None
    salle: Optional[str] = None
    type_cours: str = Field(default="cours", pattern="^(cours|td|tp|evaluation|soutien)$")
    couleur: str = Field(default="#3B82F6")
    
    @validator('heure_fin')
    def validate_heures(cls, v, values):
        if 'heure_debut' in values:
            debut = datetime.strptime(values['heure_debut'], '%H:%M').time()
            fin = datetime.strptime(v, '%H:%M').time()
            if fin <= debut:
                raise ValueError('L\'heure de fin doit être après l\'heure de début')
        return v

class CreneauHoraireCreate(BaseModel):
    nom: str = Field(min_length=2, max_length=50)  # Ex: "1ère heure", "Récréation"
    heure_debut: str = Field(pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$")
    heure_fin: str = Field(pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$")
    type_creneau: str = Field(default="cours", pattern="^(cours|pause|recreation)$")
    ordre: int = Field(ge=1, le=20)  # Position dans la journée

class RessourceCreate(BaseModel):
    titre: str = Field(min_length=3, max_length=200)
    description: Optional[str] = None
    type_ressource: str = Field(pattern="^(lecon|exercice|support|video|document)$")
    matiere: str
    classe: str
    fichier_url: Optional[str] = None  # URL du fichier uploadé
    fichier_nom: Optional[str] = None  # Nom original du fichier
    fichier_type: Optional[str] = None  # Type MIME
    taille_fichier: Optional[int] = None  # Taille en bytes
    visible_eleves: bool = Field(default=True)
    date_publication: Optional[date] = Field(default_factory=date.today)

class DevoirCreate(BaseModel):
    titre: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10)
    consignes: Optional[str] = None
    matiere: str
    classe: str
    date_assignation: date = Field(default_factory=date.today)
    date_echeance: date
    note_sur: float = Field(default=20.0, gt=0, le=100)
    coefficient: float = Field(default=1.0, ge=0.5, le=5.0)
    fichier_consigne_url: Optional[str] = None  # Fichier joint avec les consignes
    fichier_consigne_nom: Optional[str] = None
    actif: bool = Field(default=True)
    
    @validator('date_echeance')
    def validate_echeance(cls, v, values):
        if 'date_assignation' in values and v <= values['date_assignation']:
            raise ValueError('La date d\'échéance doit être après la date d\'assignation')
        return v

class RenduDevoirCreate(BaseModel):
    devoir_id: str
    commentaire_eleve: Optional[str] = None
    fichier_rendu_url: Optional[str] = None  # Fichier rendu par l'élève
    fichier_rendu_nom: Optional[str] = None
    fichier_rendu_type: Optional[str] = None
    taille_fichier: Optional[int] = None

class NotationRenduCreate(BaseModel):
    rendu_id: str
    note: float = Field(ge=0)
    commentaire_enseignant: Optional[str] = None
    date_correction: date = Field(default_factory=date.today)
    
    @validator('note')
    def validate_note(cls, v, values):
        # La validation de la note maximale sera faite côté serveur avec les infos du devoir
        return v

# Utilitaires d'authentification
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    user['_id'] = str(user['_id'])
    return user

def generate_matricule(classe: str, annee: str) -> str:
    """Génère un matricule unique"""
    codes_classe = {
        "CP1": "01", "CP2": "02", "CE1": "03", "CE2": "04",
        "CM1": "05", "CM2": "06", "6ème": "07", "5ème": "08", 
        "4ème": "09", "3ème": "10", "2nde": "11", "1ère": "12", "Tle": "13"
    }
    
    annee_code = annee.split('-')[0]
    classe_code = codes_classe.get(classe, "99")
    sequence = str(uuid.uuid4().int)[:3].zfill(3)
    
    return f"{annee_code}{classe_code}{sequence}"

def generate_numero_facture() -> str:
    """Génère un numéro de facture unique"""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_part = str(uuid.uuid4().int)[:6].zfill(6)
    return f"FACT-{timestamp}-{random_part}"

def detect_operator(phone: str) -> str:
    """Détecte l'opérateur mobile guinéen"""
    clean_phone = re.sub(r"[\s\-\.]", "", phone)
    if clean_phone.startswith("+224"):
        clean_phone = clean_phone[4:]
    elif clean_phone.startswith("224"):
        clean_phone = clean_phone[3:]
    
    if re.match(r"^6[0-5][0-9]{6}$", clean_phone):
        return "ORANGE"
    elif re.match(r"^6[6-7][0-9]{6}$", clean_phone):
        return "MTN"
    else:
        return "INCONNU"

# Routes d'authentification
@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    """Inscription d'un nouvel utilisateur"""
    # Vérification si l'utilisateur existe
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un utilisateur avec cet email existe déjà"
        )
    
    # Vérifier s'il y a déjà des administrateurs dans le système
    admin_count = await db.users.count_documents({"role": "administrateur"})
    
    # Si c'est le premier utilisateur et qu'il demande le rôle admin, l'autoriser automatiquement
    if admin_count == 0 and user_data.role == "administrateur":
        logger.info(f"Premier administrateur créé automatiquement: {user_data.email}")
        # Pas besoin de code pour le premier admin
        user_data.code_admin = "PREMIER_ADMIN_2024"
    
    # Vérification des codes temporaires pour les administrateurs
    elif user_data.role == "administrateur" and user_data.code_admin:
        if user_data.code_admin.startswith('ADMIN_') and user_data.code_admin not in ['ADMIN_ECOLE_2024', 'PREMIER_ADMIN_2024']:
            # Vérifier si c'est un code temporaire valide
            code_temp = await db.codes_admin_temp.find_one({
                "code": user_data.code_admin,
                "utilise": False,
                "date_expiration": {"$gt": datetime.now(timezone.utc)}
            })
            
            if not code_temp:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Code administrateur invalide ou expiré"
                )
            
            # Marquer le code comme utilisé
            await db.codes_admin_temp.update_one(
                {"_id": code_temp["_id"]},
                {"$set": {"utilise": True, "utilise_par": user_data.email, "date_utilisation": datetime.now(timezone.utc)}}
            )
    
    # Création de l'utilisateur
    hashed_password = get_password_hash(user_data.mot_de_passe)
    user_doc = {
        "_id": str(uuid.uuid4()),
        "email": user_data.email,
        "mot_de_passe": hashed_password,
        "nom": user_data.nom,
        "prenoms": user_data.prenoms,
        "role": user_data.role,
        "telephone": user_data.telephone,
        "actif": True,
        "date_creation": datetime.utcnow(),
        "date_modification": datetime.utcnow()
    }
    
    await db.users.insert_one(user_doc)
    
    # Génération du token
    access_token = create_access_token(data={"sub": user_data.email})
    
    # Préparation de la réponse utilisateur (sans mot de passe)
    user_response = {k: v for k, v in user_doc.items() if k != "mot_de_passe"}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@api_router.post("/auth/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    """Connexion d'un utilisateur"""
    user = await db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.mot_de_passe, user["mot_de_passe"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    if not user.get("actif", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Compte désactivé"
        )
    
    # Génération du token
    access_token = create_access_token(data={"sub": user["email"]})
    
    # Préparation de la réponse
    user_response = {k: str(v) if isinstance(v, ObjectId) else v for k, v in user.items() if k != "mot_de_passe"}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@api_router.post("/auth/google/session")
async def process_google_session(session_request: GoogleSessionRequest):
    """Traite la session Google OAuth via Emergent Auth"""
    try:
        # Appel à l'API Emergent pour récupérer les données de session
        headers = {"X-Session-ID": session_request.session_id}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers=headers
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Session ID invalide ou expirée"
                )
            
            session_data = response.json()
            email = session_data.get("email")
            name = session_data.get("name", "")
            session_token = session_data.get("session_token")
            
            if not email or not session_token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Données de session incomplètes"
                )
            
            # Vérifier si l'utilisateur existe
            existing_user = await db.users.find_one({"email": email})
            
            if existing_user:
                # Utilisateur existant - mise à jour du session_token
                await db.users.update_one(
                    {"email": email},
                    {
                        "$set": {
                            "session_token": session_token,
                            "session_expires": datetime.now(timezone.utc) + timedelta(days=7),
                            "date_modification": datetime.now(timezone.utc)
                        }
                    }
                )
                user_doc = existing_user
            else:
                # Nouvel utilisateur - création avec rôle Parent par défaut
                name_parts = name.split(' ', 1)
                nom = name_parts[0] if name_parts else "Utilisateur"
                prenoms = name_parts[1] if len(name_parts) > 1 else "Google"
                
                user_doc = {
                    "_id": str(uuid.uuid4()),
                    "email": email,
                    "nom": nom,
                    "prenoms": prenoms,
                    "role": "parent",  # Rôle par défaut pour Google OAuth
                    "telephone": None,
                    "actif": True,
                    "auth_method": "google",
                    "session_token": session_token,
                    "session_expires": datetime.now(timezone.utc) + timedelta(days=7),
                    "date_creation": datetime.now(timezone.utc),
                    "date_modification": datetime.now(timezone.utc)
                }
                
                await db.users.insert_one(user_doc)
            
            # Génération du JWT token pour notre système
            access_token = create_access_token(data={"sub": email})
            
            # Préparation de la réponse
            user_response = {k: str(v) if isinstance(v, ObjectId) else v for k, v in user_doc.items() 
                           if k not in ["mot_de_passe", "session_token"]}
            
            return {
                "access_token": access_token,
                "token_type": "bearer", 
                "user": user_response,
                "session_token": session_token
            }
            
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Délai d'attente dépassé lors de la vérification de session"
        )
    except Exception as e:
        logger.error(f"Erreur traitement session Google: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors du traitement de l'authentification Google"
        )

@api_router.post("/auth/logout")
async def logout_user(current_user: dict = Depends(get_current_user)):
    """Déconnexion - supprime le session_token si Google Auth"""
    try:
        if current_user.get("auth_method") == "google" and current_user.get("session_token"):
            # Suppression du session_token pour les utilisateurs Google
            await db.users.update_one(
                {"email": current_user["email"]},
                {
                    "$unset": {"session_token": "", "session_expires": ""},
                    "$set": {"date_modification": datetime.now(timezone.utc)}
                }
            )
        
        return {"message": "Déconnexion réussie"}
        
    except Exception as e:
        logger.error(f"Erreur lors de la déconnexion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la déconnexion"
        )

# Routes de gestion des élèves
@api_router.post("/eleves")
async def create_eleve(eleve_data: EleveCreate, current_user: dict = Depends(get_current_user)):
    """Créer un nouvel élève"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Génération du matricule
    matricule = generate_matricule(eleve_data.classe, eleve_data.annee_scolaire)
    
    # Création de l'élève
    eleve_doc = {
        "_id": str(uuid.uuid4()),
        "matricule": matricule,
        "nom": eleve_data.nom,
        "prenoms": eleve_data.prenoms,
        "date_naissance": eleve_data.date_naissance.isoformat(),
        "sexe": eleve_data.sexe,
        "classe": eleve_data.classe,
        "telephone_parent": eleve_data.telephone_parent,
        "adresse": eleve_data.adresse,
        "annee_scolaire": eleve_data.annee_scolaire,
        "statut_inscription": True,
        "date_inscription": datetime.utcnow().isoformat(),
        "date_creation": datetime.utcnow().isoformat(),
        "date_modification": datetime.utcnow().isoformat()
    }
    
    await db.eleves.insert_one(eleve_doc)
    
    return {"message": f"Élève créé avec succès. Matricule: {matricule}", "eleve": eleve_doc}

@api_router.get("/eleves")
async def list_eleves(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    classe: Optional[str] = None,
    annee_scolaire: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Liste des élèves avec filtres et pagination"""
    # Construction du filtre
    filter_query = {"statut_inscription": True}
    
    if classe:
        filter_query["classe"] = classe
    
    if annee_scolaire:
        filter_query["annee_scolaire"] = annee_scolaire
    
    if search:
        filter_query["$or"] = [
            {"nom": {"$regex": search, "$options": "i"}},
            {"prenoms": {"$regex": search, "$options": "i"}},
            {"matricule": {"$regex": search, "$options": "i"}}
        ]
    
    # Comptage total
    total = await db.eleves.count_documents(filter_query)
    
    # Pagination
    skip = (page - 1) * limit
    
    # Récupération des élèves
    cursor = db.eleves.find(filter_query).skip(skip).limit(limit).sort("date_creation", -1)
    eleves = await cursor.to_list(length=None)
    
    # Conversion des ObjectIds en strings
    for eleve in eleves:
        eleve['_id'] = str(eleve['_id'])
    
    return {
        "eleves": eleves,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@api_router.get("/eleves/{eleve_id}")
async def get_eleve(eleve_id: str, current_user: dict = Depends(get_current_user)):
    """Détails d'un élève"""
    eleve = await db.eleves.find_one({"_id": eleve_id})
    if not eleve:
        raise HTTPException(status_code=404, detail="Élève introuvable")
    
    eleve['_id'] = str(eleve['_id'])
    return eleve

# Routes de gestion des factures
@api_router.post("/factures")
async def create_facture(facture_data: FactureCreate, current_user: dict = Depends(get_current_user)):
    """Créer une nouvelle facture"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Vérification de l'élève
    eleve = await db.eleves.find_one({"_id": facture_data.eleve_id})
    if not eleve:
        raise HTTPException(status_code=404, detail="Élève introuvable")
    
    # Génération du numéro de facture
    numero_facture = generate_numero_facture()
    
    # Création de la facture
    facture_doc = {
        "_id": str(uuid.uuid4()),
        "numero_facture": numero_facture,
        "eleve_id": facture_data.eleve_id,
        "titre": facture_data.titre,
        "description": facture_data.description,
        "montant_total": facture_data.montant_total,
        "montant_paye": 0,
        "montant_restant": facture_data.montant_total,
        "devise": "GNF",
        "date_emission": datetime.utcnow().isoformat(),
        "date_echeance": facture_data.date_echeance.isoformat(),
        "statut": "emise",
        "type_frais": facture_data.type_frais,
        "date_creation": datetime.utcnow().isoformat(),
        "date_modification": datetime.utcnow().isoformat()
    }
    
    await db.factures.insert_one(facture_doc)
    
    return {"message": f"Facture créée avec succès. Numéro: {numero_facture}", "facture": facture_doc}

@api_router.get("/factures")
async def list_factures(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    eleve_id: Optional[str] = None,
    statut: Optional[str] = None,
    impayees_seulement: bool = False,
    current_user: dict = Depends(get_current_user)
):
    """Liste des factures avec filtres"""
    # Construction du filtre
    filter_query = {}
    
    if eleve_id:
        filter_query["eleve_id"] = eleve_id
    
    if statut:
        filter_query["statut"] = statut
    
    if impayees_seulement:
        filter_query["statut"] = {"$in": ["emise", "payee_partiellement"]}
    
    # Comptage total
    total = await db.factures.count_documents(filter_query)
    
    # Pagination
    skip = (page - 1) * limit
    
    # Récupération des factures avec info élève
    pipeline = [
        {"$match": filter_query},
        {"$lookup": {
            "from": "eleves",
            "localField": "eleve_id", 
            "foreignField": "_id",
            "as": "eleve"
        }},
        {"$unwind": {"path": "$eleve", "preserveNullAndEmptyArrays": True}},
        {"$sort": {"date_emission": -1}},
        {"$skip": skip},
        {"$limit": limit}
    ]
    
    cursor = db.factures.aggregate(pipeline)
    factures = await cursor.to_list(length=None)
    
    # Conversion des ObjectIds
    for facture in factures:
        facture['_id'] = str(facture['_id'])
        if 'eleve' in facture and facture['eleve']:
            facture['eleve']['_id'] = str(facture['eleve']['_id'])
    
    return {
        "factures": factures,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@api_router.get("/factures/{facture_id}")
async def get_facture(facture_id: str, current_user: dict = Depends(get_current_user)):
    """Détails d'une facture"""
    # Récupération avec info élève
    pipeline = [
        {"$match": {"_id": facture_id}},
        {"$lookup": {
            "from": "eleves",
            "localField": "eleve_id",
            "foreignField": "_id", 
            "as": "eleve"
        }},
        {"$unwind": {"path": "$eleve", "preserveNullAndEmptyArrays": True}}
    ]
    
    cursor = db.factures.aggregate(pipeline)
    factures = await cursor.to_list(length=None)
    
    if not factures:
        raise HTTPException(status_code=404, detail="Facture introuvable")
    
    facture = factures[0]
    facture['_id'] = str(facture['_id'])
    if 'eleve' in facture and facture['eleve']:
        facture['eleve']['_id'] = str(facture['eleve']['_id'])
    
    return facture

# Routes de gestion des paiements 
@api_router.post("/paiements/initier")
async def initiate_payment(paiement_data: PaiementCreate, current_user: dict = Depends(get_current_user)):
    """Initier un paiement mobile (Orange Money ou MTN Money)"""
    # Vérification de la facture
    facture = await db.factures.find_one({"_id": paiement_data.facture_id})
    if not facture:
        raise HTTPException(status_code=404, detail="Facture introuvable")
    
    if facture["statut"] == "payee_totalement":
        raise HTTPException(status_code=400, detail="Facture déjà payée intégralement")
    
    if paiement_data.montant > facture["montant_restant"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Montant supérieur au solde dû: {facture['montant_restant']} GNF"
        )
    
    # Détection automatique de l'opérateur
    operateur = detect_operator(paiement_data.numero_payeur)
    if operateur == "INCONNU":
        raise HTTPException(status_code=400, detail="Numéro de téléphone non reconnu")
    
    # Récupération des infos élève
    eleve = await db.eleves.find_one({"_id": facture["eleve_id"]})
    
    # Génération de la référence de paiement
    reference_paiement = f"PAY_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:6].upper()}"
    
    # Création de l'enregistrement de paiement
    paiement_doc = {
        "_id": str(uuid.uuid4()),
        "reference_interne": reference_paiement,
        "facture_id": paiement_data.facture_id,
        "eleve_id": facture["eleve_id"],
        "montant": paiement_data.montant,
        "devise": "GNF",
        "methode_paiement": operateur.lower() + "_money",
        "statut": "initie",
        "numero_payeur": paiement_data.numero_payeur,
        "nom_payeur": paiement_data.nom_payeur or f"{eleve['nom']} {eleve['prenoms']}",
        "operateur": operateur,
        "date_initiation": datetime.utcnow().isoformat(),
        "date_expiration": (datetime.utcnow() + timedelta(minutes=30)).isoformat(),
        "date_creation": datetime.utcnow().isoformat()
    }
    
    await db.paiements.insert_one(paiement_doc)
    
    # Simulation du processus de paiement mobile
    if operateur == "ORANGE":
        instructions = {
            "message": "Paiement Orange Money initié",
            "instructions": "Vous recevrez un SMS de confirmation. Suivez les instructions pour valider le paiement.",
            "code_ussd": "*144*4*4#",
            "delai_expiration": "30 minutes"
        }
    else:  # MTN
        instructions = {
            "message": "Demande de paiement MTN Money envoyée",
            "instructions": "Composez *223# et suivez les instructions pour confirmer le paiement.",
            "code_ussd": "*223#",
            "delai_expiration": "5 minutes"
        }
    
    return {
        "success": True,
        "reference_paiement": reference_paiement,
        "montant": paiement_data.montant,
        "operateur": operateur,
        "statut": "initie",
        **instructions
    }

@api_router.get("/paiements")
async def list_paiements(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    eleve_id: Optional[str] = None,
    facture_id: Optional[str] = None,
    statut: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Liste des paiements avec filtres"""
    # Construction du filtre
    filter_query = {}
    
    if eleve_id:
        filter_query["eleve_id"] = eleve_id
    
    if facture_id:
        filter_query["facture_id"] = facture_id
    
    if statut:
        filter_query["statut"] = statut
    
    # Comptage total
    total = await db.paiements.count_documents(filter_query)
    
    # Pagination
    skip = (page - 1) * limit
    
    # Récupération des paiements avec infos associées
    pipeline = [
        {"$match": filter_query},
        {"$lookup": {
            "from": "eleves",
            "localField": "eleve_id",
            "foreignField": "_id",
            "as": "eleve"
        }},
        {"$lookup": {
            "from": "factures", 
            "localField": "facture_id",
            "foreignField": "_id",
            "as": "facture"
        }},
        {"$unwind": {"path": "$eleve", "preserveNullAndEmptyArrays": True}},
        {"$unwind": {"path": "$facture", "preserveNullAndEmptyArrays": True}},
        {"$sort": {"date_initiation": -1}},
        {"$skip": skip},
        {"$limit": limit}
    ]
    
    cursor = db.paiements.aggregate(pipeline)
    paiements = await cursor.to_list(length=None)
    
    # Conversion des ObjectIds
    for paiement in paiements:
        paiement['_id'] = str(paiement['_id'])
        if 'eleve' in paiement and paiement['eleve']:
            paiement['eleve']['_id'] = str(paiement['eleve']['_id'])
        if 'facture' in paiement and paiement['facture']:
            paiement['facture']['_id'] = str(paiement['facture']['_id'])
    
    return {
        "paiements": paiements,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@api_router.put("/paiements/{paiement_id}/simuler-succes")
async def simulate_payment_success(paiement_id: str, current_user: dict = Depends(get_current_user)):
    """Simule un paiement réussi (pour la démo)"""
    if current_user["role"] not in ["administrateur"]:
        raise HTTPException(status_code=403, detail="Accès refusé - Administrateur seulement")
    
    # Récupération du paiement
    paiement = await db.paiements.find_one({"_id": paiement_id})
    if not paiement:
        raise HTTPException(status_code=404, detail="Paiement introuvable")
    
    # Mise à jour du statut du paiement
    await db.paiements.update_one(
        {"_id": paiement_id},
        {
            "$set": {
                "statut": "reussi",
                "date_completion": datetime.utcnow().isoformat(),
                "reference_operateur": f"TXN_{uuid.uuid4().hex[:12].upper()}",
                "date_modification": datetime.utcnow().isoformat()
            }
        }
    )
    
    # Mise à jour de la facture
    facture = await db.factures.find_one({"_id": paiement["facture_id"]})
    nouveau_montant_paye = facture["montant_paye"] + paiement["montant"]
    nouveau_montant_restant = facture["montant_total"] - nouveau_montant_paye
    
    nouveau_statut = "payee_totalement" if nouveau_montant_restant <= 0 else "payee_partiellement"
    
    await db.factures.update_one(
        {"_id": paiement["facture_id"]},
        {
            "$set": {
                "montant_paye": nouveau_montant_paye,
                "montant_restant": max(0, nouveau_montant_restant),
                "statut": nouveau_statut,
                "date_modification": datetime.utcnow().isoformat()
            }
        }
    )
    
    return {
        "success": True,
        "message": "Paiement simulé avec succès",
        "nouveau_statut_facture": nouveau_statut,
        "montant_restant": max(0, nouveau_montant_restant)
    }

@api_router.post("/admin/generer-code-admin")
async def generer_code_admin(current_user: dict = Depends(get_current_user)):
    """Génère un code temporaire pour créer un administrateur (réservé aux admins)"""
    if current_user["role"] != "administrateur":
        raise HTTPException(status_code=403, detail="Accès refusé - Administrateur seulement")
    
    # Génération d'un code temporaire valide 1 heure
    code_temporaire = f"ADMIN_{datetime.now().strftime('%Y%m%d_%H%M')}_{uuid.uuid4().hex[:6].upper()}"
    expiration = datetime.now(timezone.utc) + timedelta(hours=1)
    
    # Stocker le code temporaire dans la base de données
    await db.codes_admin_temp.insert_one({
        "_id": str(uuid.uuid4()),
        "code": code_temporaire,
        "genere_par": current_user["email"],
        "date_creation": datetime.now(timezone.utc),
        "date_expiration": expiration,
        "utilise": False
    })
    
    return {
        "code_temporaire": code_temporaire,
        "valide_jusqu": expiration.isoformat(),
        "duree_validite": "1 heure",
        "message": f"Code généré par {current_user['nom']} {current_user['prenoms']}"
    }

# Routes de gestion des matières
@api_router.post("/matieres")
async def create_matiere(matiere_data: MatiereCreate, current_user: dict = Depends(get_current_user)):
    """Créer une nouvelle matière"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Vérification si la matière existe déjà
    existing_matiere = await db.matieres.find_one({"code": matiere_data.code})
    if existing_matiere:
        raise HTTPException(status_code=400, detail="Une matière avec ce code existe déjà")
    
    matiere_doc = {
        "_id": str(uuid.uuid4()),
        "nom": matiere_data.nom,
        "code": matiere_data.code,
        "coefficient": matiere_data.coefficient,
        "enseignant_id": matiere_data.enseignant_id,
        "classes": matiere_data.classes,
        "couleur": matiere_data.couleur,
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.matieres.insert_one(matiere_doc)
    
    return {"message": "Matière créée avec succès", "matiere": matiere_doc}

@api_router.get("/matieres")
async def list_matieres(current_user: dict = Depends(get_current_user)):
    """Liste des matières"""
    matieres = await db.matieres.find().to_list(length=None)
    for matiere in matieres:
        matiere['_id'] = str(matiere['_id'])
    return {"matieres": matieres}

# Routes de gestion des notes
@api_router.post("/notes")
async def create_note(note_data: NoteCreate, current_user: dict = Depends(get_current_user)):
    """Créer une nouvelle note"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Vérification de l'élève
    eleve = await db.eleves.find_one({"_id": note_data.eleve_id})
    if not eleve:
        raise HTTPException(status_code=404, detail="Élève introuvable")
    
    # Vérification de la matière
    matiere = await db.matieres.find_one({"nom": note_data.matiere})
    if not matiere:
        raise HTTPException(status_code=404, detail="Matière introuvable")
    
    note_doc = {
        "_id": str(uuid.uuid4()),
        "eleve_id": note_data.eleve_id,
        "matiere": note_data.matiere,
        "type_evaluation": note_data.type_evaluation,
        "note": note_data.note,
        "coefficient": note_data.coefficient,
        "date_evaluation": note_data.date_evaluation.isoformat(),
        "trimestre": note_data.trimestre,
        "annee_scolaire": note_data.annee_scolaire,
        "commentaire": note_data.commentaire,
        "enseignant_id": current_user["_id"],
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.notes.insert_one(note_doc)
    
    return {"message": "Note enregistrée avec succès", "note": note_doc}

@api_router.get("/notes")
async def list_notes(
    eleve_id: Optional[str] = None,
    matiere: Optional[str] = None,
    trimestre: Optional[str] = None,
    annee_scolaire: str = "2024-2025",
    current_user: dict = Depends(get_current_user)
):
    """Liste des notes avec filtres"""
    filter_query = {"annee_scolaire": annee_scolaire}
    
    if eleve_id:
        filter_query["eleve_id"] = eleve_id
    
    if matiere:
        filter_query["matiere"] = matiere
    
    if trimestre:
        filter_query["trimestre"] = trimestre
    
    # Pipeline d'agrégation pour inclure les infos élève
    pipeline = [
        {"$match": filter_query},
        {"$lookup": {
            "from": "eleves",
            "localField": "eleve_id",
            "foreignField": "_id",
            "as": "eleve"
        }},
        {"$unwind": {"path": "$eleve", "preserveNullAndEmptyArrays": True}},
        {"$sort": {"date_evaluation": -1}}
    ]
    
    cursor = db.notes.aggregate(pipeline)
    notes = await cursor.to_list(length=None)
    
    for note in notes:
        note['_id'] = str(note['_id'])
        if 'eleve' in note and note['eleve']:
            note['eleve']['_id'] = str(note['eleve']['_id'])
    
    return {"notes": notes}

@api_router.get("/notes/moyennes/{eleve_id}")
async def calculate_moyennes(
    eleve_id: str, 
    trimestre: Optional[str] = None,
    annee_scolaire: str = "2024-2025",
    current_user: dict = Depends(get_current_user)
):
    """Calcul des moyennes d'un élève"""
    
    # Vérification de l'élève
    eleve = await db.eleves.find_one({"_id": eleve_id})
    if not eleve:
        raise HTTPException(status_code=404, detail="Élève introuvable")
    
    filter_query = {"eleve_id": eleve_id, "annee_scolaire": annee_scolaire}
    if trimestre:
        filter_query["trimestre"] = trimestre
    
    # Pipeline pour calculer les moyennes par matière
    pipeline = [
        {"$match": filter_query},
        {
            "$group": {
                "_id": {"matiere": "$matiere", "trimestre": "$trimestre"},
                "moyenne": {
                    "$avg": {
                        "$multiply": ["$note", "$coefficient"]
                    }
                },
                "coefficient_total": {"$sum": "$coefficient"},
                "nb_notes": {"$sum": 1},
                "notes": {"$push": {
                    "note": "$note",
                    "coefficient": "$coefficient",
                    "type_evaluation": "$type_evaluation",
                    "date_evaluation": "$date_evaluation"
                }}
            }
        },
        {
            "$project": {
                "matiere": "$_id.matiere",
                "trimestre": "$_id.trimestre",
                "moyenne": {"$round": ["$moyenne", 2]},
                "coefficient_total": 1,
                "nb_notes": 1,
                "notes": 1,
                "_id": 0
            }
        },
        {"$sort": {"trimestre": 1, "matiere": 1}}
    ]
    
    cursor = db.notes.aggregate(pipeline)
    moyennes_matiere = await cursor.to_list(length=None)
    
    # Calcul de la moyenne générale
    if moyennes_matiere:
        total_points = sum(m["moyenne"] * m["coefficient_total"] for m in moyennes_matiere)
        total_coefficients = sum(m["coefficient_total"] for m in moyennes_matiere)
        moyenne_generale = round(total_points / total_coefficients, 2) if total_coefficients > 0 else 0
    else:
        moyenne_generale = 0
    
    return {
        "eleve": {
            "_id": str(eleve["_id"]),
            "nom": eleve["nom"],
            "prenoms": eleve["prenoms"],
            "classe": eleve["classe"]
        },
        "moyennes_par_matiere": moyennes_matiere,
        "moyenne_generale": moyenne_generale,
        "trimestre": trimestre,
        "annee_scolaire": annee_scolaire
    }

@api_router.post("/bulletins/generer")
async def generer_bulletin(bulletin_request: BulletinRequest, current_user: dict = Depends(get_current_user)):
    """Générer un bulletin scolaire"""
    
    # Récupération des données complètes
    moyennes_response = await calculate_moyennes(
        bulletin_request.eleve_id,
        bulletin_request.trimestre,
        bulletin_request.annee_scolaire,
        current_user
    )
    
    # Récupération des présences
    presences_filter = {
        "eleve_id": bulletin_request.eleve_id,
        "date_cours": {
            "$regex": f"^{bulletin_request.annee_scolaire.split('-')[0]}"
        }
    }
    
    cursor = db.presences.find(presences_filter)
    presences = await cursor.to_list(length=None)
    
    # Calcul des absences par trimestre (approximatif)
    absences = len([p for p in presences if not p.get("present", True)])
    total_cours = len(presences)
    taux_presence = round((total_cours - absences) / total_cours * 100, 1) if total_cours > 0 else 100
    
    bulletin_data = {
        "eleve": moyennes_response["eleve"],
        "trimestre": bulletin_request.trimestre,
        "annee_scolaire": bulletin_request.annee_scolaire,
        "moyennes_par_matiere": moyennes_response["moyennes_par_matiere"],
        "moyenne_generale": moyennes_response["moyenne_generale"],
        "presences": {
            "total_cours": total_cours,
            "absences": absences,
            "taux_presence": taux_presence
        },
        "appreciation": generer_appreciation(moyennes_response["moyenne_generale"]),
        "date_generation": datetime.now(timezone.utc).isoformat()
    }
    
    if bulletin_request.format_export == "csv":
        return {"bulletin_data": bulletin_data, "format": "json"}
    else:
        # Pour le PDF, on retourne les données pour générer côté frontend
        return {"bulletin_data": bulletin_data, "format": "pdf"}

def generer_appreciation(moyenne_generale: float) -> str:
    """Génère une appréciation basée sur la moyenne générale"""
    if moyenne_generale >= 16:
        return "Excellent travail. Félicitations !"
    elif moyenne_generale >= 14:
        return "Très bon travail. Continue ainsi !"
    elif moyenne_generale >= 12:
        return "Bon travail. Peut mieux faire."
    elif moyenne_generale >= 10:
        return "Travail satisfaisant. Efforts à poursuivre."
    elif moyenne_generale >= 8:
        return "Travail insuffisant. Doit redoubler d'efforts."
    else:
        return "Travail très insuffisant. Aide et soutien nécessaires."

# Routes de gestion du calendrier académique
@api_router.post("/calendrier/evenements")
async def create_evenement(evenement_data: EvenementCreate, current_user: dict = Depends(get_current_user)):
    """Créer un événement dans le calendrier"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    evenement_doc = {
        "_id": str(uuid.uuid4()),
        "titre": evenement_data.titre,
        "description": evenement_data.description,
        "date_debut": evenement_data.date_debut.isoformat(),
        "date_fin": evenement_data.date_fin.isoformat() if evenement_data.date_fin else None,
        "type_evenement": evenement_data.type_evenement,
        "classe": evenement_data.classe,
        "matiere": evenement_data.matiere,
        "createur_id": current_user["_id"],
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.evenements_calendrier.insert_one(evenement_doc)
    
    return {"message": "Événement créé avec succès", "evenement": evenement_doc}

@api_router.get("/calendrier/evenements")
async def list_evenements(
    mois: Optional[int] = None,
    annee: int = Query(default=2025, ge=2020, le=2030),
    classe: Optional[str] = None,
    type_evenement: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Liste des événements du calendrier"""
    filter_query = {}
    
    if mois and annee:
        # Filtrer par mois et année
        debut_mois = datetime(annee, mois, 1, tzinfo=timezone.utc)
        if mois == 12:
            fin_mois = datetime(annee + 1, 1, 1, tzinfo=timezone.utc)
        else:
            fin_mois = datetime(annee, mois + 1, 1, tzinfo=timezone.utc)
        
        filter_query["date_debut"] = {
            "$gte": debut_mois.isoformat(),
            "$lt": fin_mois.isoformat()
        }
    
    if classe:
        filter_query["$or"] = [
            {"classe": classe},
            {"classe": None}  # Événements pour toutes les classes
        ]
    
    if type_evenement:
        filter_query["type_evenement"] = type_evenement
    
    cursor = db.evenements_calendrier.find(filter_query).sort("date_debut", 1)
    evenements = await cursor.to_list(length=None)
    
    for evenement in evenements:
        evenement['_id'] = str(evenement['_id'])
    
    return {"evenements": evenements}

# Routes de gestion des trimestres
@api_router.post("/trimestres")
async def create_trimestre(trimestre_data: TrimestreCreate, current_user: dict = Depends(get_current_user)):
    """Créer un nouveau trimestre"""
    if current_user["role"] != "administrateur":
        raise HTTPException(status_code=403, detail="Accès refusé - Administrateur seulement")
    
    # Vérifier si le trimestre existe déjà pour cette année scolaire
    existing = await db.trimestres.find_one({
        "code": trimestre_data.code,
        "annee_scolaire": trimestre_data.annee_scolaire
    })
    
    if existing:
        raise HTTPException(status_code=400, detail=f"Le {trimestre_data.code} existe déjà pour {trimestre_data.annee_scolaire}")
    
    trimestre_doc = {
        "_id": str(uuid.uuid4()),
        "nom": trimestre_data.nom,
        "code": trimestre_data.code,
        "date_debut": trimestre_data.date_debut.isoformat(),
        "date_fin": trimestre_data.date_fin.isoformat(),
        "date_debut_vacances": trimestre_data.date_debut_vacances.isoformat() if trimestre_data.date_debut_vacances else None,
        "date_fin_vacances": trimestre_data.date_fin_vacances.isoformat() if trimestre_data.date_fin_vacances else None,
        "annee_scolaire": trimestre_data.annee_scolaire,
        "actif": trimestre_data.actif,
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.trimestres.insert_one(trimestre_doc)
    
    return {"message": "Trimestre créé avec succès", "trimestre": trimestre_doc}

@api_router.get("/trimestres")
async def list_trimestres(
    annee_scolaire: str = "2024-2025",
    current_user: dict = Depends(get_current_user)
):
    """Liste des trimestres personnalisés ou par défaut"""
    
    # Chercher les trimestres personnalisés d'abord
    cursor = db.trimestres.find({"annee_scolaire": annee_scolaire}).sort("code", 1)
    trimestres_custom = await cursor.to_list(length=None)
    
    if trimestres_custom:
        # Utiliser les trimestres personnalisés
        for trimestre in trimestres_custom:
            trimestre['_id'] = str(trimestre['_id'])
        return {"trimestres": trimestres_custom, "source": "personnalisé"}
    
    # Sinon, utiliser les trimestres par défaut
    trimestres_default = [
        {
            "nom": "Trimestre 1",
            "code": "T1",
            "date_debut": "2024-09-01",
            "date_fin": "2024-12-20",
            "date_debut_vacances": "2024-12-21",
            "date_fin_vacances": "2025-01-06",
            "annee_scolaire": annee_scolaire,
            "actif": True
        },
        {
            "nom": "Trimestre 2", 
            "code": "T2",
            "date_debut": "2025-01-07",
            "date_fin": "2025-04-04",
            "date_debut_vacances": "2025-04-05",
            "date_fin_vacances": "2025-04-21",
            "annee_scolaire": annee_scolaire,
            "actif": True
        },
        {
            "nom": "Trimestre 3",
            "code": "T3", 
            "date_debut": "2025-04-22",
            "date_fin": "2025-07-04",
            "date_debut_vacances": "2025-07-05",
            "date_fin_vacances": "2025-08-31",
            "annee_scolaire": annee_scolaire,
            "actif": True
        }
    ]
    
    return {"trimestres": trimestres_default, "source": "défaut"}

# Routes de gestion des créneaux horaires
@api_router.post("/creneaux")
async def create_creneau(creneau_data: CreneauHoraireCreate, current_user: dict = Depends(get_current_user)):
    """Créer un nouveau créneau horaire"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    creneau_doc = {
        "_id": str(uuid.uuid4()),
        "nom": creneau_data.nom,
        "heure_debut": creneau_data.heure_debut,
        "heure_fin": creneau_data.heure_fin,
        "type_creneau": creneau_data.type_creneau,
        "ordre": creneau_data.ordre,
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.creneaux_horaires.insert_one(creneau_doc)
    
    return {"message": "Créneau créé avec succès", "creneau": creneau_doc}

@api_router.get("/creneaux")
async def list_creneaux(current_user: dict = Depends(get_current_user)):
    """Liste des créneaux horaires"""
    
    # Chercher les créneaux personnalisés
    cursor = db.creneaux_horaires.find().sort("ordre", 1)
    creneaux_custom = await cursor.to_list(length=None)
    
    if creneaux_custom:
        for creneau in creneaux_custom:
            creneau['_id'] = str(creneau['_id'])
        return {"creneaux": creneaux_custom, "source": "personnalisé"}
    
    # Créneaux par défaut si aucun n'existe
    creneaux_default = [
        {"nom": "1ère heure", "heure_debut": "08:00", "heure_fin": "08:55", "type_creneau": "cours", "ordre": 1},
        {"nom": "Récréation", "heure_debut": "08:55", "heure_fin": "09:10", "type_creneau": "recreation", "ordre": 2},
        {"nom": "2ème heure", "heure_debut": "09:10", "heure_fin": "10:05", "type_creneau": "cours", "ordre": 3},
        {"nom": "3ème heure", "heure_debut": "10:05", "heure_fin": "11:00", "type_creneau": "cours", "ordre": 4},
        {"nom": "Récréation", "heure_debut": "11:00", "heure_fin": "11:15", "type_creneau": "recreation", "ordre": 5},
        {"nom": "4ème heure", "heure_debut": "11:15", "heure_fin": "12:10", "type_creneau": "cours", "ordre": 6},
        {"nom": "Pause déjeuner", "heure_debut": "12:10", "heure_fin": "14:00", "type_creneau": "pause", "ordre": 7},
        {"nom": "5ème heure", "heure_debut": "14:00", "heure_fin": "14:55", "type_creneau": "cours", "ordre": 8},
        {"nom": "6ème heure", "heure_debut": "14:55", "heure_fin": "15:50", "type_creneau": "cours", "ordre": 9}
    ]
    
    return {"creneaux": creneaux_default, "source": "défaut"}

# Routes de gestion des emplois du temps
@api_router.post("/emplois-du-temps")
async def create_emploi_du_temps(emploi_data: EmploiDuTempsCreate, current_user: dict = Depends(get_current_user)):
    """Créer un créneau dans l'emploi du temps"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Vérifier les conflits (même classe, même créneau horaire)
    conflit = await db.emplois_du_temps.find_one({
        "classe": emploi_data.classe,
        "jour_semaine": emploi_data.jour_semaine,
        "heure_debut": emploi_data.heure_debut,
        "heure_fin": emploi_data.heure_fin
    })
    
    if conflit:
        raise HTTPException(status_code=400, detail="Conflit d'horaire : un cours existe déjà à ce créneau")
    
    emploi_doc = {
        "_id": str(uuid.uuid4()),
        "classe": emploi_data.classe,
        "jour_semaine": emploi_data.jour_semaine,
        "heure_debut": emploi_data.heure_debut,
        "heure_fin": emploi_data.heure_fin,
        "matiere": emploi_data.matiere,
        "enseignant_id": emploi_data.enseignant_id,
        "salle": emploi_data.salle,
        "type_cours": emploi_data.type_cours,
        "couleur": emploi_data.couleur,
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.emplois_du_temps.insert_one(emploi_doc)
    
    return {"message": "Cours ajouté à l'emploi du temps", "cours": emploi_doc}

@api_router.get("/emplois-du-temps")
async def get_emploi_du_temps(
    classe: Optional[str] = None,
    enseignant_id: Optional[str] = None,
    jour_semaine: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Récupérer l'emploi du temps"""
    
    filter_query = {}
    
    if classe:
        filter_query["classe"] = classe
    
    if enseignant_id:
        filter_query["enseignant_id"] = enseignant_id
    
    if jour_semaine:
        filter_query["jour_semaine"] = jour_semaine
    
    # Pipeline pour inclure les infos enseignant
    pipeline = [
        {"$match": filter_query},
        {"$lookup": {
            "from": "users",
            "localField": "enseignant_id",
            "foreignField": "_id",
            "as": "enseignant"
        }},
        {"$unwind": {"path": "$enseignant", "preserveNullAndEmptyArrays": True}},
        {"$sort": {"jour_semaine": 1, "heure_debut": 1}}
    ]
    
    cursor = db.emplois_du_temps.aggregate(pipeline)
    emploi_du_temps = await cursor.to_list(length=None)
    
    # Conversion des ObjectIds
    for cours in emploi_du_temps:
        cours['_id'] = str(cours['_id'])
        if 'enseignant' in cours and cours['enseignant']:
            cours['enseignant']['_id'] = str(cours['enseignant']['_id'])
            # Supprimer le mot de passe de la réponse
            cours['enseignant'].pop('mot_de_passe', None)
    
    return {"emploi_du_temps": emploi_du_temps}

@api_router.delete("/emplois-du-temps/{cours_id}")
async def delete_cours_emploi(cours_id: str, current_user: dict = Depends(get_current_user)):
    """Supprimer un cours de l'emploi du temps"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    result = await db.emplois_du_temps.delete_one({"_id": cours_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cours introuvable")
    
    return {"message": "Cours supprimé de l'emploi du temps"}

# Routes de gestion des ressources pédagogiques
@api_router.post("/ressources")
async def create_ressource(ressource_data: RessourceCreate, current_user: dict = Depends(get_current_user)):
    """Créer une nouvelle ressource pédagogique"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    ressource_doc = {
        "_id": str(uuid.uuid4()),
        "titre": ressource_data.titre,
        "description": ressource_data.description,
        "type_ressource": ressource_data.type_ressource,
        "matiere": ressource_data.matiere,
        "classe": ressource_data.classe,
        "fichier_url": ressource_data.fichier_url,
        "fichier_nom": ressource_data.fichier_nom,
        "fichier_type": ressource_data.fichier_type,
        "taille_fichier": ressource_data.taille_fichier,
        "visible_eleves": ressource_data.visible_eleves,
        "date_publication": ressource_data.date_publication.isoformat(),
        "enseignant_id": current_user["_id"],
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.ressources.insert_one(ressource_doc)
    
    return {"message": "Ressource créée avec succès", "ressource": ressource_doc}

@api_router.get("/ressources")
async def list_ressources(
    matiere: Optional[str] = None,
    classe: Optional[str] = None,
    type_ressource: Optional[str] = None,
    enseignant_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Liste des ressources avec filtres"""
    
    filter_query = {}
    
    # Filtrage selon le rôle
    if current_user["role"] == "eleve":
        # Les élèves ne voient que les ressources visibles
        filter_query["visible_eleves"] = True
        # TODO: Filtrer par la classe de l'élève
    
    if matiere:
        filter_query["matiere"] = matiere
    
    if classe:
        filter_query["classe"] = classe
    
    if type_ressource:
        filter_query["type_ressource"] = type_ressource
    
    if enseignant_id:
        filter_query["enseignant_id"] = enseignant_id
    
    # Pipeline pour inclure les infos enseignant
    pipeline = [
        {"$match": filter_query},
        {"$lookup": {
            "from": "users",
            "localField": "enseignant_id",
            "foreignField": "_id",
            "as": "enseignant"
        }},
        {"$unwind": {"path": "$enseignant", "preserveNullAndEmptyArrays": True}},
        {"$sort": {"date_publication": -1}}
    ]
    
    cursor = db.ressources.aggregate(pipeline)
    ressources = await cursor.to_list(length=None)
    
    # Conversion et nettoyage
    for ressource in ressources:
        ressource['_id'] = str(ressource['_id'])
        if 'enseignant' in ressource and ressource['enseignant']:
            ressource['enseignant']['_id'] = str(ressource['enseignant']['_id'])
            ressource['enseignant'].pop('mot_de_passe', None)
    
    return {"ressources": ressources}

# Routes de gestion des devoirs
@api_router.post("/devoirs")
async def create_devoir(devoir_data: DevoirCreate, current_user: dict = Depends(get_current_user)):
    """Créer un nouveau devoir"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    devoir_doc = {
        "_id": str(uuid.uuid4()),
        "titre": devoir_data.titre,
        "description": devoir_data.description,
        "consignes": devoir_data.consignes,
        "matiere": devoir_data.matiere,
        "classe": devoir_data.classe,
        "date_assignation": devoir_data.date_assignation.isoformat(),
        "date_echeance": devoir_data.date_echeance.isoformat(),
        "note_sur": devoir_data.note_sur,
        "coefficient": devoir_data.coefficient,
        "fichier_consigne_url": devoir_data.fichier_consigne_url,
        "fichier_consigne_nom": devoir_data.fichier_consigne_nom,
        "actif": devoir_data.actif,
        "enseignant_id": current_user["_id"],
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.devoirs.insert_one(devoir_doc)
    
    return {"message": "Devoir créé avec succès", "devoir": devoir_doc}

@api_router.get("/devoirs")
async def list_devoirs(
    matiere: Optional[str] = None,
    classe: Optional[str] = None,
    enseignant_id: Optional[str] = None,
    eleve_id: Optional[str] = None,
    actif_seulement: bool = True,
    current_user: dict = Depends(get_current_user)
):
    """Liste des devoirs avec filtres"""
    
    filter_query = {}
    
    if actif_seulement:
        filter_query["actif"] = True
    
    if matiere:
        filter_query["matiere"] = matiere
    
    if classe:
        filter_query["classe"] = classe
    
    if enseignant_id:
        filter_query["enseignant_id"] = enseignant_id
    
    # Pipeline avec informations des rendus si élève spécifié
    if eleve_id:
        pipeline = [
            {"$match": filter_query},
            {"$lookup": {
                "from": "rendus_devoirs",
                "let": {"devoir_id": "$_id"},
                "pipeline": [
                    {"$match": {
                        "$expr": {
                            "$and": [
                                {"$eq": ["$devoir_id", "$$devoir_id"]},
                                {"$eq": ["$eleve_id", eleve_id]}
                            ]
                        }
                    }}
                ],
                "as": "mon_rendu"
            }},
            {"$lookup": {
                "from": "users",
                "localField": "enseignant_id",
                "foreignField": "_id",
                "as": "enseignant"
            }},
            {"$unwind": {"path": "$enseignant", "preserveNullAndEmptyArrays": True}},
            {"$sort": {"date_echeance": 1}}
        ]
    else:
        pipeline = [
            {"$match": filter_query},
            {"$lookup": {
                "from": "users",
                "localField": "enseignant_id",
                "foreignField": "_id",
                "as": "enseignant"
            }},
            {"$unwind": {"path": "$enseignant", "preserveNullAndEmptyArrays": True}},
            {"$sort": {"date_assignation": -1}}
        ]
    
    cursor = db.devoirs.aggregate(pipeline)
    devoirs = await cursor.to_list(length=None)
    
    # Conversion et nettoyage
    for devoir in devoirs:
        devoir['_id'] = str(devoir['_id'])
        if 'enseignant' in devoir and devoir['enseignant']:
            devoir['enseignant']['_id'] = str(devoir['enseignant']['_id'])
            devoir['enseignant'].pop('mot_de_passe', None)
        
        # Traiter les rendus de l'élève
        if 'mon_rendu' in devoir and devoir['mon_rendu']:
            devoir['mon_rendu'][0]['_id'] = str(devoir['mon_rendu'][0]['_id'])
    
    return {"devoirs": devoirs}

@api_router.get("/devoirs/{devoir_id}")
async def get_devoir(devoir_id: str, current_user: dict = Depends(get_current_user)):
    """Détails d'un devoir avec les rendus"""
    
    # Pipeline pour récupérer le devoir avec tous les rendus
    pipeline = [
        {"$match": {"_id": devoir_id}},
        {"$lookup": {
            "from": "rendus_devoirs",
            "localField": "_id",
            "foreignField": "devoir_id",
            "as": "rendus"
        }},
        {"$lookup": {
            "from": "users",
            "localField": "enseignant_id",
            "foreignField": "_id",
            "as": "enseignant"
        }},
        {"$unwind": {"path": "$enseignant", "preserveNullAndEmptyArrays": True}}
    ]
    
    cursor = db.devoirs.aggregate(pipeline)
    devoirs = await cursor.to_list(length=None)
    
    if not devoirs:
        raise HTTPException(status_code=404, detail="Devoir introuvable")
    
    devoir = devoirs[0]
    devoir['_id'] = str(devoir['_id'])
    
    # Nettoyer les données sensibles
    if 'enseignant' in devoir and devoir['enseignant']:
        devoir['enseignant']['_id'] = str(devoir['enseignant']['_id'])
        devoir['enseignant'].pop('mot_de_passe', None)
    
    # Traiter les rendus
    for rendu in devoir.get('rendus', []):
        rendu['_id'] = str(rendu['_id'])
    
    return devoir

# Routes de gestion des rendus de devoirs
@api_router.post("/devoirs/{devoir_id}/rendre")
async def rendre_devoir(devoir_id: str, rendu_data: RenduDevoirCreate, current_user: dict = Depends(get_current_user)):
    """Rendre un devoir (élève ou parent pour l'élève)"""
    
    # Vérifier que le devoir existe
    devoir = await db.devoirs.find_one({"_id": devoir_id})
    if not devoir:
        raise HTTPException(status_code=404, detail="Devoir introuvable")
    
    # Vérifier que l'échéance n'est pas dépassée
    date_echeance = datetime.fromisoformat(devoir["date_echeance"]).date()
    if date.today() > date_echeance:
        raise HTTPException(status_code=400, detail="La date d'échéance est dépassée")
    
    # Déterminer l'élève concerné
    eleve_id = current_user["_id"] if current_user["role"] == "eleve" else rendu_data.devoir_id  # TODO: Améliorer la logique
    
    # Vérifier si l'élève a déjà rendu ce devoir
    existing_rendu = await db.rendus_devoirs.find_one({
        "devoir_id": devoir_id,
        "eleve_id": eleve_id
    })
    
    if existing_rendu:
        raise HTTPException(status_code=400, detail="Devoir déjà rendu")
    
    rendu_doc = {
        "_id": str(uuid.uuid4()),
        "devoir_id": devoir_id,
        "eleve_id": eleve_id,
        "commentaire_eleve": rendu_data.commentaire_eleve,
        "fichier_rendu_url": rendu_data.fichier_rendu_url,
        "fichier_rendu_nom": rendu_data.fichier_rendu_nom,
        "fichier_rendu_type": rendu_data.fichier_rendu_type,
        "taille_fichier": rendu_data.taille_fichier,
        "date_rendu": datetime.now(timezone.utc),
        "statut": "rendu",
        "note": None,
        "commentaire_enseignant": None,
        "date_correction": None,
        "date_creation": datetime.now(timezone.utc)
    }
    
    await db.rendus_devoirs.insert_one(rendu_doc)
    
    return {"message": "Devoir rendu avec succès", "rendu": rendu_doc}

@api_router.post("/rendus/{rendu_id}/noter")
async def noter_rendu(rendu_id: str, notation_data: NotationRenduCreate, current_user: dict = Depends(get_current_user)):
    """Noter un rendu de devoir (enseignant)"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Récupérer le rendu avec le devoir associé
    pipeline = [
        {"$match": {"_id": rendu_id}},
        {"$lookup": {
            "from": "devoirs",
            "localField": "devoir_id",
            "foreignField": "_id",
            "as": "devoir"
        }},
        {"$unwind": "$devoir"}
    ]
    
    cursor = db.rendus_devoirs.aggregate(pipeline)
    rendus = await cursor.to_list(length=None)
    
    if not rendus:
        raise HTTPException(status_code=404, detail="Rendu introuvable")
    
    rendu = rendus[0]
    devoir = rendu["devoir"]
    
    # Vérifier que la note ne dépasse pas le maximum
    if notation_data.note > devoir["note_sur"]:
        raise HTTPException(
            status_code=400, 
            detail=f"La note ne peut pas dépasser {devoir['note_sur']}"
        )
    
    # Mettre à jour le rendu avec la notation
    await db.rendus_devoirs.update_one(
        {"_id": rendu_id},
        {
            "$set": {
                "note": notation_data.note,
                "commentaire_enseignant": notation_data.commentaire_enseignant,
                "date_correction": notation_data.date_correction.isoformat(),
                "statut": "note",
                "correcteur_id": current_user["_id"],
                "date_modification": datetime.now(timezone.utc)
            }
        }
    )
    
    # Optionnel : Ajouter automatiquement cette note au système de notes général
    note_generale = {
        "_id": str(uuid.uuid4()),
        "eleve_id": rendu["eleve_id"],
        "matiere": devoir["matiere"],
        "type_evaluation": "devoir",
        "note": (notation_data.note / devoir["note_sur"]) * 20,  # Conversion sur 20
        "coefficient": devoir["coefficient"],
        "date_evaluation": notation_data.date_correction.isoformat(),
        "trimestre": "T1",  # TODO: Déterminer le trimestre automatiquement
        "annee_scolaire": "2024-2025",
        "commentaire": f"Devoir: {devoir['titre']}",
        "enseignant_id": current_user["_id"],
        "devoir_id": devoir_id,
        "rendu_id": rendu_id,
        "date_creation": datetime.now(timezone.utc),
        "date_modification": datetime.now(timezone.utc)
    }
    
    await db.notes.insert_one(note_generale)
    
    return {"message": "Devoir noté avec succès", "note_sur_20": note_generale["note"]}

@api_router.get("/mes-devoirs")
async def get_mes_devoirs(current_user: dict = Depends(get_current_user)):
    """Récupérer les devoirs de l'élève connecté"""
    if current_user["role"] != "eleve":
        raise HTTPException(status_code=403, detail="Accès réservé aux élèves")
    
    # TODO: Récupérer la classe de l'élève depuis son profil
    # Pour l'instant, on retourne tous les devoirs
    response = await list_devoirs(eleve_id=current_user["_id"], current_user=current_user)
    return response

@api_router.get("/calendrier/trimestres")
async def get_trimestres_info(annee_scolaire: str = "2024-2025"):
    """Information sur les trimestres (compatibilité)"""
    response = await list_trimestres(annee_scolaire, current_user=None)
    return {
        "annee_scolaire": annee_scolaire,
        "trimestres": response["trimestres"]
    }

# Routes de gestion des présences
@api_router.post("/presences")
async def create_presence(presence_data: PresenceCreate, current_user: dict = Depends(get_current_user)):
    """Enregistrer une présence/absence"""
    if current_user["role"] not in ["administrateur", "enseignant"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Vérification de l'élève
    eleve = await db.eleves.find_one({"_id": presence_data.eleve_id})
    if not eleve:
        raise HTTPException(status_code=404, detail="Élève introuvable")
    
    # Vérification si une présence existe déjà pour cette date/matière
    existing_presence = await db.presences.find_one({
        "eleve_id": presence_data.eleve_id,
        "date_cours": presence_data.date_cours.isoformat(),
        "matiere": presence_data.matiere
    })
    
    if existing_presence:
        raise HTTPException(status_code=400, detail="Présence déjà enregistrée pour cette date et matière")
    
    # Création de la présence
    presence_doc = {
        "_id": str(uuid.uuid4()),
        "eleve_id": presence_data.eleve_id,
        "date_cours": presence_data.date_cours.isoformat(),
        "matiere": presence_data.matiere,
        "present": presence_data.present,
        "motif_absence": presence_data.motif_absence,
        "enseignant_id": current_user["_id"],
        "date_creation": datetime.utcnow().isoformat()
    }
    
    await db.presences.insert_one(presence_doc)
    
    return {
        "message": "Présence enregistrée avec succès",
        "presence": presence_doc
    }

@api_router.get("/presences")
async def list_presences(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    eleve_id: Optional[str] = None,
    date_debut: Optional[date] = None,
    date_fin: Optional[date] = None,
    matiere: Optional[str] = None,
    absences_seulement: bool = False,
    current_user: dict = Depends(get_current_user)
):
    """Liste des présences avec filtres"""
    # Construction du filtre
    filter_query = {}
    
    if eleve_id:
        filter_query["eleve_id"] = eleve_id
    
    if date_debut:
        filter_query["date_cours"] = {"$gte": date_debut.isoformat()}
    
    if date_fin:
        if "date_cours" in filter_query:
            filter_query["date_cours"]["$lte"] = date_fin.isoformat()
        else:
            filter_query["date_cours"] = {"$lte": date_fin.isoformat()}
    
    if matiere:
        filter_query["matiere"] = matiere
    
    if absences_seulement:
        filter_query["present"] = False
    
    # Comptage total
    total = await db.presences.count_documents(filter_query)
    
    # Pagination
    skip = (page - 1) * limit
    
    # Récupération des présences avec info élève
    pipeline = [
        {"$match": filter_query},
        {"$lookup": {
            "from": "eleves",
            "localField": "eleve_id",
            "foreignField": "_id",
            "as": "eleve"
        }},
        {"$unwind": {"path": "$eleve", "preserveNullAndEmptyArrays": True}},
        {"$sort": {"date_cours": -1}},
        {"$skip": skip},
        {"$limit": limit}
    ]
    
    cursor = db.presences.aggregate(pipeline)
    presences = await cursor.to_list(length=None)
    
    # Conversion des ObjectIds
    for presence in presences:
        presence['_id'] = str(presence['_id'])
        if 'eleve' in presence and presence['eleve']:
            presence['eleve']['_id'] = str(presence['eleve']['_id'])
    
    return {
        "presences": presences,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

# Routes de statistiques et tableau de bord
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Statistiques pour le tableau de bord"""
    
    # Statistiques générales
    total_eleves = await db.eleves.count_documents({"statut_inscription": True})
    total_factures = await db.factures.count_documents({})
    total_paiements_reussis = await db.paiements.count_documents({"statut": "reussi"})
    
    # Factures impayées
    factures_impayees = await db.factures.count_documents({
        "statut": {"$in": ["emise", "payee_partiellement"]}
    })
    
    # Montant total des créances
    pipeline_creances = [
        {"$match": {"statut": {"$in": ["emise", "payee_partiellement"]}}},
        {"$group": {"_id": None, "total_creances": {"$sum": "$montant_restant"}}}
    ]
    cursor_creances = db.factures.aggregate(pipeline_creances)
    creances_result = await cursor_creances.to_list(length=None)
    total_creances = creances_result[0]["total_creances"] if creances_result else 0
    
    # Répartition par classe
    pipeline_classes = [
        {"$match": {"statut_inscription": True}},
        {"$group": {"_id": "$classe", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    cursor_classes = db.eleves.aggregate(pipeline_classes)
    repartition_classes = await cursor_classes.to_list(length=None)
    
    # Présences de la semaine
    today = date.today()
    start_week = today - timedelta(days=today.weekday())
    
    absences_semaine = await db.presences.count_documents({
        "date_cours": {"$gte": start_week.isoformat()},
        "present": False
    })
    
    return {
        "eleves": {
            "total": total_eleves,
            "repartition_classes": repartition_classes
        },
        "finances": {
            "total_factures": total_factures,
            "factures_impayees": factures_impayees,
            "total_creances": total_creances,
            "paiements_reussis": total_paiements_reussis
        },
        "presences": {
            "absences_cette_semaine": absences_semaine
        }
    }

# Inclusion du routeur dans l'app
app.include_router(api_router)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Route de test
@api_router.get("/")
async def root():
    return {"message": "École Smart API - Système de gestion scolaire pour la Guinée", "version": "1.0.0"}