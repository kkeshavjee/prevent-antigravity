from backend.agents.base_agent import BaseAgent
from backend.models.data_models import AgentState
from backend.models.signatures import MotivationSignature
from backend.mcp_server.mcp_server import MCPServer

class MotivationAgent(BaseAgent):
    def __init__(self, mcp_server: MCPServer):
        super().__init__(mcp_server)

    async def process(self, user_input: str, state: AgentState) -> dict:
        # Call Gemini via MCP Server (handles history and profile injection)
        result = await self.mcp_server.predict(MotivationSignature, state, user_input=user_input)
        
        # Defensive access to all optional fields
        response_text = getattr(result, 'response', "I'm listening. Tell me more.")
        readiness_score = getattr(result, 'readiness_score', None)
        importance_rating = getattr(result, 'importance_rating', None)
        confidence_rating = getattr(result, 'confidence_rating', None)
        readiness_stage = getattr(result, 'readiness_stage', None)
        barriers = getattr(result, 'barriers', None)
        facilitators = getattr(result, 'facilitators', None)
        
        updated_context = {}
        
        try:
            if readiness_score and float(readiness_score) > 0:
                updated_context["readiness_score"] = float(readiness_score)
                state.patient_profile.motivation_level = f"Readiness: {readiness_score}/10"

            if importance_rating and float(importance_rating) > 0:
                rating = float(importance_rating)
                updated_context["importance_rating"] = rating
                state.patient_profile.importance_rating = rating
                
            if confidence_rating and float(confidence_rating) > 0:
                rating = float(confidence_rating)
                updated_context["confidence_rating"] = rating
                state.patient_profile.confidence_rating = rating
        except (ValueError, TypeError):
            pass
            
        if readiness_stage:
            stage = str(readiness_stage).lower()
            updated_context["readiness_stage"] = stage
            state.patient_profile.readiness_stage = stage

        if barriers:
            barriers_list = [b.strip() for b in str(barriers).split(',')] if ',' in str(barriers) else [str(barriers)]
            state.patient_profile.barriers = barriers_list
            updated_context["barriers"] = barriers_list

        if facilitators:
            facilitators_list = [f.strip() for f in str(facilitators).split(',')] if ',' in str(facilitators) else [str(facilitators)]
            state.patient_profile.facilitators = facilitators_list
            updated_context["facilitators"] = facilitators_list

        # Handle Transition Logic
        next_step = getattr(result, 'next_step', 'continue_motivation')
        final_next_agent = None
        
        if next_step == 'transition_to_education':
            print(f"MotivationAgent: Transition criteria met. Moving to Education.")
            final_next_agent = "education"

        return {
            "response": response_text,
            "updated_context": updated_context,
            "next_agent": final_next_agent
        }
