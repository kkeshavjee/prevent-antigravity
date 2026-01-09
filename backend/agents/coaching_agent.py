from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import CoachingSignature
import dspy

class CoachingAgent(BaseAgent):
    def __init__(self):
        self.predictor = dspy.Predict(CoachingSignature)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # Serializing specific biomarkers for context
        profile_summary = (
            f"Name: {state.patient_profile.name}, "
            f"Risk: {state.patient_profile.diabetes_risk_score.value}, "
            f"A1c: {state.patient_profile.biomarkers.a1c}"
        )
        
        # Call Gemini via DSPy
        result = self.predictor(user_profile=profile_summary, user_input=user_input)
        
        return {
            "response": result.response,
            "updated_context": {"suggested_action": result.suggested_action}
        }
