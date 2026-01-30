from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import IntakeSignature
from backend.mcp_server.mcp_server import MCPServer

class IntakeAgent(BaseAgent):
    def __init__(self, mcp_server: MCPServer):
        super().__init__(mcp_server)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # 1. Handle Resume/Fresh Choice
        if state.context_variables.get("pending_resume_choice"):
            print(f"IntakeAgent: Handling resume choice for user input: '{user_input}'")
            # Determine if they want to start fresh
            lower_input = user_input.lower()
            start_fresh = any(word in lower_input for word in ["fresh", "something else", "new", "start over", "mind"])
            
            # Clear the flag
            updated_context = {"pending_resume_choice": False}
            
            if start_fresh:
                print("IntakeAgent: User wants a fresh start. Wiping conversation history.")
                # We wipe history but keep the profile
                state.conversation_history = state.conversation_history[-1:] # Keep only the current turn's setup
            
            return {
                "response": "Understood. Let's dive in. How are you feeling about your health goals currently?",
                "next_agent": "motivation",
                "updated_context": updated_context
            }

        # Debug logging
        print(f"IntakeAgent: Processing request. Current profile name: '{state.patient_profile.name}'")
        
        # If name is already present (e.g. from DB load), we give them a choice
        if state.patient_profile.name and state.patient_profile.name != "User":
             print(f"IntakeAgent: Name '{state.patient_profile.name}' known. Offering resume choice.")
             # Add a flag to context to track we are waiting for a resume choice
             return {
                "response": f"Welcome back, {state.patient_profile.name}! It's great to see you again. Would you like to continue from where we left off, or is there something else on your mind today?",
                "next_agent": "intake", # Keep them in intake for one more turn to handle the choice
                "updated_context": {"pending_resume_choice": True}
            }
        
        # FAST PATH: If this is the very first interaction (history has 1 message: the user's 'Hello')
        # and we don't know the name, return a static welcome to avoid LLM latency.
        history_len = len(state.conversation_history)
        if history_len <= 1 and (not state.patient_profile.name or state.patient_profile.name == "User"):
            print(f"IntakeAgent: Startup detected (History size: {history_len}). Sending instant static welcome.")
            return {
                "response": "Hello! I'm Dawn, your Diabetes Prevention Assistant. I'm here to support your journey. To get started, may I ask your name?",
                "next_agent": "intake"
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
