/**
 * Supabase Configuration
 * Purpose: Initialize and export Supabase client
 * 
 * SETUP REQUIRED:
 * 1. Create Supabase project at https://supabase.com
 * 2. Replace SUPABASE_URL and SUPABASE_ANON_KEY with your values
 * 3. Set up authentication providers in Supabase dashboard
 */

import { DEMO_MODE } from './demo.js';

const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // TODO: Replace with actual URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // TODO: Replace with actual key

// Demo mode - create mock Supabase client
if (DEMO_MODE) {
    console.log('🎭 DEMO MODE: Using mock authentication');

    // Mock Supabase client for demo
    export const supabase = {
        auth: {
            signInWithPassword: async ({ email, password }) => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return {
                    data: {
                        user: { id: 'demo-user', email: email },
                        session: { access_token: 'demo-token' }
                    },
                    error: null
                };
            },
            signUp: async ({ email, password }) => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return {
                    data: {
                        user: { id: 'demo-user', email: email },
                        session: { access_token: 'demo-token' }
                    },
                    error: null
                };
            },
            signOut: async () => {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { error: null };
            },
            getSession: async () => {
                return { data: { session: null }, error: null };
            },
            onAuthStateChange: (callback) => {
                return { data: { subscription: { unsubscribe: () => { } } } };
            },
            signInWithOAuth: async ({ provider }) => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return {
                    data: { url: '#', provider },
                    error: null
                };
            }
        }
    };
} else {
    // Real Supabase client
    if (!window.supabase) {
        throw new Error('Supabase library not loaded. Check CDN script in index.html');
    }
    export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
