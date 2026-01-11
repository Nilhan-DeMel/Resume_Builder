# Active Issues

## Issue Template

When reporting an issue for a stateless agent to fix:

```
### Issue #[NUMBER]
**Status**: Open/In Progress/Closed
**Priority**: Critical/High/Medium/Low
**Reported**: [DATE]
**Assigned**: [Agent Session Number or "Unassigned"]

**Problem Description**:
[Clear description of what's broken]

**How to Reproduce**:
1. Step 1
2. Step 2
3. Expected vs Actual

**Affected Files**:
- file1.js
- file2.css

**Proposed Solution** (if known):
[Description]

**Resolution** (when closed):
[What was done to fix it]
```

## Current Issues

### Issue #1

**Status**: Open
**Priority**: Critical
**Reported**: 2026-01-11

**Problem Description**:
Login form does not submit in demo mode. No errors shown, button click has no effect.

**How to Reproduce**:

1. Open src/index.html in browser
2. Enter any email/password (e.g., <test@test.com> / password123)
3. Click "Log In"
4. Expected: Navigate to upload view
5. Actual: Nothing happens, stays on login screen

**Affected Files**:

- src/index.html
- src/js/main.js
- src/js/views/authView.js

**Proposed Solution**:
ES6 module loading issue. Modules may not be loading properly from index.html.

**Resolution**:
[To be filled by agent who fixes this]
