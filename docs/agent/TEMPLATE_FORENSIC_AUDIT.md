# Forensic Audit Template

**Task ID**: [TASK-XXX]
**Date**: [YYYY-MM-DD]
**Agent**: Antigravity

## 1. Executive Summary

[Briefly state the outcome. Was the task successful? Were there incidents?]

## 2. Evidence Pack

**Ground-Truth SHA**: `[FULL_SHA]`

### 2.1 Git History

```bash
[Output of git log -n 5 --decorate --oneline]
```

### 2.2 Critical Diffs

[Show files changed to prove implementation]

```bash
git diff --stat [SHA_BEFORE]..[SHA_AFTER]
```

## 3. Incident Log (If Any)

| Incident ID | Description | Root Cause | Fix Applied |
|-------------|-------------|------------|-------------|
| INC-01      |             |            |             |

## 4. Verification

### 4.1 Test Suite

**Command**: `./scripts/test.ps1`
**Result**: [PASS/FAIL]
**Output**:

```text
[Paste last 10 lines of test output]
```

## 5. Branch & Cleanup Status

- **Branch Created**: `[branch-name]`
- **Merge Status**: [Merged / Open / Closed]
- **Cleanup**: [Branch deleted / Kept]

## 6. Integrity Check

- [ ] Code matches requirements?
- [ ] Docs match code?
- [ ] All tests pass?
