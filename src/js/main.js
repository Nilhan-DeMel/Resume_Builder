/**
 * Main Application Entry Point
 * Purpose: Initialize and start the application
 */

import { initSession, listenToAuthChanges } from './auth/session.js';
import { initRouter } from './ui/router.js';
import { initAuthView } from './views/authView.js';
import { initUploadView } from './views/uploadView.js';
import { appState } from './state/appState.js';
import { DEMO_MODE } from './config/demo.js';
import { logWelcome } from './utils/logger.js';
import { initPromptBuilderData } from './ai/promptBuilder.js';

/**
 * Initialize application
 */
async function initApp() {
    logWelcome();
    console.log('========================================');
    console.log('Initializing Resume_Builder...');
    console.log('Demo Mode:', DEMO_MODE);
    console.log('========================================');

    // ... existing code ...

    try {
        // Initialize AI module data
        console.log('Step 0: Initializing AI data...');
        await initPromptBuilderData();

        // Initialize router
        console.log('Step 1: Initializing router...');
        initRouter();

        // Initialize all views
        console.log('Step 2: Initializing views...');
        initAuthView();
        console.log('  ✓ Auth view initialized');

        initUploadView();
        console.log('  ✓ Upload view initialized');

        // TODO: Initialize other views

        // Check for existing session
        console.log('Step 3: Checking session...');
        await initSession();

        // Listen for auth changes
        console.log('Step 4: Setting up auth listeners...');
        listenToAuthChanges();

        console.log('========================================');
        console.log('✓ Resume_Builder initialized successfully');
        console.log('========================================');
    } catch (error) {
        console.error('========================================');
        console.error('❌ Failed to initialize app:', error);
        console.error('========================================');
        appState.setError('Failed to start application. Please refresh the page.');
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
