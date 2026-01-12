
---

## 6. src/js/auth/login.js

/**

* Login Logic
* Purpose: Handle user login
 */

import { supabase } from '../config/supabase.js';
import { appState } from '../state/appState.js';

/**

* Login with email and password
* @param {string} email - User email
* @param {string} password - User password
* @returns {Promise<Object>} Result object
 */
export async function login(email, password) {
    try {
        appState.setLoading(true);
        appState.setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Login error:', error);
        appState.setError(error.message);
        return { success: false, error };
    } finally {
        appState.setLoading(false);
    }
}

/**

* Login with OAuth provider
* @param {string} provider - OAuth provider (google, github, etc.)
* @returns {Promise<Object>} Result object
 */
export async function loginWithProvider(provider) {
    try {
        appState.setLoading(true);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('OAuth login error:', error);
        appState.setError(error.message);
        return { success: false, error };
    } finally {
        appState.setLoading(false);
    }
}

---

## 7. README.md

# Resume_Builder

**A Resume Builder Application developed, maintained, and operated exclusively by AI agents.**

## Overview

Resume_Builder is a web-based application designed to help users create professional resumes. It is built with a unique constraint: **no human directly modifies this code**. All development is handled by stateless AI agents who "fly in," understand the context from this repository, make improvements, and "fly out."

## Status

* **Current Version**: 0.1.0 (Initialization)
* **Status**: Foundation set. Basic structure created. App logic pending.
* **Test Coverage**: 0% (None yet)

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

* [ ] Supabase (Auth & Database)
* [ ] Firebase (Hosting)
* [ ] Anthropic API (AI Processing)

Run `./scripts/configure.sh` to see configuration instructions.

See `QUICK_START.md` for detailed setup guide.

## Architecture

* **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+).
* **State**: Currently runs locally in the browser.
* **Design System**: To be defined.

## For Agents

If you are an AI agent reading this:

1. **READ** `AGENT_GUIDE.md` immediately. It contains your operating instructions.
2. **READ** `docs/CONTEXT.md` to understand the current work in progress.
3. **CHECK** `CHANGELOG.md` for recent history.

---

## 8. QUICK_START.md

# Quick Start Guide

## Prerequisites

* Modern web browser (Chrome, Firefox, Safari, Edge)
* Text editor
* Internet connection

## Setup (5 minutes)

## Important: Development Server Required

This application uses ES6 modules which require a web server. You cannot simply open `index.html` as a file.

### Running the Development Server

We've made this easy for you:

```bash
./scripts/run.sh
```

This script will automatically:

* Detect if you have Python or Node.js installed
* Start a local web server on port 8000
* Give you the URL to open

Then open in your browser: **<http://localhost:8000>**

### If You Don't Have Python or Node.js

**Install Python** (easiest):

* Windows: <https://www.python.org/downloads/>
* Mac: Already installed (try `python3 --version`)
* Linux: Already installed (try `python3 --version`)

**Or install Node.js**:

* All platforms: <https://nodejs.org/>

After installation, run `./scripts/run.sh` again.

### Demo Mode (Try Without API Keys!)

Want to test the UI before setting up API keys? The app includes a demo mode!

1. Make sure `DEMO_MODE = true` in `src/js/config/demo.js` (it's on by default)
2. Run `./scripts/run.sh`
3. Open `src/index.html` in your browser
4. Use ANY email/password to "log in" (it's mocked)
5. Upload a sample CV and test the workflow

**Demo mode uses mock responses** - the AI won't actually process your CV, but you can test the entire user interface and workflow.

When ready for real API processing, set `DEMO_MODE = false` and follow the setup steps below.

---

### Step 1: Run Configuration Helper

```bash
./scripts/configure.sh
```

### Step 2: Configure Supabase

1. Go to <https://supabase.com> and create account
2. Click "New Project"
3. Note your **Project URL** and **Anon Key**
4. Open `src/js/config/supabase.js`
5. Replace:
   * `YOUR_SUPABASE_URL` with your Project URL
   * `YOUR_SUPABASE_ANON_KEY` with your Anon Key

**Detailed instructions:** See `docs/SUPABASE_SETUP.md`

### Step 3: Configure Firebase

1. Go to <https://firebase.google.com> and create account
2. Click "Add Project"
3. Enable Firebase Hosting
4. Copy your Firebase config from Project Settings
5. Open `src/js/config/firebase.js`
6. Replace the entire `firebaseConfig` object with your values

**Detailed instructions:** See `docs/FIREBASE_SETUP.md`

### Step 4: Configure Anthropic API

1. Go to <https://console.anthropic.com>
2. Create API key
3. Open `src/js/config/api.js`
4. Replace `PLACEHOLDER_API_KEY` with your actual key

**SECURITY WARNING:** Never commit your real API key to git!

**Detailed instructions:** See `docs/API_INTEGRATION.md`

### Step 5: Run Application

```bash
./scripts/run.sh
```

Open `src/index.html` in your browser.

## Troubleshooting

### Issue: "Supabase is not defined"

* Make sure you've added your Supabase URL and key correctly
* Check browser console for specific errors

### Issue: "API request failed"

* Verify your Anthropic API key is correct
* Check your API key has credits/usage available
* Check browser console for specific error messages

### Issue: Application won't start

* Make sure you're opening `src/index.html` in a modern browser
* Try running `./scripts/setup.sh` first
* Check browser console for errors

## Next Steps

Once the app is running:

1. Create an account or sign in
2. Upload your CV
3. Select target job level
4. Let the AI optimize your resume!

For detailed architecture and development info, see `docs/ARCHITECTURE.md`.
