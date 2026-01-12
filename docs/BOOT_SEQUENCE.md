# Boot Sequence

1. **HTML Load**: `src/index.html` loads.
    * Loads CSS.
    * Loads `window.supabase` (UMD build).
    * Imports module `./js/main.js`.
2. **Entry Point**: `src/js/main.js`.
    * Imports config, router, views, session.
    * **Step 0**: `initPromptBuilderData()` (Loads JSON rules).
    * **Step 1**: `initRouter()`.
    * **Step 2**: `initAuthView()`, `initUploadView()` (Attaches DOM listeners).
    * **Step 3**: `initSession()` (Checks auth state).
    * **Step 4**: `listenToAuthChanges()`.
3. **Boot Success**:
    * Console logs: `✓ Resume_Builder initialized successfully`.
4. **Failure**:
    * `catch` block in `main.js` catches init errors.
    * `catch` block in `index.html` catches module load errors (e.g., syntax).
