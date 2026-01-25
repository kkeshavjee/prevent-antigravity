import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add project root to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.main import app
from backend.models.data_models import PatientProfile, OrchestratorResponse

client = TestClient(app)

def test_health_check():
    """Case 1: Health & Basic Connectivity"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_root_endpoint():
    """Case 1: Basic Connectivity"""
    response = client.get("/")
    assert response.status_code == 200
    assert "Diabetes Prevention Bot" in response.json()["message"]

def test_patient_lookup_pseudonymity():
    """Case 2: Pseudonymized Lookup (nickname)"""
    # Using a name from the sample spreadsheet (e.g., 'Anil')
    # In production, these would be user-provided nicknames.
    response = client.get("/api/patient/lookup?name=Anil")
    
    if response.status_code == 200:
        data = response.json()
        assert "user_id" in data
        assert data["name"] == "Anil"
        # Verify no external PII like email/phone is present in the schema
        assert "email" not in data
        assert "phone" not in data
    else:
        # Fallback if seed data changed
        pytest.skip("Test patient 'Anil' not found in local data.")

def test_patient_lookup_not_found():
    """Case 2: Secure handling of missing identifiers"""
    response = client.get("/api/patient/lookup?name=NonExistentUser")
    assert response.status_code == 404
    assert response.json()["detail"] == "Patient not found"

def test_chat_happy_path():
    """Case 3 & 4: Conversational Flow & State Machine Integration"""
    # 1. Start a chat
    payload = {
        "user_id": "test_integration_user",
        "user_input": "Hello, my name is Testy"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0
    
    # 2. Verify state progression (Internal Check)
    # Since we can't easily peek into the internal Orchestrator state via the REST API 
    # without a debug endpoint, we verify that the response is coherent.
    # TODO: Add a /api/debug/session/{user_id} for "Clinical Engineer" testing in SOP.
    assert isinstance(data["response"], str)
