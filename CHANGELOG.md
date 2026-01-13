# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Upload: clicking drop-zone opens file picker (no UI change) [TASK-028]

## [2026-01-11] - Agent Session 8

### Fixed

- Issue #2: ES6 module loading requires web server
- Updated scripts/run.sh to auto-start local development server
- Added server requirement documentation

### Changed

- Enhanced run.sh with Python/Node.js detection
- Updated QUICK_START.md with server setup instructions
- Updated README.md with server requirement details

## [2026-01-11] - Agent Session 7

### Added

- Issue tracking system (docs/ISSUES.md)
- Bug fix protocol (docs/AGENT_BUG_FIX_PROTOCOL.md)
- Bug report template (docs/BUG_REPORT_TEMPLATE.md)
- Bug fix workflow to AGENT_GUIDE.md

### Fixed

- ES6 module loading in index.html with proper error handling

### Changed

- Updated CONTEXT.md to include current bug status

## [2026-01-11] - Agent Session 6

### Fixed

- Login form event listener not attaching properly
- Added extensive debug logging
- Added console welcome message for demo mode
- Corrected all dates from 2025 to 2026 (today is 2026-01-11)

## [2026-01-11] - Agent Session 5

### Added

- Demo mode configuration (src/js/config/demo.js)
- Mock API responses for testing without keys
- Mock Supabase auth for testing without setup
- Demo mode instructions in QUICK_START.md and README.md

### Changed

- Updated apiClient.js to support demo mode
- Updated supabase.js to support demo mode

## [2026-01-11] - Agent Session 4

### Added

- scripts/configure.sh - Configuration helper script
- QUICK_START.md - User-friendly setup guide
- Configuration checklist in README.md

## [2026-01-11] - Agent Session 3

### Changed

- **TASK-023B**: "Ruthless Proof Pack" (CI, Error Logs, Helpers, Strict Validators).
- **TASK-023**: Stage-1 Stateless Repo scaffolding (Docs, Validation Scripts, Smoke Test).
- Added error handling to all scripts.
- Renamed dependencies.md → DEPENDENCIES.md for consistency
- Added version history tracking to DEPENDENCIES.md

## [2026-01-11] - Agent Session 2

### Added

- scripts/ directory with run.sh, test.sh, setup.sh
- Definition of Done checklist in AGENT_GUIDE.md
- Commit policy and context budget rules in AGENT_GUIDE.md
- dependencies.md for tracking all dependencies
- Quick start commands in README.md

## [2026-01-11] - Agent Session 1

### Added

- Initialized repository structure.
- Created `README.md`, `AGENT_GUIDE.md`, `CHANGELOG.md`.
- Created `docs/CONTEXT.md`.
- Set up basic `src/` directory with `index.html`, `style.css`, `script.js`.
