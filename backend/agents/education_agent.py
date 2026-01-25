from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import EducationSignature
from backend.mcp_server.mcp_server import MCPServer

class EducationAgent(BaseAgent):
    def __init__(self, mcp_server: MCPServer):
        super().__init__(mcp_server)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # Call Gemini via MCP Server (handles history and profile injection)
        result = self.mcp_server.predict(EducationSignature, state, user_input=user_input)
        
        return {
            "response": result.response,
            "updated_context": {"last_quiz": result.quiz_question}
        }
