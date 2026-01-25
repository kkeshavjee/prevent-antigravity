# Retrospective: Foundation Phase (Issues #6 & #3)

This document summarizes the technical learnings and architectural shifts during the implementation of the Patient Journey State Machine and the MCP Server.

## 1. Architectural Decoupling
**Before**: The `Orchestrator` was responsible for managing flow logic and preparing LLM context manually for every agent.
**After**: 
*   **State Machine**: Flow logic is now "Externalized." The Orchestrator just asks the State Machine if a move is legal. This makes the journey logic testable without running the whole app.
*   **MCP Server**: Context management is now "Centralized." Agents no longer need to know how to format history or JSON profiles; they just provide the user input.

**Learning**: Every line of code removed from the `Orchestrator` directly increases the system's "Maintainability Score."

## 2. Reliability & Resilience
*   **Formal Transitions**: By using a State Machine, we created a "Hard Guardrail" against AI hallucinations. Even if the AI tries to skip a step, the code blocks it.
*   **Exponential Backoff**: Implementing `tenacity` retries in the MCP Server proved essential. This protects the user experience from transient network issues.

**Learning**: Designing for failure (retries) is just as important as designing for success.

## 3. Production-Grade Patterns
*   **Observability**: Adding latency tracking to the MCP Server allows us to identify bottlenecks early. We now know that AI calls average 2-5 seconds.
*   **Schema Guardrails**: Validating that the AI's response "shapes" match our signatures prevents downstream crashes.

**Learning**: A "Prototype" acts. A "Production Tool" *watches* itself act (logging/validation).

## Conclusion
The Foundation Phase has established a robust "Infrastructure Layer." Future agents (Nutrition, Sleep, etc.) can now be built much faster because the "Heavy Lifting" of context, flow, and reliability is handled by these two components.
