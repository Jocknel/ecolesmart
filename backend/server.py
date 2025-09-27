from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timedelta, date
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr, validator
from bson import ObjectId
import os
import logging
import jwt
import uuid
import re
from pathlib import Path
from decimal import Decimal
import asyncio

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
    nom: str = Field(min_length=2, max_length=100)
    prenoms: str = Field(min_length=2, max_length=200)
    role: str = Field(default=UserRole.PARENT)
    telephone: Optional[str] = None
    
    @validator('telephone')
    def validate_phone(cls, v):
        if v:
            clean_phone = re.sub(r"[\s\-\.]", "", v)
            if not re.match(r"^(\+224|224)?[6-7][0-9]{7}$", clean_phone):
                raise ValueError('Format de numéro guinéen invalide')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    mot_de_passe: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

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
            if not re.match(r"^(\+224|224)?[6-7][0-9]{7}$", clean_phone):
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
        if not re.match(r"^(\+224|224)?[6-7][0-9]{7}$", clean_phone):
            raise ValueError('Numéro de téléphone guinéen invalide')
        return v

class PresenceCreate(BaseModel):
    eleve_id: str
    date_cours: date = Field(default_factory=date.today)
    matiere: str
    present: bool = True
    motif_absence: Optional[str] = None

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