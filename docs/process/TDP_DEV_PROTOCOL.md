# Task Decoupled Planning (TDP) Development Protocol

**Reference:** [Beyond Entangled Planning: Task-Decoupled Planning for Long-Horizon Agents (Li et al., 2026)](https://arxiv.org/html/2601.07577v1)

This protocol defines the standard operating procedure for software development within Antigravity. It enforces a strict separation between **Planning** (reasoning about what to do) and **Execution** (doing it), ensuring that long-horizon tasks do not degrade into "entangled" confusion.

## Core Roles

### 1. Supervisor (Global Context)
*   **Actor:** User + Agent (collaboratively).
*   **Responsibility:** Maintains the **Dependency Graph** of all project tasks.
*   **Artifact:** `docs/ROADMAP.md`.
*   **Action:** Decomposes high-level goals into independent "Nodes" (tasks).
*   **Rule:** A Node is only "Ready" when its dependencies are met.

### 2. Planner (Node-Scoped Context)
*   **Actor:** Agent (in PLANNING mode).
*   **Responsibility:** Takes a *single* Ready Node and designs the solution.
*   **Artifact:** `implementation_plan.md` (Scoped to *only* the current Node).
*   **Action:**
    1.  **Context isolation:** Ignores the vast history of previous tasks; focuses only on the requirements for *this* node.
    2.  **Design:** Writes the plan, identifying files to change and verification steps.
    3.  **Self-Revision:** Defines "Checkpoints" (e.g., "If I can't find file X, I must stop and re-plan locally").

### 3. Executor (Node-Scoped Context)
*   **Actor:** Agent (in EXECUTION mode).
*   **Responsibility:** Executes the `implementation_plan.md` step-by-step.
*   **Action:**
    1.  Follows the plan exactly.
    2.  **Local Repair:** If a step fails (e.g., build error), repairs it *within the scope of the current node*. Does NOT change the high-level goal.
    3.  **Verification:** Runs the specified tests.

## The Workflow

1.  **Select Task**: User identifies the next priority from the Supervisor Graph.
2.  **Clean Slate**:
    *   *Agent Command:* "Load Context" (reads `active_context.md`).
    *   *Action:* Clear extraneous chat history if necessary.
3.  **Plan**: Agent creates `implementation_plan.md`. User reviews.
4.  **Execute**: Agent implements code.
5.  **Verify**: Agent runs tests and updates `walkthrough.md`.
6.  **Re-Integrate**:
    *   Mark task done in Supervisor Graph.
    *   Update `active_context.md` (Session Memory).

## Key Principles
*   **Decoupling**: If Task A fails, it should not break the reasoning for Task B.
*   **Context Hygiene**: Do not drag the history of 10 previous features into the current task. Use the `active_context.md` file to bridge gaps without polluting the context window.
*   **Local Repair**: Fix bugs locally. If the *strategy* is wrong, go back to Planning.
