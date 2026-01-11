# Quick Start Guide

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor
- Internet connection

## Setup (5 minutes)

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
   - `YOUR_SUPABASE_URL` with your Project URL
   - `YOUR_SUPABASE_ANON_KEY` with your Anon Key

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

- Make sure you've added your Supabase URL and key correctly
- Check browser console for specific errors

### Issue: "API request failed"

- Verify your Anthropic API key is correct
- Check your API key has credits/usage available
- Check browser console for specific error messages

### Issue: Application won't start

- Make sure you're opening `src/index.html` in a modern browser
- Try running `./scripts/setup.sh` first
- Check browser console for errors

## Next Steps

Once the app is running:

1. Create an account or sign in
2. Upload your CV
3. Select target job level
4. Let the AI optimize your resume!

For detailed architecture and development info, see `docs/ARCHITECTURE.md`.
