# Known Issues

## Resolved Issues

### Boot Crash: Unexpected token 'export' (Supabase/Firebase)

* **Root Cause**: Loading ESM builds (which use `export`) via classic `<script>` tags in `index.html`. Browsers cannot parse `export` unless `type="module"`.
* **Fix**: Switched Supabase to UMD build (`/dist/umd/supabase.js`) which assigns to `window.supabase`. Disabled Firebase script for local demo.
* **Date**: 2026-01-12

### Boot Crash: Unexpected token '{'

* **Root Cause**: Invalid syntax in `src/js/main.js`. An `import` statement was placed inside a `try/catch` block, which is invalid in ES modules.
* **Fix**: Moved dynamic import to top-level.
* **Date**: 2026-01-12

### Parse Error: Unexpected identifier 'assert'

* **Root Cause**: Deprecated JSON import assertion syntax (`import ... assert { type: 'json' }`) rejected by modern browsers/environments.
* **Fix**: Replaced with `fetch()` based async loader helper.
* **Date**: 2026-01-11
