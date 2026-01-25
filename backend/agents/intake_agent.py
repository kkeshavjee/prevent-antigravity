from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import IntakeSignature
from backend.mcp_server.mcp_server import MCPServer

class IntakeAgent(BaseAgent):
    def __init__(self, mcp_server: MCPServer):
        super().__init__(mcp_server)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # Debug logging
        print(f"IntakeAgent: Processing request. Current profile name: '{state.patient_profile.name}'")
        
        # If name is already present (e.g. from DB load), we can skip asking
        if state.patient_profile.name and state.patient_profile.name != "User":
             print(f"IntakeAgent: Name '{state.patient_profile.name}' is already known. Transitioning.")
             return {
                "response": f"Welcome back, {state.patient_profile.name}. It's great to see you again. Let's talk about your motivation for joining the Diabetes Prevention Program.",
                "next_agent": "motivation"
            }
        
        # Call Gemini via MCP Server (handles history and profile injection)
        print(f"IntakeAgent: Calling LLM via MCP with input '{user_input}'...")
        result = self.mcp_server.predict(IntakeSignature, state, user_input=user_input)
        print(f"IntakeAgent: LLM returned. Result: {result}")
        
        if not result.response:
            print("IntakeAgent WARNING: LLM returned empty response!")
            result.response = "I'm sorry, I couldn't process that. Could you say that again?"
        
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
