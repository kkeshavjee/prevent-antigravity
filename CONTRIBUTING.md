# Contributing to Antigravity

Welcome! This guide outlines our development workflow and standards to help us build a secure, personalized diabetes prevention platform.

## Branching Strategy

We follow a **Feature Branching** model. Always branch from `main` and use descriptive prefixes:

- `feature/`: New features (e.g., `feature/motivation-rl`)
- `fix/`: Bug fixes
- `docs/`: Documentation updates
- `chore/`: Maintenance tasks

**Main Branches:**
- `main`: The stable baseline. All code here should be production-ready.
- `feature/auth-security`: RBAC and secure login.
- `feature/motivation-rl`: Reinforcement Learning for the Motivation Agent.
- `feature/mcp-server`: Model Context Protocol integration.
- `feature/patient-matching`: Secure profile linking via invitation codes.

## Development Standard: Task Decoupled Planning (TDP)

We follow the **TDP Protocol** to ensure reliability.
*   **Read the Protocol:** [docs/process/TDP_DEV_PROTOCOL.md](docs/process/TDP_DEV_PROTOCOL.md)
*   **Core Rule:** Never stick to a "Think & Act" loop. Always **Plan** (create `implementation_plan.md`) -> **Execute** -> **Verify**.

## Development Workflow

1.  **Requirement Review**: Check [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md) and the corresponding GitHub Issue.
2.  **Implementation Plan**: For major features, draft an implementation plan (as an `.md` file) and get feedback.
3.  **Branching**: Create your feature branch from `main`.
4.  **Commits**: Use clear, concise commit messages.
    - Example: `feat: add Q-learning service to motivation agent`
    - Example: `docs: update deployment instructions in README`
5.  **Pull Requests**: Open a Draft PR if work is in progress. Link the PR to relevant GitHub Issues.

## Communication

- **Supervisor Graph**: Use `docs/ROADMAP.md` to track dependencies and select the next task.
- **Session Continuity**: Use `docs/active_context.md` to save/restore context. See [Session Workflow](docs/guides/SESSION_WORKFLOW.md).
    - **Note**: Do not commit the populated `active_context.md` file. It is local-only and ignored by git to keep the repo clean.
- **Project Tasks**: See the `docs/ROADMAP.md` file for a project‑wide task board.
- **Specifications**: High-level vision lives in the PRD. Granular technical discussions happen within GitHub Issues.
- **Reviews**: All code must be reviewed via Pull Request before merging to `main`.

## Security & Compliance

As a digital health intervention, **privacy and security are non-negotiable**.
- Adhere to PHIPA/PIPEDA guidelines where applicable.
- Never commit sensitive data (API keys, patient records) to version control.
- **Pseudonymity Rule**: Do not design features that require or ingest real names, emails, or phone numbers from external health networks (OHN). Use the `PREVENT_ID` and user-provided nicknames only.
- Ensure all new API endpoints are protected by appropriate authorization.
