import asyncio
import os
import sys

# Add the parent directory to sys.path so we can import backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.orchestrator.orchestrator import Orchestrator

async def main():
    print("Initializing Orchestrator...")
    try:
        orchestrator = Orchestrator()
    except Exception as e:
        print(f"Error during initialization: {e}")
        import traceback
        traceback.print_exc()
        return

    user_id = "user_123"
    user_input = "Hello, I'm Karim. I want to learn about my diabetes risk."
    
    print(f"Processing request for user: {user_id}")
    try:
        result = await orchestrator.process_request(user_id, user_input)
        print("Success!")
        print(f"Response: {result['response']}")
    except Exception as e:
        print(f"Error during processing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
