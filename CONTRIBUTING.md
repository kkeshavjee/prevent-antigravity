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

## Development Workflow

1.  **Requirement Review**: Check [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md) and the corresponding GitHub Issue.
2.  **Implementation Plan**: For major features, draft an implementation plan (as an `.md` file) and get feedback.
3.  **Branching**: Create your feature branch from `main`.
4.  **Commits**: Use clear, concise commit messages.
    - Example: `feat: add Q-learning service to motivation agent`
    - Example: `docs: update deployment instructions in README`
5.  **Pull Requests**: Open a Draft PR if work is in progress. Link the PR to relevant GitHub Issues.

## Communication

- **Visual Roadmap**: Use the internal `task.md` for daily status and checklist tracking.
- **Specifications**: High-level vision lives in the PRD. Granular technical discussions happen within GitHub Issues.
- **Reviews**: All code must be reviewed via Pull Request before merging to `main`.

## Security & Compliance

As a digital health intervention, **privacy and security are non-negotiable**.
- Adhere to PHIPA/PIPEDA guidelines where applicable.
- Never commit sensitive data (API keys, patient records) to version control.
- Ensure all new API endpoints are protected by appropriate authorization.
