from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import EducationSignature
import dspy

class EducationAgent(BaseAgent):
    def __init__(self):
        self.predictor = dspy.Predict(EducationSignature)

    async def process(self, user_input: str, state: AgentState) -> dict:
        context = f"Risk Score: {state.patient_profile.diabetes_risk_score.value}. " 
        
        # Format history
        history_str = "\n".join([f"{m.role}: {m.content}" for m in state.conversation_history[-10:]])

        # Call Gemini via DSPy
        result = self.predictor(history=history_str, user_context=context, user_input=user_input)
        
        return {
            "response": result.response,
            "updated_context": {"last_quiz": result.quiz_question}
        }
