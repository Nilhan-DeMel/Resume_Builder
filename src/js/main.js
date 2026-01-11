/**
 * Main Application Entry Point
 * Purpose: Initialize and start the application
 */

import { initSession, listenToAuthChanges } from './auth/session.js';
import { initRouter } from './ui/router.js';
import { initAuthView } from './views/authView.js';
import { initUploadView } from './views/uploadView.js';
import { appState } from './state/appState.js';

/**
 * Initialize application
 */
async function initApp() {
    console.log('Initializing Resume_Builder...');

    try {
        // Initialize router
        initRouter();

        // Initialize all views
        initAuthView();
        initUploadView();
        // TODO: Initialize other views

        // Check for existing session
        await initSession();

        // Listen for auth changes
        listenToAuthChanges();

        console.log('Resume_Builder initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        appState.setError('Failed to start application. Please refresh the page.');
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
