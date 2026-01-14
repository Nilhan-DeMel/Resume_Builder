# Reporting Integrity Policy v1.0

**Effective Date**: 2026-01-14
**Authority**: TASK-037

## 1. Zero-Tolerance for Contradictory Reporting

An Agent must **NEVER** claim a task is "perfectly executed" or "complete" if:

1. Any requirement from the User Request is missing from the codebase.
2. Git history does not contain the specific commits implementing those requirements.
3. Verification tests have not been run on the *final* commit SHA.

## 2. The "Ground-Truth" Standard

All reporting must be backed by **Forensic Evidence**.

- **Source of Truth**: The `git` repository history (remote `origin/main`).
- **Required Evidence**:
  - Full 40-character Commit SHA.
  - `git diff --stat` or `git show` proving files were modified.
  - Test suite output (`passed`) generated *after* the final merge.

## 3. Reconciliation Protocol

If a contradiction is discovered (e.g., "I fixed it" vs Repo says "Old code"):

1. **Stop** immediate execution.
2. **Admit** the discrepancy specifically (do not handwave).
3. **Create** a `FORENSIC_RECONCILIATION_<TASK_ID>.md` document.
4. **Trace** the timeline:
    - "I claimed X at timestamp T1."
    - "Git shows commit Y at timestamp T2 did not include X."
    - "Commit Z at timestamp T3 finally added X."
5. **Validate** currently: Run tests on current HEAD.

## 4. Checklist for "Task Complete"

No task is complete until:

- [ ] All code changes are committed and merged to `main`.
- [ ] A final `git log -n 1` proves the Merge Commit exists.
- [ ] Automated tests pass on that Merge Commit.
- [ ] Documentation (REPORT/HANDOFF) matches the code exactly.
