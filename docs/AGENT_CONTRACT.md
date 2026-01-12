# AGENT CONTRACT

> **WARNING**: This repository is essentially a "relay race". You are the current runner. The baton is the code state.

## 1. The Prime Directive

**The repository is the Source of Truth.**
Do not assume memory of previous chats. Do not assume user context. Read `docs/CONTEXT.md`, `CHANGELOG.md`, and `README.md` to orient yourself.

## 2. Stateless Operations

* **Branching**: NEVER commit directly to `main`. create a `chore/`, `fix/`, or `feat/` branch.
* **Testing**: ALWAYS run `./scripts/test.ps1` (or `.sh`) before asking for review.
* **Logging**: Record your "Run Log" in `docs/audit/` if you perform significant changes.
* **Docs**: Update `docs/` if you change architecture. Code and Docs must match.

## 3. Definition of Done

A task is NOT done until:

1. Code is committed.
2. Tests pass (`scripts/test.*`).
3. `CHANGELOG.md` is updated.
4. User is notified with a concise summary.
