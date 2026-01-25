# Session Context Workflow

To ensure seamless transitions between development sessions, we use a persistent context file: `docs/active_context.md`.

## The Protocol

### 1. Ending a Session (Shutdown)
Before closing the IDE or ending the chat, ask the AI to **"Save Context"**.

**Prompt:**
> "We are wrapping up. Please update `docs/active_context.md` with:
> 1. Our current status (what we just finished).
> 2. The immediate next steps for the next session.
> 3. Any key decisions we made today."

**The AI will:**
*   Overwrite `docs/active_context.md` with a high-fidelity summary.
*   Ensure `task.md` (if active) is up to date.

### 2. Starting a Session (Startup)
When starting a new chat or opening the IDE, ask the AI to **"Load Context"**.

**Prompt:**
> "I'm back. Please read `docs/active_context.md` to get up to speed. What is our focus for today?"

**The AI will:**
*   Read the file.
*   Summarize the previous session's stopping point.
*   Propose the first step to resume work.

## Best Practices
*   **Trust the File:** Treat `active_context.md` as the "long-term memory" of the project.
*   **Be Specific:** If you changed your mind about a feature mid-session, ensure it gets recorded in the "Recent Decisions" section before closing.
