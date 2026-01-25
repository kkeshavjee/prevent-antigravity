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
            updated_context["importance_rating"] = float(result.importance_rating)
            
        if result.confidence_rating and float(result.confidence_rating) > 0:
            updated_context["confidence_rating"] = float(result.confidence_rating)
            
        if result.readiness_stage:
            updated_context["readiness_stage"] = result.readiness_stage

        return {
            "response": result.response,
            "updated_context": updated_context
        }
