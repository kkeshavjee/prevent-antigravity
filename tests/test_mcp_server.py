import pytest
import sys
import os
from unittest.mock import MagicMock, patch

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.mcp_server.mcp_server import MCPServer
from backend.models.data_models import AgentState, PatientProfile, Message, RiskLevel, Biomarkers
from backend.models.signatures import MotivationSignature

@pytest.fixture
def mock_state():
    profile = PatientProfile(
        user_id="test_user",
        name="Test Patient",
        age=45,
        diabetes_risk_score=RiskLevel.HIGH,
        risk_score_numeric=85,
        biomarkers=Biomarkers(
            a1c=6.5, fbs=7.0, systolic_bp=130, diastolic_bp=85,
            ldl=3.5, hdl=1.1, total_cholesterol=5.2, weight=85, height=175
        )
    )
    return AgentState(
        current_agent="motivation",
        conversation_history=[
            Message(role="user", content="Hello"),
            Message(role="assistant", content="Hi! How can I help?")
        ],
        patient_profile=profile
    )

@patch('dspy.Predict')
def test_mcp_predict_context_injection(mock_predict, mock_state):
    """Verify that MCPServer correctly injects context into the predictor."""
    # Setup mock
    mock_predictor_instance = MagicMock()
    mock_predict.return_value = mock_predictor_instance
    
    server = MCPServer()
    server.predict(MotivationSignature, mock_state, user_input="I want to lose weight")
    
    # Check that dspy.Predict was called with the right signature
    mock_predict.assert_called_with(MotivationSignature)
    
    # Check that the predictor was called with injected context
    args, kwargs = mock_predictor_instance.call_args
    assert "history" in kwargs
    assert "user" in kwargs["history"]
    assert "assistant" in kwargs["history"]
    assert kwargs["user_input"] == "I want to lose weight"
    
    # MotivationSignature doesn't have 'user_profile' or 'user_context' in its definition 
    # but let's check if the MCPServer TRIED to inject them if they existed.
    # (Checking the logic in mcp_server.py)

@patch('dspy.Predict')
def test_mcp_retry_logic(mock_predict, mock_state):
    """Verify that MCP Server retries on failure."""
    mock_predictor_instance = MagicMock()
    # Fail twice, then succeed
    mock_predictor_instance.side_effect = [Exception("API Error"), Exception("Timeout"), MagicMock()]
    mock_predict.return_value = mock_predictor_instance
    
    server = MCPServer()
    server.predict(MotivationSignature, mock_state, user_input="test")
    
    # Should be called 3 times total
    assert mock_predictor_instance.call_count == 3
