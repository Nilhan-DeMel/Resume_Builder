/**
 * Firebase Configuration
 * Purpose: Initialize Firebase for hosting
 * 
 * SETUP REQUIRED:
 * 1. Create Firebase project at https://firebase.google.com
 * 2. Replace firebaseConfig with your project values
 * 3. Enable Firebase Hosting
 */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // TODO: Replace
    authDomain: "YOUR_AUTH_DOMAIN", // TODO: Replace
    projectId: "YOUR_PROJECT_ID", // TODO: Replace
    storageBucket: "YOUR_STORAGE_BUCKET", // TODO: Replace
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // TODO: Replace
    appId: "YOUR_APP_ID" // TODO: Replace
};

// Import Firebase from CDN in index.html
// export const firebaseApp = window.firebase.initializeApp(firebaseConfig);
export const firebaseApp = null;
