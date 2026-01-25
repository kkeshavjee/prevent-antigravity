# Concept: Task Decoupled Planning (TDP)

**Status:** Draft
**Reference:** Li - Task Decouple Planning.pdf

## Overview

Task Decoupled Planning (TDP) is an architectural pattern designed to improve the reliability and reasoning capabilities of the Antigravity multi-agent system. It separates the **Planning** phase (reasoning about *what* to do) from the **Execution** phase (performing the actions).

## Core Principle

Instead of agents immediately reacting to user input with a monolithic "Think & Act" loop, the system splits the process:

1.  **Planner (Orchestrator)**:
    *   Analyzes the user's high-level intent.
    *   Decomposes the intent into a sequence of atomic logical steps (a "Plan").
    *   Does *not* execute the steps itself.
    *   *Output:* A structured Plan (e.g., JSON list of steps).

2.  **Executor (Specialized Agents)**:
    *   Receives a single step from the Plan.
    *   Executes the step using its specific tools and context.
    *   Returns the result to the Planner.

## Benefits for Antigravity

*   **Reduced Hallucination**: By forcing the model to explicitly list steps before acting, we reduce the chance of it jumping to incorrect conclusions.
*   **Better Error Recovery**: If a step fails, the Planner can adjust the remaining plan without restarting the entire conversation.
*   **Interpretable Traces**: The "Plan" object provides a clear audit trail of what the system *intended* to do, making debugging easier.
*   **Context Management**: The Planner maintains the global context (Patient Profile, Journey Stage), while Executors focus only on the local context (current step).

## Implementation Strategy

### 1. Data Structures

**The Plan:**
```json
{
  "goal": "Help patient set a weight loss goal",
  "steps": [
    { "id": 1, "agent": "Intake", "action": "Confirm current weight", "status": "pending" },
    { "id": 2, "agent": "Motivation", "action": "Assess readiness for weight loss", "status": "pending" },
    { "id": 3, "agent": "GoalTracking", "action": "Set target weight in profile", "status": "pending" }
  ]
}
```

### 2. Orchestration Loop

1.  **Receive Input**: User sends message.
2.  **Update State**: Append message to history.
3.  **Generate/Update Plan**:
    *   If no active plan, generate one based on input.
    *   If active plan exists, update based on last result (Re-planning).
4.  **Dispatch**: Identify the next `pending` step.
5.  **Execute**: Route to the corresponding Agent (Intake, Motivation, etc.).
6.  **Loop**: Repeat until Plan is complete or paused for user input.

## Integration Roadmap

*   [ ] Define `Plan` and `PlanStep` Pydantic models in `backend/models/`.
*   [ ] Create a `Planner` module within `backend/orchestrator/`.
*   [ ] Refactor `Orchestrator.process_user_message` to use the TDP loop.
*   [ ] Update Agent Signatures to accept structured Step instructions.
