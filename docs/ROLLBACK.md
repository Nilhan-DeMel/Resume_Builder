# Emergency Rollback Protocol

## When to Rollback

If a deployment or commit breaks the "Boot Sequence" or "Smoke Test" and cannot be fixed within 10 minutes.

## How to Rollback

1. **Check Last Known Good (LKG)**:
    Read `docs/audit/LAST_KNOWN_GOOD.md` to find the safe commit hash.
2. **Hard Reset (Local)**:

    ```bash
    git reset --hard <LKG_HASH>
    ```

3. **Restore Helper Scripts**:
    If scripts were deleted, copy `scripts/` from the `chore/stateless-stage1` branch.
4. **Verify**:
    Run `./scripts/test.ps1` immediately.

## Tagging LKG

When a milestone is reached (e.g., Task 23 complete):

```bash
git tag lkg-task23-<date>
git push origin --tags
```
