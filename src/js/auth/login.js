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
