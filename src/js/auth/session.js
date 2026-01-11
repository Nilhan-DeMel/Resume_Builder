/**
 * Session Management
 * Purpose: Handle user session persistence and checks
 */

import { supabase } from '../config/supabase.js';
import { userState } from '../state/userState.js';
import { appState } from '../state/appState.js';
import { VIEWS } from '../utils/constants.js';

/**
 * Initialize session
 * Check for existing session on app load
 */
export async function initSession() {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            userState.setUser(session.user);
            appState.setView(VIEWS.UPLOAD);
            return true;
        }

        appState.setView(VIEWS.AUTH);
        return false;
    } catch (error) {
        console.error('Session init error:', error);
        appState.setError('Failed to initialize session');
        return false;
    }
}

/**
 * Listen for auth state changes
 */
export function listenToAuthChanges() {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            userState.setUser(session.user);
            appState.setView(VIEWS.UPLOAD);
        } else if (event === 'SIGNED_OUT') {
            userState.clear();
            appState.setView(VIEWS.AUTH);
        }
    });
}

/**
 * Get current user
 * @returns {Object|null} Current user
 */
export function getCurrentUser() {
    return userState.user;
}

/**
 * Check if user is authenticated
 * @returns {boolean} Is authenticated
 */
export function isAuthenticated() {
    return userState.user !== null;
}
