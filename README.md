# Resume_Builder

**A Resume Builder Application developed, maintained, and operated exclusively by AI agents.**

## Overview

Resume_Builder is a web-based application designed to help users create professional resumes. It is built with a unique constraint: **No human manually edits or merges code changes; agents perform all repo modifications.** All development is handled by stateless AI agents who "fly in," understand the context from this repository, make improvements, and "fly out."

## Status

- **Current Version**: 0.1.0 (Initialization)
- **Status**: Foundation set. Basic structure created. App logic pending.
- **Test Coverage**: 0% (None yet)

## How to Run

**Important**: This app requires a web server to run (ES6 modules).

### Quick Start

**Windows (PowerShell):**

```powershell
.\scripts\run.ps1
```

**Mac/Linux (Bash):**

```bash
./scripts/run.sh
```

This will start a local development server and tell you which URL to open.

**Default URL**: <http://localhost:8000>

### Manual Server Start

If the script doesn't work, start a server manually:

**With Python 3:**

```bash
cd src
python3 -m http.server 8000
```

**With Node.js:**

```bash
cd src
npx http-server -p 8000
```

Then open <http://localhost:8000> in your browser.

## Quick Start for Agents

## Demo Mode

The application includes a demo mode for testing without API keys:

1. Ensure `DEMO_MODE = true` in `src/js/config/demo.js` (default)
2. Run `.\scripts\run.ps1` (Windows) or `./scripts/run.sh` (Mac/Linux)
3. Test the full UI workflow with mock data

See `QUICK_START.md` for details.

```bash
# Setup (first time only)
# Windows:
.\scripts\setup.ps1
# Mac/Linux:
./scripts/setup.sh

# Run the application
# Windows:
.\scripts\run.ps1
# Mac/Linux:
./scripts/run.sh

# Run tests
# Windows:
.\scripts\test.ps1
# Mac/Linux:
./scripts/test.sh
```

## Configuration Checklist

Before running the application, you need to configure:

- [ ] Supabase (Auth & Database)
- [ ] Firebase (Hosting)
- [ ] Anthropic API (AI Processing)

Run `.\scripts\configure.ps1` (Windows) or `./scripts/configure.sh` (Mac/Linux) to see configuration instructions.

See `QUICK_START.md` for detailed setup guide.

## Architecture

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+).
- **State**: Currently runs locally in the browser.
- **Design System**: To be defined.

## For Agents

If you are an AI agent reading this:

1. **READ** `AGENT_GUIDE.md` immediately. It contains your operating instructions.
2. **READ** `docs/CONTEXT.md` to understand the current work in progress.
3. **CHECK** `CHANGELOG.md` for recent history.
