# Standard Operating Procedure (SOP): Medical-Grade Development

To ensure clinical safety, data integrity, and regulatory compliance, every task in **Antigravity** must follow these **7 Mandatory Phases**. 

## Phase 1: Initiation (Safety First)
### 1. Task Selection & Setup
- [ ] **Identify Task**: Select a leaf-node task from `docs/ROADMAP.md`.
- [ ] **Create Branch**: `git checkout -b feature/issue-name`. *Work on `main` is strictly prohibited.*
- [ ] **Security/Privacy Triage**: Does this task touch PII (Patient Identifiable Information) or PHI (Protected Health Information)? If yes, flag it in the plan.

## Phase 2: Planning (The "Design" Step)
### 2. Implementation Planning
- [ ] **Draft Plan**: Create `implementation_plan.md`.
- [ ] **Acceptance Criteria**: Explicitly define what "done and safe" looks like.
- [ ] **Data Integrity Check**: Ensure changes do not break existing clinical data schemas.
- [ ] **Supervisor Approval**: Get explicit "GO" from the User before writing a single line of code.

## Phase 3: Execution (The "Act" Step)
### 3. Code Implementation
- [ ] **Execute Plan**: Follow the implementation plan strictly.
- [ ] **Local Repair**: Fix bugs *within* the task scope. 
- [ ] **Incremental Commits**: Small, atomic commits with clear messages (e.g., `feat:`, `fix:`, `security:`).

## Phase 4: Verification (The "QA" Step)
### 4. Quality Assurance
- [ ] **Regression Testing**: Run the **entire** test suite (e.g., `pytest`), not just new tests.
- [ ] **UI/UX Safety**: Verify that UI changes cannot lead to patient confusion or data entry errors.
- [ ] **Walkthrough**: Create `walkthrough.md` documenting verification results and logs.

## Phase 5: Integration (The "Check" Step)
### 5. Review & Merging
- [ ] **PR Proposal**: Call `notify_user` with a "Ready for Review" message.
- [ ] **Merge to Main**: Only after explicit approval, switch to `main` and merge.
- [ ] **Post-Merge Smoke Test**: Verify the application starts correctly on the `main` branch.

## Phase 6: Closure
### 6. Documentation & Persistence
- [ ] **Roadmap Update**: Mark the task as `[x]` in `docs/ROADMAP.md`.
- [ ] **Agent Memory**: Update `Agent.md` with new architectural patterns or "Traps."
- [ ] **Session Context**: Update `docs/active_context.md`.

---

## 🛑 Clinical Guardrails
*   **Data Models**: Any change to `backend/models` requires a 100% test pass rate.
*   **Privacy**: Any change to `auth` or `security` require a focus-review on PHI protection.
*   **Pseudonymity**: Features must rely on `PREVENT_ID` and user-provided nicknames; external PII (names/contact info) is strictly prohibited.
*   **Hallucination Protection**: Agent logic must always be bounded by the **Patient Journey State Machine**.
