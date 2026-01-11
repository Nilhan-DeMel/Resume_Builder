/**
 * Global Application State
 * Purpose: Manage application-wide state
 */

import { VIEWS } from '../utils/constants.js';

class AppState {
    constructor() {
        this.currentView = VIEWS.AUTH;
        this.isLoading = false;
        this.error = null;
        this.listeners = [];
    }

    /**
     * Set current view
     * @param {string} view - View name from VIEWS constant
     */
    setView(view) {
        this.currentView = view;
        this.notify();
    }

    /**
     * Set loading state
     * @param {boolean} loading - Is loading
     */
    setLoading(loading) {
        this.isLoading = loading;
        this.notify();
    }

    /**
     * Set error
     * @param {string|null} error - Error message
     */
    setError(error) {
        this.error = error;
        this.notify();
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback - Function to call on state change
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Notify all listeners of state change
     */
    notify() {
        this.listeners.forEach(listener => listener(this));
    }
}

export const appState = new AppState();
