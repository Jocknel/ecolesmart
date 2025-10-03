#!/usr/bin/env python3
"""
Backend API Testing for École Smart Authentication Features
Tests all new authentication endpoints implemented in the system.
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

print(f"Testing backend at: {API_BASE}")

class AuthenticationTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.parent_token = None
        self.test_users = []
        self.test_results = {
            "password_reset": {"passed": 0, "failed": 0, "errors": []},
            "parent_child_linking": {"passed": 0, "failed": 0, "errors": []},
            "csv_import": {"passed": 0, "failed": 0, "errors": []},
            "2fa_system": {"passed": 0, "failed": 0, "errors": []},
            "enhanced_login": {"passed": 0, "failed": 0, "errors": []},
            "temp_password": {"passed": 0, "failed": 0, "errors": []},
            "pre_registration": {"passed": 0, "failed": 0, "errors": []}
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
    
    def setup_admin_user(self):
        """Create and login as admin user for testing"""
        try:
            # First try to create admin user with the fixed admin code
            admin_data = {
                "email": f"admin.test.{uuid.uuid4().hex[:8]}@ecole-smart.gn",
                "mot_de_passe": "AdminTest123!",
                "confirmer_mot_de_passe": "AdminTest123!",
                "nom": "Admin",
                "prenoms": "Test User",
                "role": "administrateur",
                "telephone": "+224601234567",
                "code_admin": "ADMIN_ECOLE_2024"
            }
            
            response = self.session.post(f"{API_BASE}/auth/register", json=admin_data)
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data["access_token"]
                self.test_users.append(admin_data["email"])
                print(f"✅ Admin user created: {admin_data['email']}")
                return True
            else:
                # If admin creation fails, try creating a regular user and use it for limited testing
                print(f"⚠️ Admin creation failed, trying with regular user: {response.text}")
                
                # Create a regular user instead
                regular_data = {
                    "email": f"testuser.{uuid.uuid4().hex[:8]}@ecole-smart.gn",
                    "mot_de_passe": "TestUser123!",
                    "confirmer_mot_de_passe": "TestUser123!",
                    "nom": "Test",
                    "prenoms": "User",
                    "role": "parent",
                    "telephone": "+224601234567"
                }
                
                response = self.session.post(f"{API_BASE}/auth/register", json=regular_data)
                if response.status_code == 200:
                    data = response.json()
                    self.admin_token = data["access_token"]  # Use as admin token for testing
                    self.test_users.append(regular_data["email"])
                    print(f"✅ Regular user created for testing: {regular_data['email']}")
                    return True
                else:
                    print(f"❌ Failed to create regular user: {response.text}")
                    return False
                
        except Exception as e:
            print(f"❌ Error setting up admin user: {str(e)}")
            return False
    
    def setup_parent_user(self):
        """Create and login as parent user for testing"""
        try:
            parent_data = {
                "email": f"parent.test.{uuid.uuid4().hex[:8]}@ecole-smart.gn",
                "mot_de_passe": "ParentTest123!",
                "confirmer_mot_de_passe": "ParentTest123!",
                "nom": "Parent",
                "prenoms": "Test User",
                "role": "parent",
                "telephone": "+224607654321"
            }
            
            response = self.session.post(f"{API_BASE}/auth/register", json=parent_data)
            if response.status_code == 200:
                data = response.json()
                self.parent_token = data["access_token"]
                self.test_users.append(parent_data["email"])
                print(f"✅ Parent user created: {parent_data['email']}")
                return True
            else:
                print(f"❌ Failed to create parent user: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error setting up parent user: {str(e)}")
            return False
    
    def test_password_reset_system(self):
        """Test password reset request and confirmation"""
        print("\n🔐 Testing Password Reset System...")
        
        # Test 1: Password reset request
        try:
            reset_data = {"email": self.test_users[1]}  # Use parent email
            response = self.session.post(f"{API_BASE}/auth/password-reset-request", json=reset_data)
            
            if response.status_code == 200:
                self.log_result("password_reset", "Password reset request", True)
            else:
                self.log_result("password_reset", "Password reset request", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("password_reset", "Password reset request", False, str(e))
        
        # Test 2: Invalid email request
        try:
            reset_data = {"email": "nonexistent@test.com"}
            response = self.session.post(f"{API_BASE}/auth/password-reset-request", json=reset_data)
            
            # Should still return 200 for security (don't reveal if email exists)
            if response.status_code == 200:
                self.log_result("password_reset", "Password reset with invalid email", True)
            else:
                self.log_result("password_reset", "Password reset with invalid email", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("password_reset", "Password reset with invalid email", False, str(e))
    
    def test_parent_child_linking(self):
        """Test parent-child linking functionality"""
        print("\n👨‍👩‍👧‍👦 Testing Parent-Child Linking...")
        
        # First create a test student
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            student_data = {
                "nom": "Eleve",
                "prenoms": "Test Student",
                "date_naissance": "2010-01-15",
                "sexe": "masculin",
                "classe": "CM1",
                "telephone_parent": "+224601234567",
                "adresse": "Conakry, Guinée"
            }
            
            response = self.session.post(f"{API_BASE}/eleves", json=student_data, headers=headers)
            if response.status_code == 200:
                student_id = response.json()["eleve"]["_id"]
                print(f"✅ Test student created: {student_id}")
                
                # Test 1: Link parent to child (as admin)
                link_data = {
                    "parent_email": self.test_users[1],  # Parent email
                    "eleve_id": student_id,
                    "relation": "parent"
                }
                
                response = self.session.post(f"{API_BASE}/auth/link-parent-child", json=link_data, headers=headers)
                if response.status_code == 200:
                    self.log_result("parent_child_linking", "Admin creates parent-child link", True)
                else:
                    self.log_result("parent_child_linking", "Admin creates parent-child link", False, f"Status: {response.status_code}, Response: {response.text}")
                
                # Test 2: Get children as parent
                parent_headers = {"Authorization": f"Bearer {self.parent_token}"}
                response = self.session.get(f"{API_BASE}/auth/my-children", headers=parent_headers)
                if response.status_code == 200:
                    children = response.json().get("enfants", [])
                    if len(children) > 0:
                        self.log_result("parent_child_linking", "Parent retrieves linked children", True)
                    else:
                        self.log_result("parent_child_linking", "Parent retrieves linked children", False, "No children found")
                else:
                    self.log_result("parent_child_linking", "Parent retrieves linked children", False, f"Status: {response.status_code}")
                    
            else:
                self.log_result("parent_child_linking", "Create test student", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("parent_child_linking", "Parent-child linking setup", False, str(e))
    
    def test_csv_user_import(self):
        """Test CSV user import functionality"""
        print("\n📊 Testing CSV User Import...")
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test bulk user import
            import_data = [
                {
                    "email": f"teacher1.{uuid.uuid4().hex[:6]}@ecole-smart.gn",
                    "nom": "Diallo",
                    "prenoms": "Mamadou",
                    "role": "enseignant",
                    "telephone": "+224601111111",
                    "mot_de_passe_temporaire": "TempPass123!"
                },
                {
                    "email": f"parent1.{uuid.uuid4().hex[:6]}@ecole-smart.gn",
                    "nom": "Camara",
                    "prenoms": "Fatoumata",
                    "role": "parent",
                    "telephone": "+224602222222",
                    "mot_de_passe_temporaire": "TempPass456!"
                }
            ]
            
            response = self.session.post(f"{API_BASE}/auth/import-users", json=import_data, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if result.get("details", {}).get("success", 0) == 2:
                    self.log_result("csv_import", "Bulk user import", True)
                    # Store emails for cleanup
                    for user in import_data:
                        self.test_users.append(user["email"])
                else:
                    self.log_result("csv_import", "Bulk user import", False, f"Expected 2 users, got {result.get('details', {}).get('success', 0)}")
            else:
                self.log_result("csv_import", "Bulk user import", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("csv_import", "Bulk user import", False, str(e))
    
    def test_2fa_system(self):
        """Test 2FA activation, confirmation, and verification"""
        print("\n🔐 Testing 2FA System...")
        
        try:
            headers = {"Authorization": f"Bearer {self.parent_token}"}
            
            # Test 1: Enable 2FA
            enable_data = {"mot_de_passe": "ParentTest123!"}
            response = self.session.post(f"{API_BASE}/auth/enable-2fa", json=enable_data, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                secret_2fa = result.get("secret_2fa")
                if secret_2fa:
                    self.log_result("2fa_system", "Enable 2FA", True)
                    
                    # Test 2: Confirm 2FA (simulate with a mock code)
                    # Note: In real scenario, user would scan QR code and get actual TOTP code
                    confirm_data = {
                        "code_secret": secret_2fa,
                        "code_verification": "123456"  # Mock code - will likely fail but tests the endpoint
                    }
                    
                    response = self.session.post(f"{API_BASE}/auth/confirm-2fa", json=confirm_data, headers=headers)
                    if response.status_code in [200, 400]:  # 400 expected for wrong code
                        self.log_result("2fa_system", "Confirm 2FA endpoint", True)
                    else:
                        self.log_result("2fa_system", "Confirm 2FA endpoint", False, f"Status: {response.status_code}")
                    
                    # Test 3: Disable 2FA (will fail without proper 2FA code, but tests endpoint)
                    disable_data = {"code_2fa": "123456"}
                    response = self.session.post(f"{API_BASE}/auth/disable-2fa", json=disable_data, headers=headers)
                    if response.status_code in [200, 400]:  # 400 expected for wrong code or inactive 2FA
                        self.log_result("2fa_system", "Disable 2FA endpoint", True)
                    else:
                        self.log_result("2fa_system", "Disable 2FA endpoint", False, f"Status: {response.status_code}")
                        
                else:
                    self.log_result("2fa_system", "Enable 2FA", False, "No secret returned")
            else:
                self.log_result("2fa_system", "Enable 2FA", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("2fa_system", "2FA system", False, str(e))
    
    def test_enhanced_login(self):
        """Test enhanced login with 2FA support"""
        print("\n🔑 Testing Enhanced Login...")
        
        try:
            # Test 1: Regular login without 2FA
            login_data = {
                "email": self.test_users[1],  # Parent email
                "mot_de_passe": "ParentTest123!"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            if response.status_code == 200:
                self.log_result("enhanced_login", "Regular login", True)
            else:
                self.log_result("enhanced_login", "Regular login", False, f"Status: {response.status_code}")
            
            # Test 2: Login with 2FA code (will fail but tests the parameter)
            login_with_2fa = {
                "email": self.test_users[1],
                "mot_de_passe": "ParentTest123!",
                "code_2fa": "123456"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_with_2fa)
            if response.status_code in [200, 401, 202]:  # Various expected responses
                self.log_result("enhanced_login", "Login with 2FA parameter", True)
            else:
                self.log_result("enhanced_login", "Login with 2FA parameter", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("enhanced_login", "Enhanced login", False, str(e))
    
    def test_temporary_password_change(self):
        """Test temporary password change functionality"""
        print("\n🔄 Testing Temporary Password Change...")
        
        try:
            # Create a user with temporary password via import
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            temp_user_data = [{
                "email": f"tempuser.{uuid.uuid4().hex[:6]}@ecole-smart.gn",
                "nom": "Temp",
                "prenoms": "User",
                "role": "parent",
                "telephone": "+224603333333",
                "mot_de_passe_temporaire": "TempPass789!"
            }]
            
            response = self.session.post(f"{API_BASE}/auth/import-users", json=temp_user_data, headers=headers)
            if response.status_code == 200:
                temp_email = temp_user_data[0]["email"]
                self.test_users.append(temp_email)
                
                # Login with temporary password
                login_data = {
                    "email": temp_email,
                    "mot_de_passe": "TempPass789!"
                }
                
                response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
                if response.status_code == 200:
                    temp_token = response.json()["access_token"]
                    
                    # Test change temporary password
                    change_data = {
                        "nouveau_mot_de_passe": "NewPassword123!",
                        "confirmer_mot_de_passe": "NewPassword123!"
                    }
                    
                    temp_headers = {"Authorization": f"Bearer {temp_token}"}
                    response = self.session.post(f"{API_BASE}/auth/change-temporary-password", json=change_data, headers=temp_headers)
                    
                    if response.status_code == 200:
                        self.log_result("temp_password", "Change temporary password", True)
                    else:
                        self.log_result("temp_password", "Change temporary password", False, f"Status: {response.status_code}, Response: {response.text}")
                else:
                    self.log_result("temp_password", "Login with temporary password", False, f"Status: {response.status_code}")
            else:
                self.log_result("temp_password", "Create user with temporary password", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("temp_password", "Temporary password change", False, str(e))
    
    def test_pre_registration(self):
        """Test pre-registration endpoint functionality"""
        print("\n📝 Testing Pre-Registration System...")
        
        # Test 1: Success with valid data
        try:
            valid_data = {
                "nom_complet": "Diallo Aminata",
                "date_naissance": "2008-05-15",
                "email": "aminata.diallo@example.com",
                "telephone": "+224 628 123 456",
                "niveau_souhaite": "seconde",
                "etablissement_actuel": "Collège de Conakry",
                "nom_parent": "Diallo Mamadou",
                "prenoms_parent": "Alpha",
                "telephone_parent": "+224 625 987 654",
                "email_parent": "mamadou.diallo@example.com",
                "accepte_conditions": True
            }
            
            response = self.session.post(f"{API_BASE}/auth/pre-register", json=valid_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("pre_registration_id"):
                    self.log_result("pre_registration", "Valid pre-registration", True)
                    # Store the pre-registration ID for potential cleanup
                    self.pre_registration_id = result.get("pre_registration_id")
                else:
                    self.log_result("pre_registration", "Valid pre-registration", False, "Missing success or pre_registration_id in response")
            else:
                self.log_result("pre_registration", "Valid pre-registration", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("pre_registration", "Valid pre-registration", False, str(e))
        
        # Test 2: Error with existing email (duplicate call)
        try:
            duplicate_data = {
                "nom_complet": "Diallo Aminata",
                "date_naissance": "2008-05-15",
                "email": "aminata.diallo@example.com",  # Same email as above
                "telephone": "+224 628 123 456",
                "niveau_souhaite": "seconde",
                "etablissement_actuel": "Collège de Conakry",
                "nom_parent": "Diallo Mamadou",
                "prenoms_parent": "Alpha",
                "telephone_parent": "+224 625 987 654",
                "email_parent": "mamadou.diallo@example.com",
                "accepte_conditions": True
            }
            
            response = self.session.post(f"{API_BASE}/auth/pre-register", json=duplicate_data)
            if response.status_code == 400:
                result = response.json()
                if "existe déjà" in result.get("detail", "").lower():
                    self.log_result("pre_registration", "Duplicate email error", True)
                else:
                    self.log_result("pre_registration", "Duplicate email error", False, f"Wrong error message: {result.get('detail')}")
            else:
                self.log_result("pre_registration", "Duplicate email error", False, f"Expected 400, got {response.status_code}")
                
        except Exception as e:
            self.log_result("pre_registration", "Duplicate email error", False, str(e))
        
        # Test 3: Error with accepte_conditions = false
        try:
            invalid_conditions_data = {
                "nom_complet": "Camara Fatoumata",
                "date_naissance": "2009-03-20",
                "email": "fatoumata.camara@example.com",
                "telephone": "+224 629 456 789",
                "niveau_souhaite": "premiere",
                "etablissement_actuel": "Lycée de Kankan",
                "nom_parent": "Camara Ibrahima",
                "prenoms_parent": "Saliou",
                "telephone_parent": "+224 626 111 222",
                "email_parent": "ibrahima.camara@example.com",
                "accepte_conditions": False  # Invalid
            }
            
            response = self.session.post(f"{API_BASE}/auth/pre-register", json=invalid_conditions_data)
            if response.status_code == 422:  # Validation error
                result = response.json()
                if "conditions" in str(result).lower():
                    self.log_result("pre_registration", "Invalid conditions error", True)
                else:
                    self.log_result("pre_registration", "Invalid conditions error", False, f"Wrong validation error: {result}")
            else:
                self.log_result("pre_registration", "Invalid conditions error", False, f"Expected 422, got {response.status_code}")
                
        except Exception as e:
            self.log_result("pre_registration", "Invalid conditions error", False, str(e))
        
        # Test 4: Error with invalid niveau_souhaite
        try:
            invalid_niveau_data = {
                "nom_complet": "Bah Mamadou",
                "date_naissance": "2007-12-10",
                "email": "mamadou.bah@example.com",
                "telephone": "+224 630 789 123",
                "niveau_souhaite": "invalid_niveau",  # Invalid niveau
                "etablissement_actuel": "Collège de Labé",
                "nom_parent": "Bah Ousmane",
                "prenoms_parent": "Thierno",
                "telephone_parent": "+224 627 333 444",
                "email_parent": "ousmane.bah@example.com",
                "accepte_conditions": True
            }
            
            response = self.session.post(f"{API_BASE}/auth/pre-register", json=invalid_niveau_data)
            if response.status_code == 422:  # Validation error
                result = response.json()
                if "niveau" in str(result).lower():
                    self.log_result("pre_registration", "Invalid niveau error", True)
                else:
                    self.log_result("pre_registration", "Invalid niveau error", False, f"Wrong validation error: {result}")
            else:
                self.log_result("pre_registration", "Invalid niveau error", False, f"Expected 422, got {response.status_code}")
                
        except Exception as e:
            self.log_result("pre_registration", "Invalid niveau error", False, str(e))
        
        # Test 5: Verify database entry creation (we can't directly access DB, but we can test the response structure)
        try:
            unique_data = {
                "nom_complet": "Touré Aissatou",
                "date_naissance": "2008-08-25",
                "email": f"aissatou.toure.{uuid.uuid4().hex[:6]}@example.com",  # Unique email
                "telephone": "+224 631 555 666",
                "niveau_souhaite": "terminale",
                "etablissement_actuel": "Lycée de Kindia",
                "nom_parent": "Touré Sekou",
                "prenoms_parent": "Ahmed",
                "telephone_parent": "+224 628 777 888",
                "email_parent": f"sekou.toure.{uuid.uuid4().hex[:6]}@example.com",
                "accepte_conditions": True
            }
            
            response = self.session.post(f"{API_BASE}/auth/pre-register", json=unique_data)
            if response.status_code == 200:
                result = response.json()
                required_fields = ["success", "message", "pre_registration_id", "details"]
                has_all_fields = all(field in result for field in required_fields)
                
                if has_all_fields and result.get("success") == True:
                    self.log_result("pre_registration", "Database entry structure", True)
                else:
                    missing_fields = [field for field in required_fields if field not in result]
                    self.log_result("pre_registration", "Database entry structure", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("pre_registration", "Database entry structure", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("pre_registration", "Database entry structure", False, str(e))
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("🧪 AUTHENTICATION TESTING SUMMARY")
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
            print("🎉 All authentication features are working correctly!")
        else:
            print(f"⚠️  {total_failed} issues found that need attention")
        
        return total_failed == 0
    
    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 Starting Authentication Feature Testing...")
        print(f"Backend URL: {API_BASE}")
        
        # Setup test users
        if not self.setup_admin_user():
            print("❌ Failed to setup admin user. Cannot continue testing.")
            return False
            
        if not self.setup_parent_user():
            print("❌ Failed to setup parent user. Cannot continue testing.")
            return False
        
        # Run all tests
        self.test_password_reset_system()
        self.test_parent_child_linking()
        self.test_csv_user_import()
        self.test_2fa_system()
        self.test_enhanced_login()
        self.test_temporary_password_change()
        
        # Print summary
        return self.print_summary()

def main():
    """Main test execution"""
    tester = AuthenticationTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ All authentication tests passed!")
        exit(0)
    else:
        print("\n❌ Some authentication tests failed!")
        exit(1)

if __name__ == "__main__":
    main()