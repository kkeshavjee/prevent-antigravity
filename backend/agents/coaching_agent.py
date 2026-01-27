from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import CoachingSignature
from backend.mcp_server.mcp_server import MCPServer

class CoachingAgent(BaseAgent):
    def __init__(self, mcp_server: MCPServer):
        super().__init__(mcp_server)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # Call Gemini via MCP Server (handles history and profile injection)
        result = await self.mcp_server.predict(CoachingSignature, state, user_input=user_input)
        
        return {
            "response": result.response,
            "updated_context": {"suggested_action": result.suggested_action}
        }
