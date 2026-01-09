from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import IntakeSignature
import dspy
import json

class IntakeAgent(BaseAgent):
    def __init__(self):
        self.predictor = dspy.Predict(IntakeSignature)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # Check if we already have the name
        if state.patient_profile.name:
             return {
                "response": f"Welcome back, {state.patient_profile.name}. Let's check in on your motivation.",
                "next_agent": "motivation"
            }
        
        # Serialize profile for the LLM
        profile_json = state.patient_profile.json()
        
        # Call Gemini via DSPy
        result = self.predictor(user_input=user_input, user_profile=profile_json)
        
        updated_context = {}
        if result.extracted_name:
            state.patient_profile.name = result.extracted_name
            updated_context["name"] = result.extracted_name

        next_agent = None
        if result.next_step == 'transition_to_motivation':
            next_agent = "motivation"

        return {
            "response": result.response,
            "next_agent": next_agent,
            "updated_context": updated_context
        }
