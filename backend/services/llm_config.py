import dspy
import os
import os
from dotenv import load_dotenv

# Load environment variables from the .env file in the current directory or backend directory
load_dotenv()
load_dotenv("backend/.env") # Fallback if running from root

def configure_dspy():
    """
    Configures DSPy to use Gemini as the Language Model.
    Requires GOOGLE_API_KEY environment variable.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Warning: GOOGLE_API_KEY not found. LLM calls will fail.")
        return

    try:
        # Use 'gemini/gemini-flash-latest' which is verified to work with the current key.
        model_name = 'gemini/gemini-flash-latest'
        lm = dspy.LM(model=model_name, api_key=api_key)
        dspy.configure(lm=lm)
        print(f"DSPy configured for Gemini ({model_name}).")
    except Exception as e:
        error_msg = f"Error configuring Gemini: {e}"
        print(error_msg)
        # We don't raise here to prevent the whole app from crashing if LLM is down,
        # but the orchestrator should handle the missing LM gracefully.
