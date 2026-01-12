# Branch Workflow

1. **Main Branch**: `main` (or `master`). Protected. **NO DIRECT COMMITS.**
2. **Branch Naming**:
    * `fix/...` : Bug fixes.
    * `feat/...` : New features.
    * `chore/...`: Maintenance, docs, scripts.
3. **Pre-PR Checks**:
    * Run `./scripts/test.ps1` (Windows) or `./scripts/test.sh` (Linux).
    * Ensure all tests PASS.
4. **Documentation**:
    * Update `CHANGELOG.md`.
    * Add an entry to `docs/audit/` if significant architectural changes or forensic recovery occurred.
5. **Pull Request**:
    * Use the template provided in `.github/pull_request_template.md`.
