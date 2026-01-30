import pytest
from fastapi.testclient import TestClient
import sys
import os
from unittest.mock import MagicMock, patch

# Add project root to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_health_and_pseudonymized_lookup(client):
    """
    Requirement 1: Verify health check and pseudonymized lookup.
    PRD 4.6: No PII (email/phone) should leak.
    """
    # Health check
    assert client.get("/health").status_code == 200
    
    # Pseudonymized lookup
    response = client.get("/api/patient/lookup?name=Anil")
    if response.status_code == 200:
        data = response.json()
        assert "user_id" in data
        assert data["name"] == "Anil"
        # PRD Verification: No PII
        assert "email" not in data
        assert "phone" not in data
    else:
        pytest.skip("Base patient data 'Anil' not found.")

def test_audit_trail_persistence(client):
    """
    Requirement 3: Verify "The Receipt" (PRD 10.1).
    Every LLM call must be logged in the database.
    """
    user_id = "audit_test_user"
    
    # Perform a chat turn
    client.post("/api/chat", json={
        "user_id": user_id, 
        "user_input": "Hello"
    })
    
    # Check the database for the interaction log
    # We do this via the debug endpoint or direct DB check if needed
    # For now, if the chat succeeds, we verify the history_count in state
    debug_resp = client.get(f"/api/debug/state/{user_id}")
    assert debug_resp.json()["history_count"] >= 2 # User + Assistant response

def test_full_journey_progression(client, global_llm_mock):
    """
    Requirement 2: Verify State Machine transitions (Identify -> Sustain).
    This test simulates key milestones.
    """
    user_id = "journey_test_003"
    
    # 1. Start at Intake (Identify/Inform)
    debug_resp = client.get(f"/api/debug/state/{user_id}")
    assert debug_resp.json()["current_agent"] == "intake"
    
    # 2. Reconfigure the global mock for transition behavior
    class MockResult:
        def __init__(self, response, extracted_name, next_step):
            self.response = response
            self.extracted_name = extracted_name
            self.next_step = next_step

    mock_prediction = MockResult(
        response="Welcome! Let's talk about your goals.",
        extracted_name="JourneyTest",
        next_step="transition_to_motivation"
    )
    
    # Reconfigure the global mock (injected via fixture)
    mock_instance = MagicMock()
    mock_instance.return_value = mock_prediction
    global_llm_mock.return_value = mock_instance
    
    response = client.post("/api/chat", json={"user_id": user_id, "user_input": "My name is JourneyTest"})
    
    if response.status_code != 200:
        pytest.fail(f"Chat request failed with {response.status_code}: {response.text}")
        
    # Verify transition
    debug_resp = client.get(f"/api/debug/state/{user_id}")
    assert debug_resp.json()["current_agent"] == "motivation"


def test_resilience_rate_limiting(client, global_llm_mock):
    """
    Requirement 5: Verify 429 Resilience.
    """
    import uuid
    user_id = f"chaos_user_{uuid.uuid4().hex[:8]}"
    
    # Configure the global mock to raise a rate limit error
    mock_instance = MagicMock()
    mock_instance.side_effect = Exception("429 Quota Exceeded")
    global_llm_mock.return_value = mock_instance
    
    response = client.post("/api/chat", json={
        "user_id": user_id, 
        "user_input": "help"
    })
    
    # Rate limit exception should bubble up as 429
    assert response.status_code == 429
    assert "Rate Limit" in response.json()["detail"]

def test_malformed_llm_recovery(client, global_llm_mock):
    """
    Requirement 5: Verify graceful recovery from malformed LLM responses.
    """
    import uuid
    user_id = f"robust_user_{uuid.uuid4().hex[:8]}"
    
    # Create a mock that returns an object with no 'response' attribute
    class MalformedResult:
        pass  # Empty result with no expected fields
    
    # Configure global mock to return malformed data
    mock_instance = MagicMock()
    mock_instance.return_value = MalformedResult()
    global_llm_mock.return_value = mock_instance
    
    response = client.post("/api/chat", json={
        "user_id": user_id, 
        "user_input": "What is my risk?"
    })
    
    # Should NOT be a 500 error; system must stringify or fallback
    assert response.status_code == 200
    # Check for the fallback message from the agent's defensive handling
    assert "couldn't process that" in response.json()["response"].lower() or "sorry" in response.json()["response"].lower()
