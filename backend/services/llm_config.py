import dspy
import os
import os
from dotenv import load_dotenv

# Load environment variables from the .env file in the current directory or backend directory
load_dotenv()
load_dotenv("backend/.env") # Fallback if running from root

def configure_dspy(api_key: str = None, model_name: str = 'gemini/gemini-flash-latest'):
    """
    Configures DSPy to use Gemini as the Language Model.
    If api_key is provided, it uses that. Otherwise, falls back to GOOGLE_API_KEY env var.
    """
    if not api_key:
        api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        print("Warning: No API Key provided or found in GOOGLE_API_KEY. LLM calls will fail.")
        return

    try:
        # Use 'gemini/gemini-flash-latest' as it is explicitly supported.
        lm = dspy.LM(model=model_name, api_key=api_key)
        dspy.configure(lm=lm)
        print(f"DSPy configured for Gemini ({model_name}) with key ending in ...{api_key[-4:] if api_key else 'None'}.")
    except Exception as e:
        error_msg = f"Error configuring Gemini: {e}"
        print(error_msg)
        # We don't raise here to prevent the whole app from crashing if LLM is down,
        # but the orchestrator should handle the missing LM gracefully.
