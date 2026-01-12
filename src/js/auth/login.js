/**
 * Login Logic
 * Purpose: Handle user login
 */

import { supabase } from '../config/supabase.js';
import { appState } from '../state/appState.js';
import { DEMO_MODE } from '../config/demo.js';
import { VIEWS } from '../utils/constants.js';
import { navigateTo } from '../ui/router.js';

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

        // DEMO BYPASS
        if (DEMO_MODE) {
            console.log('[DEMO] Bypassing login...');
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Set dummy user
            const demoUser = { id: 'demo-user', email: email || 'demo@example.com' };
            // Update state (assuming userState exists or we just navigate)
            // Ideally we'd call userState.setUser(demoUser) but let's just route for now

            console.log('[DEMO] Login successful -> Upload View');
            navigateTo(VIEWS.UPLOAD);
            return { success: true, data: { user: demoUser } };
        }

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
