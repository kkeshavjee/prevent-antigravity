import dspy
import json
import logging
import time
from typing import Any, Dict, List, Type
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from backend.models.data_models import AgentState, PatientProfile
from pydantic import ValidationError

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MCPServer")

from backend.services.persistence import AsyncPersistence

class MCPServer:
    """
    Model Context Protocol (MCP) Server.
    Acts as a centralized interface for LLM calls with automated context injection and resilience.
    """

    def __init__(self):
        self.persistence = AsyncPersistence()
        logger.info("MCP Server initialized with Research Auditing.")

    @retry(
        retry=retry_if_exception_type(Exception),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    async def predict(self, signature: Type[dspy.Signature], state: AgentState, **kwargs) -> Any:
        """
        Executes a DSPy prediction with automated context management and research auditing.
        """
        start_time = time.time()
        
        # 1. Standardize History
        history_window = 10
        history_str = "\n".join([f"{m.role}: {m.content}" for m in state.conversation_history[-history_window:]])

        # 2. Standardize Profile Context
        profile_context = state.patient_profile.model_dump_json()

        # 3. Resolve Inputs
        inputs = kwargs.copy()
        if "history" in signature.input_fields: inputs["history"] = history_str
        if "user_profile" in signature.input_fields: inputs["user_profile"] = profile_context
        if "user_context" in signature.input_fields: 
            inputs["user_context"] = f"Profile: {profile_context}\nStage: {state.patient_profile.current_stage}"

        # 4. Execute Prediction
        logger.info(f"MCP: Requesting {signature.__name__} for user {state.patient_profile.user_id}")
        predictor = dspy.Predict(signature)
        
        try:
            result = predictor(**inputs)
            
            # 5. Extract Metadata for Research
            duration_ms = (time.time() - start_time) * 1000
            
            # Extract model info from DSPy settings
            model_name = "unknown"
            provider = "unknown"
            if dspy.settings.lm:
                model_name = getattr(dspy.settings.lm, 'model', 'unknown')
                provider = "openai" if "gpt" in model_name.lower() else "google"

            # 6. Log to "The Receipt" (Audit Trail)
            input_summary = f"Signature: {signature.__name__} | Input: {kwargs.get('user_input', 'N/A')}"
            output_summary = str(result.response) if hasattr(result, 'response') else str(result)
            
            # Background task to not block the response
            import asyncio
            asyncio.create_task(self.persistence.log_interaction(
                user_id=state.patient_profile.user_id,
                agent_name=state.current_agent,
                signature_name=signature.__name__,
                prompt_input=input_summary,
                response_output=output_summary,
                model_name=model_name,
                provider=provider,
                latency_ms=duration_ms
            ))
            
            logger.info(f"MCP: {signature.__name__} completed ({provider}/{model_name}) in {duration_ms:.0f}ms")
            return result
            
        except Exception as e:
            logger.error(f"MCP ERROR in {signature.__name__}: {str(e)}")
            raise e
