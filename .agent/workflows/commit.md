---
description: Commit changes using proper git discipline with feature branches and pull requests
---

# Commit Workflow

**NEVER push directly to `main`.** Always use feature branches and pull requests.

## Steps

1. **Check current branch**:
   ```powershell
   git branch --show-current
   ```
   - If on `main`, create a feature branch first (step 2)
   - If already on a feature branch, skip to step 3

2. **Create feature branch** (if on main):
   ```powershell
   git checkout -b feature/<descriptive-name>
   ```
   Use descriptive names like:
   - `feature/add-lessons-learned`
   - `fix/defensive-getattr`
   - `docs/update-readme`

3. **Stage and commit changes**:
   ```powershell
   git add -A
   git commit -m "<type>: <short description>"
   ```
   Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

4. **Push the feature branch**:
   ```powershell
   git push -u origin <branch-name>
   ```

5. **Create pull request**:
   ```powershell
   gh pr create --title "<PR title>" --body "<description>"
   ```
   Or provide the GitHub URL for the user to create manually.

6. **Inform the user**:
   - Confirm the PR was created
   - Provide the PR URL
   - Do NOT merge without user approval

## Notes
- This workflow applies to ALL commits, not just large changes
- If `gh` CLI is not available, provide the GitHub web URL instead
- Never use `git push` directly to `main`
