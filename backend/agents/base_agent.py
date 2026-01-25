from abc import ABC, abstractmethod
from backend.models.data_models import AgentState, Message
from backend.mcp_server.mcp_server import MCPServer

class BaseAgent(ABC):
    def __init__(self, mcp_server: MCPServer):
        self.mcp_server = mcp_server

    @abstractmethod
    async def process(self, user_input: str, state: AgentState) -> dict:
        """
        Process the user input and return a response dict containing:
        - response: str
        - next_agent: str (optional)
        - updated_context: dict (updates to state.context_variables)
        """
        pass
