# Error Logging

## Overview

To assist stateless agents in debugging runtime issues without direct browser access, we capture errors in `localStorage`.

## Accessing Logs

If you have console access (CDP), evaluate:

```javascript
window.__RB_ERRORS.getHistory()
```

## Storage Format

Key: `rb_error_log`
Value: Array of objects:

```json
{
  "timestamp": "ISO String",
  "message": "Error message",
  "stack": "Stack trace",
  "context": "Boot|Auth|Upload"
}
```

## Persistence

Logs persist across reloads.
Clear logs with: `window.__RB_ERRORS.clear()`
