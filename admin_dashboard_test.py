#!/usr/bin/env python3
"""
Admin Dashboard Testing for École Smart
Tests the new admin dashboard endpoints that were added to the backend.
"""

import requests
import json
import time
import uuid
from datetime import datetime, date
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend env
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing admin dashboard at: {API_BASE}")

class AdminDashboardTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = {
            "admin_auth": {"passed": 0, "failed": 0, "errors": []},
            "demo_data_generation": {"passed": 0, "failed": 0, "errors": []},
            "kpi_endpoint": {"passed": 0, "failed": 0, "errors": []},
            "dashboard_endpoint": {"passed": 0, "failed": 0, "errors": []}
        }
    
    def log_result(self, category, test_name, success, error_msg=None):
        """Log test result"""
        if success:
            self.test_results[category]["passed"] += 1
            print(f"✅ {test_name}")
        else:
            self.test_results[category]["failed"] += 1
            self.test_results[category]["errors"].append(f"{test_name}: {error_msg}")
            print(f"❌ {test_name}: {error_msg}")
    
    def setup_admin_authentication(self):
        """Authenticate as admin user using provided credentials or create one"""
        print("\n🔐 Testing Admin Authentication...")
        
        try:
            # First try to login with provided credentials
            login_data = {
                "email": "admin@ecole-smart.gn",
                "mot_de_passe": "Admin2024!"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get("access_token")
                user_role = data.get("user", {}).get("role")
                
                if self.admin_token and user_role == "administrateur":
                    self.log_result("admin_auth", "Admin login with provided credentials", True)
                    return True
                else:
                    self.log_result("admin_auth", "Admin login", False, f"Missing token or wrong role: {user_role}")
                    return False
            else:
                # If login fails, try to create admin user (might be first admin)
                print("⚠️ Admin login failed, attempting to create admin user...")
                
                admin_data = {
                    "email": "admin@ecole-smart.gn",
                    "mot_de_passe": "Admin2024!",
                    "confirmer_mot_de_passe": "Admin2024!",
                    "nom": "Admin",
                    "prenoms": "Système",
                    "role": "administrateur",
                    "telephone": "+224601234567",
                    "code_admin": "ADMIN_ECOLE_2024"
                }
                
                register_response = self.session.post(f"{API_BASE}/auth/register", json=admin_data)
                if register_response.status_code == 200:
                    data = register_response.json()
                    self.admin_token = data.get("access_token")
                    user_role = data.get("user", {}).get("role")
                    
                    if self.admin_token and user_role == "administrateur":
                        self.log_result("admin_auth", "Admin user created and authenticated", True)
                        return True
                    else:
                        self.log_result("admin_auth", "Admin creation", False, f"Missing token or wrong role: {user_role}")
                        return False
                else:
                    self.log_result("admin_auth", "Admin creation", False, f"Status: {register_response.status_code}, Response: {register_response.text}")
                    return False
                
        except Exception as e:
            self.log_result("admin_auth", "Admin authentication", False, str(e))
            return False
    
    def test_demo_data_generation(self):
        """Test POST /api/admin/generer-donnees-demo endpoint"""
        print("\n📊 Testing Demo Data Generation...")
        
        if not self.admin_token:
            self.log_result("demo_data_generation", "Demo data generation", False, "No admin token available")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test the demo data generation endpoint
            response = self.session.post(f"{API_BASE}/admin/generer-donnees-demo", headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") == True:
                    self.log_result("demo_data_generation", "Demo data generation successful", True)
                    
                    # Verify the response structure
                    if "message" in result:
                        self.log_result("demo_data_generation", "Response contains success message", True)
                    else:
                        self.log_result("demo_data_generation", "Response contains success message", False, "Missing message field")
                else:
                    self.log_result("demo_data_generation", "Demo data generation", False, f"Success field is not True: {result}")
            else:
                self.log_result("demo_data_generation", "Demo data generation", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("demo_data_generation", "Demo data generation", False, str(e))
        
        # Test permission check - try without admin token
        try:
            response = self.session.post(f"{API_BASE}/admin/generer-donnees-demo")
            if response.status_code in [401, 403]:  # Both are valid for unauthorized access
                self.log_result("demo_data_generation", "Permission check (no token)", True)
            else:
                self.log_result("demo_data_generation", "Permission check (no token)", False, f"Expected 401 or 403, got {response.status_code}")
        except Exception as e:
            self.log_result("demo_data_generation", "Permission check", False, str(e))
    
    def test_kpi_endpoint(self):
        """Test GET /api/admin/kpi endpoint"""
        print("\n📈 Testing KPI Endpoint...")
        
        if not self.admin_token:
            self.log_result("kpi_endpoint", "KPI endpoint", False, "No admin token available")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test the KPI endpoint
            response = self.session.get(f"{API_BASE}/admin/kpi", headers=headers)
            
            if response.status_code == 200:
                kpi_data = response.json()
                
                # Verify KPI structure according to KPIData model
                required_fields = ["effectif_total", "taux_presence", "paiements_mois", "paiements_montant", "alertes_actives"]
                missing_fields = [field for field in required_fields if field not in kpi_data]
                
                if not missing_fields:
                    self.log_result("kpi_endpoint", "KPI structure complete", True)
                    
                    # Verify data types and reasonable values
                    try:
                        effectif_total = kpi_data["effectif_total"]
                        taux_presence = kpi_data["taux_presence"]
                        paiements_mois = kpi_data["paiements_mois"]
                        paiements_montant = kpi_data["paiements_montant"]
                        alertes_actives = kpi_data["alertes_actives"]
                        
                        # Check if we have the expected 1247 students
                        if effectif_total == 1247:
                            self.log_result("kpi_endpoint", "Correct student count (1247)", True)
                        else:
                            self.log_result("kpi_endpoint", "Student count", False, f"Expected 1247, got {effectif_total}")
                        
                        # Check data types and ranges
                        if isinstance(taux_presence, (int, float)) and 0 <= taux_presence <= 100:
                            self.log_result("kpi_endpoint", "Valid attendance rate", True)
                        else:
                            self.log_result("kpi_endpoint", "Valid attendance rate", False, f"Invalid rate: {taux_presence}")
                        
                        if isinstance(paiements_mois, (int, float)) and paiements_mois >= 0:
                            self.log_result("kpi_endpoint", "Valid payment percentage", True)
                        else:
                            self.log_result("kpi_endpoint", "Valid payment percentage", False, f"Invalid percentage: {paiements_mois}")
                        
                        if isinstance(paiements_montant, int) and paiements_montant >= 0:
                            self.log_result("kpi_endpoint", "Valid payment amount", True)
                        else:
                            self.log_result("kpi_endpoint", "Valid payment amount", False, f"Invalid amount: {paiements_montant}")
                        
                        if isinstance(alertes_actives, int) and alertes_actives >= 0:
                            self.log_result("kpi_endpoint", "Valid alerts count", True)
                        else:
                            self.log_result("kpi_endpoint", "Valid alerts count", False, f"Invalid count: {alertes_actives}")
                            
                    except Exception as e:
                        self.log_result("kpi_endpoint", "KPI data validation", False, str(e))
                        
                else:
                    self.log_result("kpi_endpoint", "KPI structure", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("kpi_endpoint", "KPI endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("kpi_endpoint", "KPI endpoint", False, str(e))
        
        # Test permission check
        try:
            response = self.session.get(f"{API_BASE}/admin/kpi")
            if response.status_code == 401:
                self.log_result("kpi_endpoint", "Permission check (no token)", True)
            else:
                self.log_result("kpi_endpoint", "Permission check (no token)", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("kpi_endpoint", "Permission check", False, str(e))
    
    def test_dashboard_endpoint(self):
        """Test GET /api/admin/dashboard endpoint"""
        print("\n🏠 Testing Dashboard Endpoint...")
        
        if not self.admin_token:
            self.log_result("dashboard_endpoint", "Dashboard endpoint", False, "No admin token available")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test 1: Dashboard with default period (mois)
            response = self.session.get(f"{API_BASE}/admin/dashboard", headers=headers)
            
            if response.status_code == 200:
                dashboard_data = response.json()
                
                # Verify DashboardAdminResponse structure
                required_sections = ["kpi", "alertes_critiques", "actions_requises", "activite_recente", 
                                   "evenements_calendrier", "statistiques_classes", "tendances"]
                missing_sections = [section for section in required_sections if section not in dashboard_data]
                
                if not missing_sections:
                    self.log_result("dashboard_endpoint", "Dashboard structure complete", True)
                    
                    # Test KPI section
                    kpi = dashboard_data.get("kpi", {})
                    kpi_fields = ["effectif_total", "taux_presence", "paiements_mois", "paiements_montant", "alertes_actives"]
                    if all(field in kpi for field in kpi_fields):
                        self.log_result("dashboard_endpoint", "KPI section complete", True)
                    else:
                        missing_kpi = [field for field in kpi_fields if field not in kpi]
                        self.log_result("dashboard_endpoint", "KPI section", False, f"Missing KPI fields: {missing_kpi}")
                    
                    # Test alertes_critiques section
                    alertes = dashboard_data.get("alertes_critiques", [])
                    if isinstance(alertes, list):
                        self.log_result("dashboard_endpoint", "Alerts section is list", True)
                        if alertes:  # If there are alerts, check structure
                            alert = alertes[0]
                            alert_fields = ["id", "type", "titre", "description", "date_creation", "statut", "priorite"]
                            if all(field in alert for field in alert_fields):
                                self.log_result("dashboard_endpoint", "Alert structure complete", True)
                            else:
                                missing_alert_fields = [field for field in alert_fields if field not in alert]
                                self.log_result("dashboard_endpoint", "Alert structure", False, f"Missing fields: {missing_alert_fields}")
                    else:
                        self.log_result("dashboard_endpoint", "Alerts section", False, "Not a list")
                    
                    # Test actions_requises section
                    actions = dashboard_data.get("actions_requises", [])
                    if isinstance(actions, list):
                        self.log_result("dashboard_endpoint", "Actions section is list", True)
                        if actions:  # If there are actions, check structure
                            action = actions[0]
                            action_fields = ["id", "titre", "description", "type", "date_creation", "statut"]
                            if all(field in action for field in action_fields):
                                self.log_result("dashboard_endpoint", "Action structure complete", True)
                            else:
                                missing_action_fields = [field for field in action_fields if field not in action]
                                self.log_result("dashboard_endpoint", "Action structure", False, f"Missing fields: {missing_action_fields}")
                    else:
                        self.log_result("dashboard_endpoint", "Actions section", False, "Not a list")
                    
                    # Test statistiques_classes section
                    stats_classes = dashboard_data.get("statistiques_classes", [])
                    if isinstance(stats_classes, list):
                        self.log_result("dashboard_endpoint", "Class stats section is list", True)
                        if stats_classes:  # If there are class stats, check structure
                            stat = stats_classes[0]
                            stat_fields = ["classe", "niveau", "effectif", "taux_presence"]
                            if all(field in stat for field in stat_fields):
                                self.log_result("dashboard_endpoint", "Class stat structure complete", True)
                            else:
                                missing_stat_fields = [field for field in stat_fields if field not in stat]
                                self.log_result("dashboard_endpoint", "Class stat structure", False, f"Missing fields: {missing_stat_fields}")
                    else:
                        self.log_result("dashboard_endpoint", "Class stats section", False, "Not a list")
                    
                    # Test tendances section
                    tendances = dashboard_data.get("tendances", {})
                    if isinstance(tendances, dict):
                        self.log_result("dashboard_endpoint", "Trends section is dict", True)
                        expected_trends = ["evolution_effectifs", "evolution_paiements", "top_classes_presence", "classes_attention"]
                        if all(trend in tendances for trend in expected_trends):
                            self.log_result("dashboard_endpoint", "Trends structure complete", True)
                        else:
                            missing_trends = [trend for trend in expected_trends if trend not in tendances]
                            self.log_result("dashboard_endpoint", "Trends structure", False, f"Missing trends: {missing_trends}")
                    else:
                        self.log_result("dashboard_endpoint", "Trends section", False, "Not a dict")
                        
                else:
                    self.log_result("dashboard_endpoint", "Dashboard structure", False, f"Missing sections: {missing_sections}")
            else:
                self.log_result("dashboard_endpoint", "Dashboard endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("dashboard_endpoint", "Dashboard endpoint", False, str(e))
        
        # Test 2: Dashboard with specific period parameter
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{API_BASE}/admin/dashboard?periode=mois", headers=headers)
            
            if response.status_code == 200:
                self.log_result("dashboard_endpoint", "Dashboard with period parameter", True)
            else:
                self.log_result("dashboard_endpoint", "Dashboard with period parameter", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("dashboard_endpoint", "Dashboard with period parameter", False, str(e))
        
        # Test permission check
        try:
            response = self.session.get(f"{API_BASE}/admin/dashboard")
            if response.status_code == 401:
                self.log_result("dashboard_endpoint", "Permission check (no token)", True)
            else:
                self.log_result("dashboard_endpoint", "Permission check (no token)", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("dashboard_endpoint", "Permission check", False, str(e))
    
    def test_data_consistency(self):
        """Test data consistency between endpoints"""
        print("\n🔄 Testing Data Consistency...")
        
        if not self.admin_token:
            print("⚠️ No admin token available for consistency testing")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Get KPI data
            kpi_response = self.session.get(f"{API_BASE}/admin/kpi", headers=headers)
            dashboard_response = self.session.get(f"{API_BASE}/admin/dashboard", headers=headers)
            
            if kpi_response.status_code == 200 and dashboard_response.status_code == 200:
                kpi_data = kpi_response.json()
                dashboard_data = dashboard_response.json()
                dashboard_kpi = dashboard_data.get("kpi", {})
                
                # Compare KPI data between endpoints
                consistency_checks = [
                    ("effectif_total", kpi_data.get("effectif_total"), dashboard_kpi.get("effectif_total")),
                    ("taux_presence", kpi_data.get("taux_presence"), dashboard_kpi.get("taux_presence")),
                    ("paiements_mois", kpi_data.get("paiements_mois"), dashboard_kpi.get("paiements_mois")),
                    ("paiements_montant", kpi_data.get("paiements_montant"), dashboard_kpi.get("paiements_montant")),
                    ("alertes_actives", kpi_data.get("alertes_actives"), dashboard_kpi.get("alertes_actives"))
                ]
                
                all_consistent = True
                for field, kpi_value, dashboard_value in consistency_checks:
                    if kpi_value != dashboard_value:
                        self.log_result("dashboard_endpoint", f"Data consistency - {field}", False, 
                                      f"KPI: {kpi_value}, Dashboard: {dashboard_value}")
                        all_consistent = False
                
                if all_consistent:
                    self.log_result("dashboard_endpoint", "Data consistency between endpoints", True)
                    
            else:
                self.log_result("dashboard_endpoint", "Data consistency check", False, 
                              f"KPI status: {kpi_response.status_code}, Dashboard status: {dashboard_response.status_code}")
                
        except Exception as e:
            self.log_result("dashboard_endpoint", "Data consistency check", False, str(e))
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("🧪 ADMIN DASHBOARD TESTING SUMMARY")
        print("="*60)
        
        total_passed = 0
        total_failed = 0
        
        for category, results in self.test_results.items():
            passed = results["passed"]
            failed = results["failed"]
            total_passed += passed
            total_failed += failed
            
            status = "✅" if failed == 0 else "❌"
            print(f"{status} {category.replace('_', ' ').title()}: {passed} passed, {failed} failed")
            
            if results["errors"]:
                for error in results["errors"]:
                    print(f"   • {error}")
        
        print("-" * 60)
        print(f"TOTAL: {total_passed} passed, {total_failed} failed")
        
        if total_failed == 0:
            print("🎉 All admin dashboard features are working correctly!")
        else:
            print(f"⚠️  {total_failed} issues found that need attention")
        
        return total_failed == 0
    
    def run_all_tests(self):
        """Run all admin dashboard tests"""
        print("🚀 Starting Admin Dashboard Testing...")
        print(f"Backend URL: {API_BASE}")
        
        # Setup admin authentication
        if not self.setup_admin_authentication():
            print("❌ Failed to authenticate as admin. Cannot continue testing.")
            return False
        
        # Run all tests in sequence
        self.test_demo_data_generation()
        self.test_kpi_endpoint()
        self.test_dashboard_endpoint()
        self.test_data_consistency()
        
        # Print summary
        return self.print_summary()

def main():
    """Main test execution"""
    tester = AdminDashboardTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ All admin dashboard tests passed!")
        exit(0)
    else:
        print("\n❌ Some admin dashboard tests failed!")
        exit(1)

if __name__ == "__main__":
    main()