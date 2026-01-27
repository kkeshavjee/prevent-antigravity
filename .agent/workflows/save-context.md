---
description: Save the current session context to docs/active_context.md for continuity across sessions
---

# Save Context Workflow

When the user says "save context" or similar, follow these steps:

## Steps

1. **Read the existing context file** at `docs/active_context.md` to understand the previous state and format.

2. **Update `docs/active_context.md`** with the following structure:
   ```markdown
   # Active Context: [YYYY-MM-DD] <Brief Session Description>

   ## Current Session Summary
   <Bullet points of what was accomplished or discussed this session>

   ## Current Technical State
   - **Active Branch**: <current git branch>
   - **Key Files Modified**: <list if applicable>
   - **Environment Notes**: <any relevant state>

   ## Next Steps
   <Numbered list of immediate next actions>

   **Status**: Context saved. Ready to resume from <starting point>.
   ```

3. **Confirm to the user** that context has been saved and summarize the key points.

## Notes
- Always OVERWRITE the file (this is a living document, not a log)
- Keep summaries concise but complete enough to resume work
- Include specific file paths, branch names, and actionable next steps
- If there's detailed task information (like a code review checklist), save that separately to `.gemini/task_<name>_<date>.md` and reference it from active_context.md
