/**
 * View Router
 * Purpose: Handle view switching and routing
 */

import { VIEWS } from '../utils/constants.js';
import { appState } from '../state/appState.js';

/**
 * Initialize router
 */
export function initRouter() {
    // Listen to app state changes
    appState.subscribe((state) => {
        renderView(state.currentView);
    });

    // Render initial view
    renderView(appState.currentView);
}

/**
 * Render specific view
 * @param {string} view - View name from VIEWS constant
 */
function renderView(view) {
    // Hide all views
    const allViews = document.querySelectorAll('[data-view]');
    allViews.forEach(v => v.classList.add('hidden'));

    // Show requested view
    const targetView = document.querySelector(`[data-view="${view}"]`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }
}

/**
 * Navigate to view
 * @param {string} view - View name
 */
export function navigateTo(view) {
    appState.setView(view);
}
