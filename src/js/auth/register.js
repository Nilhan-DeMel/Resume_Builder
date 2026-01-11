/**
 * Registration Logic
 * Purpose: Handle user registration
 */

import { supabase } from '../config/supabase.js';
import { appState } from '../state/appState.js';

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Result object
 */
export async function register(email, password) {
    try {
        appState.setLoading(true);
        appState.setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Registration error:', error);
        appState.setError(error.message);
        return { success: false, error };
    } finally {
        appState.setLoading(false);
    }
}
