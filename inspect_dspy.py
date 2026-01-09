import dspy
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GOOGLE_API_KEY")

try:
    print(f"Testing dspy.LM with key length: {len(api_key) if api_key else 0}")
    lm = dspy.LM(model='gemini/gemini-1.5-flash', api_key=api_key) # Try with provider prefix first? or just model?
    # Actually dspy 3 usually uses provider prefix like 'openai/gpt-4' or 'gemini/...'
    # But let's try 'gemini-1.5-flash' first? usually 'google/...' or 'gemini/...'
    print("dspy.LM init success:", lm)
except Exception as e:
    print("Error:", e)

try:
    print("Testing 'google/gemini-1.5-flash'")
    lm2 = dspy.LM(model='google/gemini-1.5-flash', api_key=api_key)
    print("dspy.LM 'google/' init success:", lm2)
except Exception as e:
    print("Error 2:", e)
