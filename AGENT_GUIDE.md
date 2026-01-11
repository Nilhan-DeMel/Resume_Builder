# AGENT_GUIDE

**Welcome, Agent. This repository is your memory.**

You are a stateless entity. You arrive with no prior knowledge of what happened before. Everything you need to know is in these files.

## Workflow (The "Fly In, Fly Out" Protocol)

### 1. On Arrival (Fly In)

- **Read `README.md`**: Understand the high-level purpose.
- **Read `docs/CONTEXT.md`**: This is critical. It tells you where we are, what was just done, and what needs doing next.
- **Read `CHANGELOG.md`**: See the recent history of changes to understand the trajectory.

### 2. During Work

- **Incremental Changes**: Make small, verifiable changes.
- **Stateless Mindset**: Do not assume anything you don't see in a file. If something is important, WRITE IT DOWN.
- **Preserve Context**: You are passing the baton to the next agent. Make it easy for them.

### 3. Before Departure (Fly Out)

- **Update `CHANGELOG.md`**: Log your changes clearly.
- **Update `docs/CONTEXT.md`**: Update the "Current State" and "Next Steps". Leave no ambiguity for the next agent.
- **Verify**: Ensure the code runs. Do not break the build.

## Definition of Done (Checklist Before You Leave)

Every agent session must complete ALL of these before departure:

- [ ] Code runs without errors (verify with `scripts/run.sh`)
- [ ] Tests pass if tests exist (run `scripts/test.sh`)
- [ ] CHANGELOG.md updated with what you did
- [ ] docs/CONTEXT.md updated with:
  - Current state of the app
  - What you accomplished
  - Next steps for the next agent
  - Any blockers or issues
- [ ] README.md updated if functionality changed
- [ ] Repository is in a stable state (not broken mid-refactor)
- [ ] All changes committed with clear message

**Commit Policy:**

- Only commit when the repository is stable/green
- NEVER commit broken code
- If you must pause mid-work: document clearly in CONTEXT.md what is incomplete and mark it as "IN PROGRESS"

**Context Budget:**

- Keep docs/CONTEXT.md focused on the last 3 agent sessions
- Archive older context to `docs/archive/CONTEXT_[YYYY-MM-DD].md` when it exceeds 3 sessions

## Conventions

### File Structure

- `src/`: All application source code.
- `docs/`: Documentation and context.
- `tests/`: Automated tests (future).

### Documentation

- **Decisions**: If you make an architectural decision, log it in `docs/CONTEXT.md` or a dedicated `docs/decisions/` file if complex.
- **Deletions**: Never delete without explanation in the CHANGELOG.

## Triggers & Guardrails

- **> 5 Source Files**: Add linting and code style rules.
- **Core Functionality Working**: Add test suite.
- **Refactoring**: Add strict boundaries and extensive logging.

**Remember: You are building the brain of this project. Keep it organized.**
