# Smoke Test Specification

## Purpose

Verifies that the "Boot Critical" artifacts are being served correctly by the local web server **before** a user attempts to load the application in a browser.

## Checks Performed

| Check Name | Target URL | Assertion Rule | Why? |
| :--- | :--- | :--- | :--- |
| **Index** | `/` | Contains `import('./js/main.js')` | Ensures HTML loads the module entry point. |
| **Main JS** | `/js/main.js` | Contains `Initializing Resume_Builder` | Verifies main bundle is readable. |
| **Demo Config** | `/js/config/demo.js` | Contains `DEMO_MODE` | Ensures mode flag is accessible. |
| **Login Logic** | `/js/auth/login.js` | Contains `DEMO` | Verifies bypass logic is present. |
| **Supabase Config** | `/js/config/supabase.js` | Contains `supabase` | Verifies Supabase client config. |

## Upload View Readiness (Critical)

| Check Name | Target URL | Assertion Rule | Why? |
| :--- | :--- | :--- | :--- |
| **Upload View** | `/js/views/uploadView.js` | Contains `export` & `initUploadView` | Verifies View module is valid. |
| **Constants** | `/js/utils/constants.js` | Contains `UPLOAD` | Verifies Route constants exist. |
| **Main Init** | `/js/main.js` | Contains `initUploadView` | Verifies Main initializes Upload View. |

## Fail state

If any check fails, the script returns exit code `1` and prints the specific failure. This prevents the pipeline from creating a PR or the user from assuming the app is broken.
