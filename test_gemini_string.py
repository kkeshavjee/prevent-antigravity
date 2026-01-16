import dspy
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GOOGLE_API_KEY")

def test_model(model_name):
    print(f"\nTesting model name: {model_name}")
    try:
        lm = dspy.LM(model=model_name, api_key=api_key)
        dspy.configure(lm=lm)
        
        class TestSignature(dspy.Signature):
            """Just a test."""
            input = dspy.InputField()
            output = dspy.OutputField()
            
        predictor = dspy.Predict(TestSignature)
        result = predictor(input="Say 'hello'")
        print(f"Success! Result: {result.output}")
        return True
    except Exception as e:
        print(f"Failed with error: {e}")
        return False

if __name__ == "__main__":
    # Test common variations
    # test_model("google/gemini-1.5-flash") # This failed in the orchestrator test
    test_model("gemini/gemini-2.0-flash")
