#!/usr/bin/env python3
"""
WoooW Invites Backend API Testing
Tests all backend endpoints for the wedding invitation platform
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://wooow-invites-fork.preview.emergentagent.com/api"

# Test credentials from test_result.md
ADMIN_EMAIL = "creanadi@gmail.com"
ADMIN_PASSWORD = "123456"

# Global variables for test state
auth_token = None
test_results = []

def log_test(test_name, success, details="", response_data=None):
    """Log test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   Details: {details}")
    if response_data and not success:
        print(f"   Response: {response_data}")
    
    test_results.append({
        "test": test_name,
        "success": success,
        "details": details,
        "response": response_data
    })

def test_admin_login():
    """Test 1: POST /api/auth/login"""
    global auth_token
    
    print("\n=== Testing Admin Authentication ===")
    
    try:
        payload = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = requests.post(f"{BACKEND_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "email" in data:
                auth_token = data["token"]
                log_test("Admin Login", True, f"Token received for {data['email']}")
                return True
            else:
                log_test("Admin Login", False, "Missing token or email in response", data)
                return False
        else:
            log_test("Admin Login", False, f"HTTP {response.status_code}", response.text)
            return False
            
    except Exception as e:
        log_test("Admin Login", False, f"Exception: {str(e)}")
        return False

def test_get_invite_demo():
    """Test 2: GET /api/invite/demo"""
    print("\n=== Testing Get Invite (Public) ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/invite/demo", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["slug", "couple", "story", "events", "gallery"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                log_test("Get Invite Demo", True, f"All required fields present. Couple: {data['couple']['bride']} & {data['couple']['groom']}")
                return True
            else:
                log_test("Get Invite Demo", False, f"Missing fields: {missing_fields}", data)
                return False
        else:
            log_test("Get Invite Demo", False, f"HTTP {response.status_code}", response.text)
            return False
            
    except Exception as e:
        log_test("Get Invite Demo", False, f"Exception: {str(e)}")
        return False

def test_get_designs():
    """Test 3: GET /api/designs"""
    print("\n=== Testing List Designs ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/designs", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                design = data[0]
                required_fields = ["id", "name", "description", "thumbnail"]
                missing_fields = [field for field in required_fields if field not in design]
                
                if not missing_fields:
                    log_test("List Designs", True, f"Found {len(data)} designs. First: {design['name']}")
                    return True
                else:
                    log_test("List Designs", False, f"Missing fields in design: {missing_fields}", design)
                    return False
            else:
                log_test("List Designs", False, "No designs found or invalid format", data)
                return False
        else:
            log_test("List Designs", False, f"HTTP {response.status_code}", response.text)
            return False
            
    except Exception as e:
        log_test("List Designs", False, f"Exception: {str(e)}")
        return False

def test_get_languages():
    """Test 4: GET /api/languages"""
    print("\n=== Testing List Languages ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/languages", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                lang = data[0]
                required_fields = ["code", "name"]
                missing_fields = [field for field in required_fields if field not in lang]
                
                if not missing_fields:
                    log_test("List Languages", True, f"Found {len(data)} languages. First: {lang['name']} ({lang['code']})")
                    return True
                else:
                    log_test("List Languages", False, f"Missing fields in language: {missing_fields}", lang)
                    return False
            else:
                log_test("List Languages", False, "No languages found or invalid format", data)
                return False
        else:
            log_test("List Languages", False, f"HTTP {response.status_code}", response.text)
            return False
            
    except Exception as e:
        log_test("List Languages", False, f"Exception: {str(e)}")
        return False

def test_submit_rsvp():
    """Test 5: POST /api/rsvp"""
    print("\n=== Testing Submit RSVP ===")
    
    try:
        payload = {
            "invite_slug": "demo",
            "name": "Test Guest",
            "email": "test@example.com",
            "attending": "yes",
            "guests": 2,
            "message": "Looking forward to it!"
        }
        
        response = requests.post(f"{BACKEND_URL}/rsvp", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "successfully" in data["message"].lower():
                log_test("Submit RSVP", True, "RSVP submitted successfully")
                return True
            else:
                log_test("Submit RSVP", False, "Unexpected response format", data)
                return False
        else:
            log_test("Submit RSVP", False, f"HTTP {response.status_code}", response.text)
            return False
            
    except Exception as e:
        log_test("Submit RSVP", False, f"Exception: {str(e)}")
        return False

def test_get_rsvp_list():
    """Test 6: GET /api/rsvp (with JWT auth)"""
    print("\n=== Testing List RSVP (Admin) ===")
    
    if not auth_token:
        log_test("List RSVP", False, "No auth token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BACKEND_URL}/rsvp", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                if len(data) > 0:
                    rsvp = data[0]
                    required_fields = ["name", "email", "attending", "invite_slug"]
                    missing_fields = [field for field in required_fields if field not in rsvp]
                    
                    if not missing_fields:
                        log_test("List RSVP", True, f"Found {len(data)} RSVP responses. Latest: {rsvp['name']}")
                        return True
                    else:
                        log_test("List RSVP", False, f"Missing fields in RSVP: {missing_fields}", rsvp)
                        return False
                else:
                    log_test("List RSVP", True, "No RSVP responses found (empty list is valid)")
                    return True
            else:
                log_test("List RSVP", False, "Invalid response format", data)
                return False
        else:
            log_test("List RSVP", False, f"HTTP {response.status_code}", response.text)
            return False
            
    except Exception as e:
        log_test("List RSVP", False, f"Exception: {str(e)}")
        return False

def test_get_admin_invites():
    """Test 7: GET /api/admin/invites (with JWT auth)"""
    print("\n=== Testing List Admin Invites ===")
    
    if not auth_token:
        log_test("List Admin Invites", False, "No auth token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BACKEND_URL}/admin/invites", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                invite = data[0]
                required_fields = ["slug", "couple", "design_id"]
                missing_fields = [field for field in required_fields if field not in invite]
                
                if not missing_fields:
                    log_test("List Admin Invites", True, f"Found {len(data)} invites. First: {invite['slug']}")
                    return True
                else:
                    log_test("List Admin Invites", False, f"Missing fields in invite: {missing_fields}", invite)
                    return False
            else:
                log_test("List Admin Invites", False, "No invites found or invalid format", data)
                return False
        else:
            log_test("List Admin Invites", False, f"HTTP {response.status_code}", response.text)
            return False
            
    except Exception as e:
        log_test("List Admin Invites", False, f"Exception: {str(e)}")
        return False

def run_all_tests():
    """Run all tests in sequence"""
    print(f"🚀 Starting WoooW Invites Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    # Test sequence as specified in review request
    tests = [
        test_admin_login,
        test_get_invite_demo,
        test_get_designs,
        test_get_languages,
        test_submit_rsvp,
        test_get_rsvp_list,
        test_get_admin_invites
    ]
    
    passed = 0
    total = len(tests)
    
    for test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"❌ CRITICAL ERROR in {test_func.__name__}: {str(e)}")
    
    # Summary
    print(f"\n{'='*50}")
    print(f"🏁 TEST SUMMARY")
    print(f"{'='*50}")
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        return True
    else:
        print("⚠️  SOME TESTS FAILED!")
        print("\nFailed Tests:")
        for result in test_results:
            if not result["success"]:
                print(f"  - {result['test']}: {result['details']}")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)