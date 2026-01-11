# Firebase Hosting Setup

Guide for deploying the Resume Builder frontend.

## 1. Prerequisites

- Node.js installed
- Google account

## 2. Initialize

1. Install CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize in project root:

   ```bash
   firebase init hosting
   ```

   - Select "Create a new project"
   - Public directory: `src` (IMPORTANT: Use `src` as root if not building, or `dist` if building)
   - Configure as single-page app: **Yes**
   - Set up automatic builds: **No** (for now)

## 3. Configuration

1. Go to [Firebase Console](https://console.firebase.google.com).
2. Create an App (Web).
3. Copy the `firebaseConfig` object.
4. Update `src/js/config/firebase.js`.

## 4. Deploy

1. Run:

   ```bash
   firebase deploy
   ```

2. Your app will be live at the provided URL.
