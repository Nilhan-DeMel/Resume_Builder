/**
 * Supabase Configuration
 * Purpose: Initialize and export Supabase client
 * 
 * SETUP REQUIRED:
 * 1. Create Supabase project at https://supabase.com
 * 2. Replace SUPABASE_URL and SUPABASE_ANON_KEY with your values
 * 3. Set up authentication providers in Supabase dashboard
 */

const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // TODO: Replace with actual URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // TODO: Replace with actual key

// Import Supabase from CDN in index.html
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
