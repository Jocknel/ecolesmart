#!/usr/bin/env python3
"""
Verification script to check specific requirements from the review request
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend env
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

def verify_requirements():
    """Verify specific requirements from the review request"""
    print("🔍 Verifying Specific Requirements...")
    
    # Login as admin
    login_data = {
        "email": "admin@ecole-smart.gn",
        "mot_de_passe": "Admin2024!"
    }
    
    session = requests.Session()
    response = session.post(f"{API_BASE}/auth/login", json=login_data)
    
    if response.status_code != 200:
        print("❌ Failed to login as admin")
        return
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("✅ Admin authentication successful")
    
    # 1. Test demo data generation
    print("\n1. Testing POST /api/admin/generer-donnees-demo")
    response = session.post(f"{API_BASE}/admin/generer-donnees-demo", headers=headers)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Demo data generation: {result.get('message', 'Success')}")
    else:
        print(f"❌ Demo data generation failed: {response.status_code}")
    
    # 2. Test KPI endpoint
    print("\n2. Testing GET /api/admin/kpi")
    response = session.get(f"{API_BASE}/admin/kpi", headers=headers)
    if response.status_code == 200:
        kpi = response.json()
        print("✅ KPI endpoint successful")
        print(f"   • Effectif total: {kpi.get('effectif_total')} (should be 1247)")
        print(f"   • Taux présence: {kpi.get('taux_presence')}%")
        print(f"   • Paiements mois: {kpi.get('paiements_mois')}%")
        print(f"   • Paiements montant: {kpi.get('paiements_montant')} millions GNF")
        print(f"   • Alertes actives: {kpi.get('alertes_actives')}")
        
        # Verify 1247 students requirement
        if kpi.get('effectif_total') == 1247:
            print("✅ Correct student count (1247) verified")
        else:
            print(f"❌ Student count mismatch: expected 1247, got {kpi.get('effectif_total')}")
    else:
        print(f"❌ KPI endpoint failed: {response.status_code}")
    
    # 3. Test dashboard endpoint
    print("\n3. Testing GET /api/admin/dashboard?periode=mois")
    response = session.get(f"{API_BASE}/admin/dashboard?periode=mois", headers=headers)
    if response.status_code == 200:
        dashboard = response.json()
        print("✅ Dashboard endpoint successful")
        
        # Verify DashboardAdminResponse structure
        required_sections = ["kpi", "alertes_critiques", "actions_requises", "activite_recente", 
                           "evenements_calendrier", "statistiques_classes", "tendances"]
        
        print("   Dashboard sections:")
        for section in required_sections:
            if section in dashboard:
                print(f"   ✅ {section}")
                if section == "statistiques_classes":
                    classes = dashboard[section]
                    print(f"      • {len(classes)} classes with statistics")
                    if classes:
                        print(f"      • Sample class: {classes[0].get('classe')} - {classes[0].get('effectif')} students")
                elif section == "alertes_critiques":
                    alerts = dashboard[section]
                    print(f"      • {len(alerts)} critical alerts")
                elif section == "actions_requises":
                    actions = dashboard[section]
                    print(f"      • {len(actions)} required actions")
            else:
                print(f"   ❌ {section} missing")
        
        # Verify KPI consistency
        dashboard_kpi = dashboard.get("kpi", {})
        if dashboard_kpi.get('effectif_total') == 1247:
            print("✅ Dashboard KPI consistency verified")
        else:
            print(f"❌ Dashboard KPI inconsistency: {dashboard_kpi.get('effectif_total')}")
            
    else:
        print(f"❌ Dashboard endpoint failed: {response.status_code}")
    
    print("\n🎯 Requirements Verification Complete!")

if __name__ == "__main__":
    verify_requirements()