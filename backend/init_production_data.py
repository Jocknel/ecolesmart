#!/usr/bin/env python3
"""
Script d'initialisation des données de production pour École Smart
"""

import asyncio
import os
import sys
from datetime import datetime, date, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import uuid

# Ajouter le répertoire parent au path pour importer les modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

# Configuration
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ProductionDataInitializer:
    def __init__(self):
        self.client = AsyncIOMotorClient(MONGO_URL)
        self.db = self.client[DB_NAME]
        
    async def init_admin_user(self):
        """Créer l'utilisateur administrateur par défaut"""
        existing_admin = await self.db.users.find_one({"role": "administrateur"})
        
        if not existing_admin:
            admin_user = {
                "_id": str(uuid.uuid4()),
                "email": "admin@ecole-smart.gn",
                "mot_de_passe": pwd_context.hash("Admin2024!"),
                "nom": "Administrateur",
                "prenoms": "École Smart",
                "role": "administrateur", 
                "telephone": "+224 664 000 001",
                "actif": True,
                "date_creation": datetime.now(timezone.utc),
                "date_modification": datetime.now(timezone.utc)
            }
            
            await self.db.users.insert_one(admin_user)
            print("✅ Administrateur créé: admin@ecole-smart.gn / Admin2024!")
        else:
            print("ℹ️  Administrateur existe déjà")
            
    async def init_sample_teachers(self):
        """Créer des enseignants exemples"""
        teachers = [
            {
                "_id": str(uuid.uuid4()),
                "email": "prof.mathematiques@ecole-smart.gn",
                "mot_de_passe": pwd_context.hash("Prof2024!"),
                "nom": "Diallo",
                "prenoms": "Amadou",
                "role": "enseignant",
                "telephone": "+224 664 000 002",
                "actif": True,
                "specialite": "Mathématiques",
                "date_creation": datetime.now(timezone.utc),
                "date_modification": datetime.now(timezone.utc)
            },
            {
                "_id": str(uuid.uuid4()),
                "email": "prof.francais@ecole-smart.gn", 
                "mot_de_passe": pwd_context.hash("Prof2024!"),
                "nom": "Bah",
                "prenoms": "Fatoumata",
                "role": "enseignant",
                "telephone": "+224 664 000 003",
                "actif": True,
                "specialite": "Français",
                "date_creation": datetime.now(timezone.utc),
                "date_modification": datetime.now(timezone.utc)
            }
        ]
        
        for teacher in teachers:
            existing = await self.db.users.find_one({"email": teacher["email"]})
            if not existing:
                await self.db.users.insert_one(teacher)
                print(f"✅ Enseignant créé: {teacher['email']} / Prof2024!")
        
    async def init_sample_parents(self):
        """Créer des parents exemples"""
        parents = [
            {
                "_id": str(uuid.uuid4()),
                "email": "parent.camara@gmail.com",
                "mot_de_passe": pwd_context.hash("Parent2024!"),
                "nom": "Camara",
                "prenoms": "Mariama",
                "role": "parent",
                "telephone": "+224 664 000 004",
                "actif": True,
                "date_creation": datetime.now(timezone.utc),
                "date_modification": datetime.now(timezone.utc)
            },
            {
                "_id": str(uuid.uuid4()),
                "email": "parent.sylla@yahoo.com",
                "mot_de_passe": pwd_context.hash("Parent2024!"),
                "nom": "Sylla", 
                "prenoms": "Ibrahima",
                "role": "parent",
                "telephone": "+224 664 000 005",
                "actif": True,
                "date_creation": datetime.now(timezone.utc),
                "date_modification": datetime.now(timezone.utc)
            }
        ]
        
        for parent in parents:
            existing = await self.db.users.find_one({"email": parent["email"]})
            if not existing:
                await self.db.users.insert_one(parent)
                print(f"✅ Parent créé: {parent['email']} / Parent2024!")
        
    async def init_subjects(self):
        """Créer les matières de base"""
        subjects = [
            {"nom": "Mathématiques", "code": "MATH", "coefficient": 3.0, "couleur": "#3B82F6"},
            {"nom": "Français", "code": "FR", "coefficient": 3.0, "couleur": "#EF4444"},
            {"nom": "Anglais", "code": "ANG", "coefficient": 2.0, "couleur": "#10B981"},
            {"nom": "Sciences Physiques", "code": "PC", "coefficient": 2.0, "couleur": "#F59E0B"},
            {"nom": "Sciences Naturelles", "code": "SVT", "coefficient": 2.0, "couleur": "#8B5CF6"},
            {"nom": "Histoire-Géographie", "code": "HG", "coefficient": 2.0, "couleur": "#06B6D4"},
            {"nom": "Éducation Civique", "code": "EC", "coefficient": 1.0, "couleur": "#84CC16"},
            {"nom": "Éducation Physique", "code": "EPS", "coefficient": 1.0, "couleur": "#F97316"},
        ]
        
        for subject in subjects:
            existing = await self.db.matieres.find_one({"code": subject["code"]})
            if not existing:
                subject_doc = {
                    "_id": str(uuid.uuid4()),
                    **subject,
                    "classes": ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Tle"],
                    "date_creation": datetime.now(timezone.utc),
                    "date_modification": datetime.now(timezone.utc)
                }
                await self.db.matieres.insert_one(subject_doc)
                print(f"✅ Matière créée: {subject['nom']}")
                
    async def init_sample_students(self):
        """Créer quelques élèves exemples"""
        students = [
            {
                "nom": "Kaba",
                "prenoms": "Aissatou", 
                "date_naissance": "2008-03-15",
                "sexe": "feminin",
                "classe": "3ème",
                "telephone_parent": "+224 664 000 004",
                "adresse": "Quartier Kaloum, Conakry",
                "annee_scolaire": "2024-2025"
            },
            {
                "nom": "Touré", 
                "prenoms": "Mamadou",
                "date_naissance": "2007-09-22",
                "sexe": "masculin", 
                "classe": "2nde",
                "telephone_parent": "+224 664 000 005",
                "adresse": "Quartier Matam, Conakry",
                "annee_scolaire": "2024-2025"
            },
            {
                "nom": "Barry",
                "prenoms": "Kadiatou",
                "date_naissance": "2009-01-10",
                "sexe": "feminin",
                "classe": "4ème", 
                "telephone_parent": "+224 664 000 004",
                "adresse": "Quartier Ratoma, Conakry",
                "annee_scolaire": "2024-2025"
            }
        ]
        
        for student in students:
            # Générer matricule unique
            matricule = f"2024{student['classe'].replace('ème', '').replace('nde', '10').replace('ère', '11').replace('Tle', '12')}{str(uuid.uuid4().int)[:3]}"
            
            existing = await self.db.eleves.find_one({"nom": student["nom"], "prenoms": student["prenoms"]})
            if not existing:
                student_doc = {
                    "_id": str(uuid.uuid4()),
                    "matricule": matricule,
                    **student,
                    "statut_inscription": True,
                    "date_inscription": datetime.now(timezone.utc).isoformat(),
                    "date_creation": datetime.now(timezone.utc).isoformat(),
                    "date_modification": datetime.now(timezone.utc).isoformat()
                }
                await self.db.eleves.insert_one(student_doc)
                print(f"✅ Élève créé: {student['nom']} {student['prenoms']} - Matricule: {matricule}")
        
    async def init_academic_year(self):
        """Créer l'année scolaire et les trimestres"""
        trimestres = [
            {
                "nom": "Premier Trimestre",
                "code": "T1",
                "date_debut": date(2024, 10, 1),
                "date_fin": date(2024, 12, 20),
                "date_debut_vacances": date(2024, 12, 21),
                "date_fin_vacances": date(2025, 1, 8),
                "annee_scolaire": "2024-2025",
                "actif": True
            },
            {
                "nom": "Deuxième Trimestre", 
                "code": "T2",
                "date_debut": date(2025, 1, 9),
                "date_fin": date(2025, 4, 4),
                "date_debut_vacances": date(2025, 4, 5),
                "date_fin_vacances": date(2025, 4, 21),
                "annee_scolaire": "2024-2025",
                "actif": False
            },
            {
                "nom": "Troisième Trimestre",
                "code": "T3", 
                "date_debut": date(2025, 4, 22),
                "date_fin": date(2025, 7, 15),
                "date_debut_vacances": date(2025, 7, 16),
                "date_fin_vacances": date(2025, 9, 30),
                "annee_scolaire": "2024-2025",
                "actif": False
            }
        ]
        
        for trimestre in trimestres:
            existing = await self.db.trimestres.find_one({"code": trimestre["code"], "annee_scolaire": trimestre["annee_scolaire"]})
            if not existing:
                trimestre_doc = {
                    "_id": str(uuid.uuid4()),
                    **trimestre,
                    "date_debut": trimestre["date_debut"].isoformat(),
                    "date_fin": trimestre["date_fin"].isoformat(),
                    "date_debut_vacances": trimestre["date_debut_vacances"].isoformat(),
                    "date_fin_vacances": trimestre["date_fin_vacances"].isoformat(),
                    "date_creation": datetime.now(timezone.utc).isoformat(),
                    "date_modification": datetime.now(timezone.utc).isoformat()
                }
                await self.db.trimestres.insert_one(trimestre_doc)
                print(f"✅ Trimestre créé: {trimestre['nom']}")
                
    async def init_sample_invoices(self):
        """Créer quelques factures exemples"""
        # Récupérer quelques élèves pour les factures
        eleves = await self.db.eleves.find().limit(3).to_list(length=None)
        
        if not eleves:
            print("⚠️  Pas d'élèves trouvés pour créer les factures")
            return
            
        invoice_types = [
            {"titre": "Frais de Scolarité - 1er Trimestre", "montant": 500000, "type_frais": ["scolarite"]},
            {"titre": "Frais d'Inscription", "montant": 150000, "type_frais": ["inscription"]}, 
            {"titre": "Frais de Cantine", "montant": 200000, "type_frais": ["cantine"]}
        ]
        
        for i, eleve in enumerate(eleves):
            invoice = invoice_types[i % len(invoice_types)]
            
            facture_doc = {
                "_id": str(uuid.uuid4()),
                "numero_facture": f"FACT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4().int)[:6]}",
                "eleve_id": eleve["_id"],
                **invoice,
                "description": f"Facture pour {eleve['nom']} {eleve['prenoms']} - Classe {eleve['classe']}",
                "montant_total": invoice["montant"],
                "montant_paye": 0,
                "montant_restant": invoice["montant"],
                "statut": "emise",
                "date_emission": datetime.now(timezone.utc).isoformat(),
                "date_echeance": (datetime.now(timezone.utc) + timedelta(days=30)).date().isoformat(),
                "date_creation": datetime.now(timezone.utc).isoformat(),
                "date_modification": datetime.now(timezone.utc).isoformat()
            }
            
            await self.db.factures.insert_one(facture_doc)
            print(f"✅ Facture créée: {invoice['titre']} pour {eleve['nom']} {eleve['prenoms']}")
    
    async def initialize_all(self):
        """Initialiser toutes les données de production"""
        print("🚀 Initialisation des données de production École Smart...")
        print("=" * 60)
        
        await self.init_admin_user()
        await self.init_sample_teachers()
        await self.init_sample_parents()
        await self.init_subjects()
        await self.init_sample_students()
        await self.init_academic_year()
        await self.init_sample_invoices()
        
        print("=" * 60)
        print("✅ Initialisation terminée avec succès!")
        print("\n📋 COMPTES DE TEST CRÉÉS:")
        print("👨‍💼 Administrateur: admin@ecole-smart.gn / Admin2024!")
        print("👨‍🏫 Enseignant Math: prof.mathematiques@ecole-smart.gn / Prof2024!")
        print("👨‍🏫 Enseignant Français: prof.francais@ecole-smart.gn / Prof2024!")
        print("👨‍👩‍👧‍👦 Parent 1: parent.camara@gmail.com / Parent2024!")
        print("👨‍👩‍👧‍👦 Parent 2: parent.sylla@yahoo.com / Parent2024!")
        print("\n🏫 École Smart est prête pour la production!")
        
        self.client.close()

async def main():
    initializer = ProductionDataInitializer()
    await initializer.initialize_all()

if __name__ == "__main__":
    asyncio.run(main())