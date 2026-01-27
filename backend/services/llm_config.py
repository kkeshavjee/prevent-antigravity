import dspy
import os
import os
from dotenv import load_dotenv

# Load environment variables from the .env file in the current directory or backend directory
load_dotenv()
load_dotenv("backend/.env") # Fallback if running from root

def configure_dspy(api_key: str = None, model_name: str = None):
    """
    Configures DSPy for Gemini or OpenAI.
    """
    # 1. Resolve API Key & Provider
    openai_key = os.getenv("OPENAI_API_KEY")
    google_key = os.getenv("GOOGLE_API_KEY")

    # If user provided a specific key, we determine its type
    if api_key:
        if api_key.startswith("sk-"): # Standard OpenAI key format
            provider = "openai"
            final_model = model_name or "openai/gpt-4o-mini"
        else:
            provider = "google"
            final_model = model_name or "gemini/gemini-1.5-flash"
        final_key = api_key
    else:
        # Auto-detect from environment
        if openai_key:
            provider = "openai"
            final_key = openai_key
            final_model = model_name or "openai/gpt-4o-mini"
        elif google_key:
            provider = "google"
            final_key = google_key
            final_model = model_name or "gemini/gemini-1.5-flash"
        else:
            print("Warning: No API Key found for OpenAI or Gemini.")
            return

    try:
        lm = dspy.LM(model=final_model, api_key=final_key)
        dspy.configure(lm=lm)
        print(f"DSPy configured for {provider.upper()} ({final_model})")
    except Exception as e:
        print(f"Error configuring LM: {e}")
