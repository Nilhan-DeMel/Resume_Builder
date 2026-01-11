/**
 * Logout Logic
 * Purpose: Handle user logout
 */

import { supabase } from '../config/supabase.js';
import { appState } from '../state/appState.js';
import { cvState } from '../state/cvState.js';

/**
 * Logout current user
 * @returns {Promise<Object>} Result object
 */
export async function logout() {
    try {
        appState.setLoading(true);

        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        // Clear all state
        cvState.reset();

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        appState.setError(error.message);
        return { success: false, error };
    } finally {
        appState.setLoading(false);
    }
}
