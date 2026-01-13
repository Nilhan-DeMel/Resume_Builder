/**
 * Main Application Entry Point
 * Purpose: Initialize and start the application
 */

import { initSession, listenToAuthChanges } from './auth/session.js';
import { initRouter } from './ui/router.js';
import { initAuthView } from './views/authView.js';
import { initUploadView } from './views/uploadView.js';
import { initEditorView } from './views/editorView.js';
import { appState } from './state/appState.js';
import { DEMO_MODE } from './config/demo.js';
import { logWelcome } from './utils/logger.js';
import { initPromptBuilderData } from './ai/promptBuilder.js';
import { errorLogger } from './utils/errorLogger.js';

// Traceability (TASK-032)
window.TRACE_ID = crypto.randomUUID?.() ?? String(Date.now());
console.log('[RB_BUILD]', 'TASK-032-DEBUG', new Date().toISOString());
console.log(`[TRACE:${window.TRACE_ID}] BOOT main.js loaded`);

/**
 * Initialize application
 */
async function initApp() {
    logWelcome();
    console.log('========================================');
    console.log('Initializing Resume_Builder...');
    console.log('========================================');

    // Boot Marker for Smoke Tests
    console.log('[BOOT] main.js executed');

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
        initUploadView();
        initEditorView();

        console.log('  ✓ Auth view initialized');
        console.log('  ✓ Upload view initialized');
        console.log('  ✓ Editor view initialized');

        // Check for existing session
        console.log('Step 3: Checking session...');
        await initSession();

        // Listen for auth changes
        console.log('Step 4: Setting up auth listeners...');
        listenToAuthChanges();

        console.log('========================================');
        console.log('✓ Resume_Builder initialized successfully');
        console.log('========================================');

        if (DEMO_MODE) {
            console.log('Demo Mode:', DEMO_MODE);
        }

    } catch (error) {
        console.error('========================================');
        console.error('❌ Failed to initialize app:', error);
        console.error('========================================');
        errorLogger.log(error, 'Boot');
        appState.setError('Failed to start application. Please refresh the page.');
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
