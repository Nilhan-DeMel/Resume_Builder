# Supabase Setup Guide

This guide details how to set up the Supabase backend for the Resume Builder.

## 1. Create Project

1. Go to [Supabase](https://supabase.com) and sign in.
2. Click "New Project".
3. Name: `Resume_Builder`.
4. Region: Choose closest to users.
5. Create a strong database password.

## 2. Authentication

1. Go to **Authentication** -> **Providers**.
2. Enable **Email/Password**.
   - Disable "Confirm email" for development if desired (Users -> Auth Settings).
3. (Optional) Enable **Google**.
   - You will need a distinct Google Cloud Project.
   - Add Client ID and Secret in Supabase.

## 3. Storage

1. Go to **Storage**.
2. Create a new bucket named `resumes`.
3. Set visibility to **Private**.
4. Add Policy:
   - **Name**: "Authenticated users can upload"
   - **Allowed operations**: INSERT, SELECT
   - **Target roles**: authenticated

## 4. Database (Optional for V1)

For V2 features like saving history:

1. Go to **SQL Editor**.
2. Run:

   ```sql
   create table user_profiles (
     id uuid references auth.users not null primary key,
     edit_count integer default 0,
     is_premium boolean default false
   );
   ```

## 5. Connect to App

1. Go to **Project Settings** -> **API**.
2. Copy `Project URL`.
3. Copy `anon` public key.
4. Update `src/js/config/supabase.js` with these values.
