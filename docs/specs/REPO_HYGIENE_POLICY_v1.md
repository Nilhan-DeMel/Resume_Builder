# REPO HYGIENE POLICY v1.0

**Effective Date**: 2026-01-14
**Authority**: TASK-037.1

## 1. Branch Management

### 1.1 Branch Lifecycle

- **Create**: Use descriptive names `feat/`, `fix/`, `chore/` + `task-ID` (e.g., `fix/pdf-render-task-035`).
- **Merge**: Always merge to `main`.
- **Delete**: Delete remote branch **IMMEDIATELY** after successful merge and validation.
- **Stale Branches**: Any merged branch older than 48 hours is subject to auto-deletion.

### 1.2 Default Branch

- The remote default branch must ALWAYS be `main`.
- Never change the default branch to a feature/chore branch.

## 2. CI/CD Standards

### 2.1 Green Master

- `main` must always pass CI (`./scripts/test.sh` / `test.ps1`).
- If CI fails on `main`, fixing it is the **HIGHEST PRIORITY**.
- No new features until `main` is green.

### 2.2 Local Verification

- Developers/Agents must run `./scripts/test.ps1` locally before pushing.
- "It works on my machine" is valid ONLY if the local environment matches CI expectations.

## 3. Reporting Integrity

### 3.1 Truth over Agreement

- Never report "success" if tests fail.
- Cite specific Commit SHAs for all deliverables.
- If a task is partially complete, report it as "Partial" or "In Progress", never "Complete".

### 3.2 Audit Trail

- Key architectural decisions must be logged in `docs/specs/`.
- Handoff documents must link to specific file changes.
