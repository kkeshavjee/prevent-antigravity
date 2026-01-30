import dspy
import json
import logging
import time
from typing import Any, Dict, List, Type

from backend.models.data_models import AgentState, PatientProfile
from pydantic import ValidationError

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MCPServer")

from backend.services.persistence import AsyncPersistence
from backend.services.llm_config import get_lm_stack

class MCPServer:
    """
    Model Context Protocol (MCP) Server.
    Acts as a centralized interface for LLM calls with automated context injection and resilience.
    """

    def __init__(self):
        self.persistence = AsyncPersistence()
        self.lms = get_lm_stack()
        self.predictor_cache = {} # Cache for dspy.Predict instances
        logger.info(f"MCP Server initialized with {len(self.lms)} LMs available for failover.")
        logger.info("MCP Server initialized with Research Auditing.")

    async def predict(self, signature: Type[dspy.Signature], state: AgentState, **kwargs) -> Any:
        """
        Resilient Prediction: Loops through the LM stack until success.
        Handles RateLimits by failing over to secondary/tertiary/OpenAI keys.
        """
        history_str = "\n".join([f"{m.role}: {m.content}" for m in state.conversation_history[-8:]])
        profile_json = state.patient_profile.model_dump_json()
        
        inputs = kwargs.copy()
        if "history" in signature.input_fields: inputs["history"] = history_str
        if "user_profile" in signature.input_fields: inputs["user_profile"] = profile_json

        if not self.lms:
            print("MCP: No LMs in cache. Fetching from config...")
            self.lms = get_lm_stack()

        print(f"MCP: Starting failover loop for {signature.__name__}. Active providers: {len(self.lms)}")

        last_error = None
        for i, lm in enumerate(self.lms):
            provider = getattr(lm, 'provider_name', f'Provider_{i}')
            print(f"MCP Attempt {i+1}: Trying {provider}...")
            
            try:
                with dspy.context(lm=lm):
                    if signature not in self.predictor_cache:
                        self.predictor_cache[signature] = dspy.Predict(signature)
                    
                    predictor = self.predictor_cache[signature]
                    result = predictor(**inputs)
                    print(f"MCP SUCCESS: {provider} responded.")
                    return result
            except Exception as e:
                print(f"MCP FAILURE: {provider} failed with: {str(e)[:100]}")
                last_error = e
                # Continue if it's a rate limit or transient error
                continue 
        
        print("MCP FATAL: All providers failed.")
        raise last_error or RuntimeError("All LLM providers exhausted.")
