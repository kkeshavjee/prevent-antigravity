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

class MCPServer:
    """
    Model Context Protocol (MCP) Server.
    Acts as a centralized interface for LLM calls with automated context injection and resilience.
    """

    def __init__(self):
        logger.info("MCP Server initialized.")

    @retry(
        retry=retry_if_exception_type(Exception), # Ideally specify LLM exceptions like dspy.LMError
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    def predict(self, signature: Type[dspy.Signature], state: AgentState, **kwargs) -> Any:
        """
        Executes a DSPy prediction with automated context management and retries.
        """
        start_time = time.time()
        
        # 1. Standardize History
        history_window = 10
        history_str = "\n".join([f"{m.role}: {m.content}" for m in state.conversation_history[-history_window:]])

        # 2. Standardize Profile Context
        # We convert the profile to a clean JSON string for the LLM
        profile_context = state.patient_profile.model_dump_json()

        # 3. Resolve Inputs for the signature
        inputs = kwargs.copy()
        
        if "history" in signature.input_fields:
            inputs["history"] = history_str
            
        if "user_profile" in signature.input_fields:
            inputs["user_profile"] = profile_context
            
        if "user_context" in signature.input_fields:
            inputs["user_context"] = f"Profile: {profile_context}\nStage: {state.patient_profile.current_stage}"

        # 4. Execute Prediction
        logger.info(f"MCP: Sending {signature.__name__} for user {state.patient_profile.user_id}")
        predictor = dspy.Predict(signature)
        
        try:
            result = predictor(**inputs)
            
            # Observability: Track Latency
            duration = time.time() - start_time
            logger.info(f"MCP: {signature.__name__} completed in {duration:.2f}s")
            
            # Guardrails: (Placeholder for deep output validation)
            # In DSPy, we can check for required output fields
            for field in signature.output_fields:
                if not hasattr(result, field):
                    logger.warning(f"MCP WARNING: Missing expected output field '{field}' in response.")
            
            return result
            
        except Exception as e:
            logger.error(f"MCP ERROR in {signature.__name__}: {str(e)}")
            raise e
