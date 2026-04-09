#!/usr/bin/env python3
"""
Additional WoooW Invites Backend API Testing
Tests additional endpoints mentioned in test_result.md
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://wooow-invites-fork.preview.emergentagent.com/api"

# Test credentials
ADMIN_EMAIL = "creanadi@gmail.com"
ADMIN_PASSWORD = "123456"

def test_update_invite():
    """Test PUT /api/invite/demo (Admin)"""
    print("\n=== Testing Update Invite (Admin) ===")
    
    # First get auth token
    try:
        login_payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        login_response = requests.post(f"{BACKEND_URL}/auth/login", json=login_payload, timeout=10)
        
        if login_response.status_code != 200:
            print("❌ FAIL Update Invite - Could not authenticate")
            return False
            
        auth_token = login_response.json()["token"]
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Test update
        update_payload = {
            "tagline": "Test Updated Tagline",
            "couple": {
                "bride": "Manon",
                "groom": "Yassine",
                "hashtag": "#TestUpdate"
            }
        }
        
        response = requests.put(f"{BACKEND_URL}/invite/demo", json=update_payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("tagline") == "Test Updated Tagline":
                print("✅ PASS Update Invite")
                print(f"   Details: Successfully updated invite tagline")
                return True
            else:
                print("❌ FAIL Update Invite - Tagline not updated")
                print(f"   Response: {data}")
                return False
        else:
            print(f"❌ FAIL Update Invite - HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL Update Invite - Exception: {str(e)}")
        return False

def test_create_design():
    """Test POST /api/admin/designs (Admin)"""
    print("\n=== Testing Create Design (Admin) ===")
    
    # First get auth token
    try:
        login_payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        login_response = requests.post(f"{BACKEND_URL}/auth/login", json=login_payload, timeout=10)
        
        if login_response.status_code != 200:
            print("❌ FAIL Create Design - Could not authenticate")
            return False
            
        auth_token = login_response.json()["token"]
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Test create design
        design_payload = {
            "name": "Test Design",
            "description": "A test design for API testing",
            "thumbnail": "https://example.com/thumb.jpg",
            "heroBackground": "https://example.com/hero.jpg",
            "openingVideo": "",
            "openingPoster": "",
            "cssVars": {
                "primaryBg": "#ffffff",
                "primaryText": "#000000"
            }
        }
        
        response = requests.post(f"{BACKEND_URL}/admin/designs", json=design_payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "id" in data:
                print("✅ PASS Create Design")
                print(f"   Details: Design created with ID: {data['id']}")
                return True
            else:
                print("❌ FAIL Create Design - Unexpected response format")
                print(f"   Response: {data}")
                return False
        else:
            print(f"❌ FAIL Create Design - HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL Create Design - Exception: {str(e)}")
        return False

def test_file_upload():
    """Test POST /api/upload (Admin)"""
    print("\n=== Testing File Upload (Admin) ===")
    
    # First get auth token
    try:
        login_payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        login_response = requests.post(f"{BACKEND_URL}/auth/login", json=login_payload, timeout=10)
        
        if login_response.status_code != 200:
            print("❌ FAIL File Upload - Could not authenticate")
            return False
            
        auth_token = login_response.json()["token"]
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Create a simple test file
        test_content = b"This is a test file for upload testing"
        files = {"file": ("test.txt", test_content, "text/plain")}
        
        response = requests.post(f"{BACKEND_URL}/upload", files=files, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "url" in data and "filename" in data:
                print("✅ PASS File Upload")
                print(f"   Details: File uploaded successfully. URL: {data['url']}")
                return True
            else:
                print("❌ FAIL File Upload - Missing url or filename in response")
                print(f"   Response: {data}")
                return False
        else:
            print(f"❌ FAIL File Upload - HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL File Upload - Exception: {str(e)}")
        return False

def run_additional_tests():
    """Run additional tests"""
    print(f"🚀 Starting Additional WoooW Invites Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    tests = [
        test_update_invite,
        test_create_design,
        test_file_upload
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
    print(f"🏁 ADDITIONAL TESTS SUMMARY")
    print(f"{'='*50}")
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    return passed == total

if __name__ == "__main__":
    success = run_additional_tests()
    sys.exit(0 if success else 1)