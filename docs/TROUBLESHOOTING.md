# Troubleshooting Guide

## Boot Failures

### 1. Unexpected token 'export'

* **Symptom**: Console error `Uncaught SyntaxError: Unexpected token 'export'` referencing a CDN script (e.g., Supabase, Firebase).
* **Cause**: Loading an ES Module build of a library using a classic `<script>` tag. Classic scripts do not understand `export`.
* **Fix**:
  * Switch to the UMD build of the library (usually `/dist/umd/libname.js`).
  * OR load as `<script type="module">`.

### 2. Unexpected identifier 'assert'

* **Symptom**: `Uncaught SyntaxError: Unexpected identifier 'assert'` on import lines.
* **Cause**: Deprecated JSON import assertion syntax `import ... assert { type: 'json' }`.
* **Fix**: Use a `fetch()` based loader:

    ```javascript
    const response = await fetch('/path/to/data.json');
    const data = await response.json();
    ```

### 3. Unexpected token '{'

* **Symptom**: `Failed to load application: SyntaxError: Unexpected token '{'`.
* **Cause**: Often caused by:
    1. A `.js` request returning JSON (server config error).
    2. Invalid syntax inside a module (e.g., dynamic `import x from y` inside a function without `import()`). (Seen 2026-01-12).
* **Fix**: Check `main.js` for invalid import placement or verify the file content being served.

### 4. Failed to fetch dynamically imported module

* **Symptom**: `TypeError: Failed to fetch dynamically imported module`.
* **Cause**: Opening `index.html` via `file://`.
* **Fix**: Serve via HTTP server (`python -m http.server` or `scripts/run.ps1`).

## Functionality Issues

### Login button does nothing

* **Symptom**: Clicking "Log In" validation passes but no action occurs.
* **Cause**: Event listeners failed to attach because the main application crased during boot.
* **Fix**: Check console for boot errors. Ensure `main.js` reached the "Auth view initialized" step.
