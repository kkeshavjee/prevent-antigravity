import pytest
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.models.state_machine import PatientStage, JourneyManager, InvalidStateTransitionError

def test_initial_transitions():
    """Verify start of journey transitions."""
    # Identify -> Inform
    assert JourneyManager.transition(PatientStage.IDENTIFY, PatientStage.INFORM) == PatientStage.INFORM
    
    # Inform -> Educate
    assert JourneyManager.transition(PatientStage.INFORM, PatientStage.EDUCATE_MOTIVATE) == PatientStage.EDUCATE_MOTIVATE

def test_engage_loop():
    """Verify the core engagement loop."""
    # Educate -> Mall
    assert JourneyManager.transition(PatientStage.EDUCATE_MOTIVATE, PatientStage.EXPLORE_COMMIT) == PatientStage.EXPLORE_COMMIT
    
    # Mall -> Engage (Commitment)
    assert JourneyManager.transition(PatientStage.EXPLORE_COMMIT, PatientStage.ENGAGE) == PatientStage.ENGAGE
    
    # Engage -> Sustain (Success)
    assert JourneyManager.transition(PatientStage.ENGAGE, PatientStage.SUSTAIN) == PatientStage.SUSTAIN

def test_backtracking():
    """Verify allowed backtracking behavior."""
    # Mall -> Educate (Need more info)
    assert JourneyManager.transition(PatientStage.EXPLORE_COMMIT, PatientStage.EDUCATE_MOTIVATE) == PatientStage.EDUCATE_MOTIVATE
    
    # Engage -> Mall (Re-evaluate goals)
    assert JourneyManager.transition(PatientStage.ENGAGE, PatientStage.EXPLORE_COMMIT) == PatientStage.EXPLORE_COMMIT

def test_illegal_transitions():
    """Verify illegal jumps are blocked."""
    # Cannot jump from Inform to Sustain
    with pytest.raises(InvalidStateTransitionError):
        JourneyManager.transition(PatientStage.INFORM, PatientStage.SUSTAIN)
        
    # Cannot jump from Identify to Engage
    with pytest.raises(InvalidStateTransitionError):
        JourneyManager.transition(PatientStage.IDENTIFY, PatientStage.ENGAGE)

def test_self_transition():
    """Staying in the same state is always allowed."""
    assert JourneyManager.transition(PatientStage.ENGAGE, PatientStage.ENGAGE) == PatientStage.ENGAGE
