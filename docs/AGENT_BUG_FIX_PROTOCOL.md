# Agent Bug Fix Protocol

## For Stateless Agents Arriving to Fix Bugs

### Before You Start (Fly In Checklist)

1. Read `docs/ISSUES.md` - find your assigned issue
2. Read `docs/CONTEXT.md` - understand current state
3. Read `AGENT_GUIDE.md` - understand workflow
4. Read issue description carefully - understand what's broken

### During Fix (Work Checklist)

1. Reproduce the bug locally if possible
2. Identify root cause
3. Implement minimal fix (don't refactor unrelated code)
4. Test the fix works
5. Document what you did

### Before You Leave (Fly Out Checklist)

1. Update `docs/ISSUES.md` - mark issue as closed, add resolution
2. Update `CHANGELOG.md` - log what was fixed
3. Update `docs/CONTEXT.md` - note the fix
4. Commit with clear message: "Fix #[issue-number]: [brief description]"
5. Run `scripts/test.sh` if tests exist

## Bug Fix Commit Message Format

```
Fix #[issue-number]: [Brief description]

Problem: [What was broken]
Cause: [Root cause]
Solution: [What you did]
Tested: [How you verified it works]
```

Example:

```
Fix #1: Login form not submitting in demo mode

Problem: Login button click had no effect
Cause: ES6 modules not loading properly from index.html
Solution: Updated module import with error handling
Tested: Opened index.html, login now works in demo mode
```
