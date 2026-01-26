from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import MotivationSignature
from backend.mcp_server.mcp_server import MCPServer

class MotivationAgent(BaseAgent):
    def __init__(self, mcp_server: MCPServer):
        super().__init__(mcp_server)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # Call Gemini via MCP Server (handles history and profile injection)
        result = self.mcp_server.predict(MotivationSignature, state, user_input=user_input)
        
        updated_context = {}
        if result.readiness_score and float(result.readiness_score) > 0:
            updated_context["readiness_score"] = float(result.readiness_score)
            state.patient_profile.motivation_level = f"Readiness: {result.readiness_score}/10"

        if result.importance_rating and float(result.importance_rating) > 0:
            rating = float(result.importance_rating)
            updated_context["importance_rating"] = rating
            state.patient_profile.importance_rating = rating
            
        if result.confidence_rating and float(result.confidence_rating) > 0:
            rating = float(result.confidence_rating)
            updated_context["confidence_rating"] = rating
            state.patient_profile.confidence_rating = rating
            
        if result.readiness_stage:
            stage = result.readiness_stage.lower()
            updated_context["readiness_stage"] = stage
            state.patient_profile.readiness_stage = stage

        if result.barriers:
            # Assuming comma separated or similar if it's a string, or just save as is if it's treated as a list later
            # For now, let's treat as description string or convert to list
            barriers_list = [b.strip() for b in str(result.barriers).split(',')] if ',' in str(result.barriers) else [str(result.barriers)]
            state.patient_profile.barriers = barriers_list
            updated_context["barriers"] = barriers_list

        if result.facilitators:
            facilitators_list = [f.strip() for f in str(result.facilitators).split(',')] if ',' in str(result.facilitators) else [str(result.facilitators)]
            state.patient_profile.facilitators = facilitators_list
            updated_context["facilitators"] = facilitators_list

        return {
            "response": result.response,
            "updated_context": updated_context
        }
