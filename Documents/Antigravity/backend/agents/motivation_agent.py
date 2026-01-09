from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import MotivationSignature
import dspy

class MotivationAgent(BaseAgent):
    def __init__(self):
        self.predictor = dspy.Predict(MotivationSignature)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # Format history
        history_str = "\n".join([f"{m.role}: {m.content}" for m in state.conversation_history[-5:]])
        
        # Call Gemini via DSPy
        result = self.predictor(history=history_str, user_input=user_input)
        
        updated_context = {}
        if result.readiness_score and float(result.readiness_score) > 0:
            updated_context["readiness_score"] = float(result.readiness_score)
            state.patient_profile.motivation_level = f"Readiness: {result.readiness_score}/10"

        return {
            "response": result.response,
            "updated_context": updated_context
        }
