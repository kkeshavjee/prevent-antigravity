from enum import Enum
from typing import List, Optional

class PatientStage(str, Enum):
    """
    Represents the stages of the PREVENT Patient Journey.
    Based on PRD Section 5.
    """
    IDENTIFY = "Identify"               # System: Patient identified in EMR
    INFORM = "Inform"                   # Proactive Outreach sent
    EDUCATE_MOTIVATE = "Educate_Motivate" # User Logged In (Default)
    EXPLORE_COMMIT = "Explore_Commit"   # The Mall / Selection
    ENGAGE = "Engage"                   # Working on Goals
    SUSTAIN = "Sustain"                 # Maintenance

class InvalidStateTransitionError(Exception):
    """Raised when an illegal state transition is attempted."""
    pass

class JourneyManager:
    """
    Manages the transitions between patient stages.
    Enforces the logic flow defined in the PREVENT Patient Journey.
    """
    
    # Define valid transitions for each state
    _transitions = {
        PatientStage.IDENTIFY: [PatientStage.INFORM],
        PatientStage.INFORM: [PatientStage.EDUCATE_MOTIVATE],
        # From Educate/Motivate, they move to the Mall (Explore)
        PatientStage.EDUCATE_MOTIVATE: [PatientStage.EXPLORE_COMMIT],
        # From Mall, they commit to a goal (Engage) OR go back to learn more
        PatientStage.EXPLORE_COMMIT: [PatientStage.ENGAGE, PatientStage.EDUCATE_MOTIVATE],
        # From Engage, they maintain (Sustain) OR relapse/re-evaluate (Explore)
        PatientStage.ENGAGE: [PatientStage.SUSTAIN, PatientStage.EXPLORE_COMMIT],
        # From Sustain, they might need new goals (Explore)
        PatientStage.SUSTAIN: [PatientStage.EXPLORE_COMMIT]
    }

    @classmethod
    def can_transition(cls, current: PatientStage, next_stage: PatientStage) -> bool:
        """Checks if a transition is legal."""
        if current == next_stage:
            return True # Staying in same stage is always allowed
            
        allowed = cls._transitions.get(current, [])
        return next_stage in allowed

    @classmethod
    def transition(cls, current: PatientStage, next_stage: PatientStage) -> PatientStage:
        """
        Executes a transition. Raises InvalidStateTransitionError if illegal.
        """
        if not cls.can_transition(current, next_stage):
            raise InvalidStateTransitionError(
                f"Cannot transition from {current.value} to {next_stage.value}"
            )
        return next_stage
