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
        result = await self.mcp_server.predict(IntakeSignature, state, user_input=user_input)
        print(f"IntakeAgent: LLM returned. Result: {result}")
        
        # Defensive access to result attributes
        response_text = getattr(result, 'response', None)
        extracted_name = getattr(result, 'extracted_name', None)
        next_step = getattr(result, 'next_step', None)

        if not response_text:
            print("IntakeAgent WARNING: LLM returned empty response!")
            response_text = "I'm sorry, I couldn't process that. Could you say that again?"
        
        updated_context = {}
        if extracted_name:
            state.patient_profile.name = extracted_name
            updated_context["name"] = extracted_name

        final_next_agent = None
        if next_step == 'transition_to_motivation':
            final_next_agent = "motivation"

        return {
            "response": response_text,
            "next_agent": final_next_agent,
            "updated_context": updated_context
        }
