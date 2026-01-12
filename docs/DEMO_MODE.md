# Demo Mode Guide

## Overview

**DEMO_MODE** allows the application to run locally without backend connectivity (Supabase/OpenAI) by using mock data and bypassing authentication checks.

## configuration

* **Flag Location**: `src/js/config/demo.js`
* **Setting**: `export const DEMO_MODE = true;`

## What Works (Mocked)

* **Authentication**: Login bypasses Supabase. Use any email/password.
* **Navigation**: Routes correctly to Upload/Editor views.
* **Responses**: Mock AI responses (CV optimization) are defined in `DEMO_RESPONSES`.

## What Does NOT Work

* **Real Persistence**: Data is not saved to a database. Refreshing clears state.
* **Real AI**: No actual OpenAI calls are made.

## Verification

In the browser console, look for:

* `Demo Mode: true` (Boot log)
* `🎭 DEMO MODE: Using mock authentication` (Supabase init)
* `[DEMO] Login successful -> Upload View` (On login attempt)
