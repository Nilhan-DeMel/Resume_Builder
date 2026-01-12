# Module Map

## Entry Point

* `src/js/main.js`: Orchestrator. Bootstraps the app.

## Core Layers (src/js/)

### config/

* `demo.js`: Toggles DEMO_MODE.
* `supabase.js`: Exports `supabase` client (Mock or Real).
* `firebase.js`: Firebase config (currently disabled).

### state/

* `appState.js`: Global UI state (loading, error, current view). Subscribable.
* `userState.js`: User session state.

### ui/

* `router.js`: Handles view switching (hash-based or state-based).
* `toast.js`: Notification system.

### views/

* `authView.js`: Login/Register forms.
* `uploadView.js`: File upload and drag-and-drop.
* **Rule**: Views should listen to State, but Config should NOT import Views.

### auth/

* `login.js`: Business logic for authentication.
* `session.js`: Session persistence logic.

### ai/

* `promptBuilder.js`: JSON-driven prompt logic.
