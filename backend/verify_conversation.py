import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.orchestrator.orchestrator import Orchestrator

async def verify_conversation_context():
    orchestrator = Orchestrator()
    user_id = "test_user_001"
    
    print("--- Phase 1: Intake (Name Gathering) ---")
    resp1 = await orchestrator.process_request(user_id, "Hi, I'm Karim.")
    print(f"User: Hi, I'm Karim.\nAI: {resp1['response']}\nAgent: {resp1['current_agent']}\n")
    
    # The name should now be in the profile
    state = await orchestrator.get_or_create_state(user_id)
    print(f"DEBUG: Profile Name is '{state.patient_profile.name}'\n")

    print("--- Phase 2: Transition Context ---")
    resp2 = await orchestrator.process_request(user_id, "I want to prevent diabetes.")
    print(f"User: I want to prevent diabetes.\nAI: {resp2['response']}\nAgent: {resp2['current_agent']}\n")

    print("--- Phase 3: Testing Repetition/Memory ---")
    # Tell the bot something specific
    await orchestrator.process_request(user_id, "I hate running because of my knee pain.")
    
    # Ask a question that requires remembering the knee pain
    resp3 = await orchestrator.process_request(user_id, "What exercise should I do?")
    print(f"User: What exercise should I do?\nAI: {resp3['response']}\nAgent: {resp3['current_agent']}\n")
    
    if "running" in resp3['response'].lower() and ("don't" in resp3['response'].lower() or "not" in resp3['response'].lower() or "knee" in resp3['response'].lower()):
        print("SUCCESS: AI acknowledged the knee pain/running preference.")
    else:
        print("NOTE: AI might not have explicitly mentioned the knee pain, check response quality manually.")

    # Check for motivation context
    print("\n--- Phase 4: Motivation Context Verification ---")
    state = await orchestrator.get_or_create_state(user_id)
    print(f"Readiness Score: {state.context_variables.get('readiness_score')}")
    print(f"Importance Rating: {state.context_variables.get('importance_rating')}")
    print(f"Confidence Rating: {state.context_variables.get('confidence_rating')}")
    print(f"Readiness Stage: {state.context_variables.get('readiness_stage')}")

if __name__ == "__main__":
    asyncio.run(verify_conversation_context())
