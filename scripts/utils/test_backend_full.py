import asyncio
import os
import sys
import json

# Add the parent directory to sys.path so we can import backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))

from backend.orchestrator.orchestrator import Orchestrator

async def main():
    print("Initializing Orchestrator...")
    try:
        orchestrator = Orchestrator()
    except Exception as e:
        print(f"Error during initialization: {e}")
        return

    user_id = "test_user_debug"
    user_input = "Hello, I am Karim."
    
    print(f"Processing request for user: {user_id}")
    try:
        result = await orchestrator.process_request(user_id, user_input)
        print("--- RESULT START ---")
        print(json.dumps(result, indent=2))
        print("--- RESULT END ---")
    except Exception as e:
        print(f"Error during processing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
