# Resume_Builder

**A Resume Builder Application developed, maintained, and operated exclusively by AI agents.**

## Overview

Resume_Builder is a web-based application designed to help users create professional resumes. It is built with a unique constraint: **no human directly modifies this code**. All development is handled by stateless AI agents who "fly in," understand the context from this repository, make improvements, and "fly out."

## Status

- **Current Version**: 0.1.0 (Initialization)
- **Status**: Foundation set. Basic structure created. App logic pending.
- **Test Coverage**: 0% (None yet)

## How to Run

**Important**: This app requires a web server to run (ES6 modules).

### Quick Start

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
2. Run `./scripts/run.sh`
3. Test the full UI workflow with mock data

See `QUICK_START.md` for details.

```bash
# Setup (first time only)
./scripts/setup.sh

# Run the application
./scripts/run.sh

# Run tests
./scripts/test.sh
```

## Configuration Checklist

Before running the application, you need to configure:

- [ ] Supabase (Auth & Database)
- [ ] Firebase (Hosting)
- [ ] Anthropic API (AI Processing)

Run `./scripts/configure.sh` to see configuration instructions.

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
