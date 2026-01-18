---
name: multi_agent_flow_debugger
description: Specialized skill for diagnosing and fixing handoff logic between the Antigravity agents (Intake, Motivation, Education, Coaching).
---

# Multi-Agent Flow Debugger

This skill provides a systematic approach to debugging the conversation "orchestration" in the Antigravity system. Use this whenever the user reports an agent is "stuck," "forgetful," or transitioning at the wrong time.

## Core Responsibilities
- **Handoff Verification**: Ensure the `Orchestrator` is correctly switching between agents based on the `next_step` or `next_agent` output.
- **State Persistence**: Verify the `AgentState` (specifically `patient_profile` and `conversation_history`) is correctly passed and mutated during agent steps.
- **LLM Output Alignment**: Validate that agent predictors (DSPy) are returning valid fields defined in their Signatures.

## Debugging Workflows

### 1. The Trace Analysis
When a flow error occurs, examine the backend console for the detailed logs added in January 2026:
- Check for `IntakeAgent: Processing request. Current profile name: '...'`
- Look for the raw LLM `Result: ...` to see the `next_step` value.
- Compare the `user_id` in the request to the `user_id` stored in the state.

### 2. State Corruption Check
If an agent "forgets" information:
1. Examine `backend/models/data_models.py` to ensure all necessary fields are in `AgentState`.
2. Check `backend/orchestrator/orchestrator.py`'s `get_or_create_state` method to see if it's accidentally resetting the state.

### 3. Signature Refinement
If an agent transitions too early or too late, update the `SKILL.md` (or the `signatures.py` file) with clearer steering instructions for the LLM.

## Supporting Scripts
- `backend/test_connection.py`: Use this to run a synthetic multi-turn conversation and inspect the state at each step.
- `inspect_data.py`: Use this to verify that the patient profile loaded from Excel matches what the agent is seeing.
