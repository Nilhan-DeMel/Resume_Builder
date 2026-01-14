# Agent Handoff - TASK-035.3

Date: 2026-01-14
Agent: Antigravity

## Summary

Fixed DOCX and PDF upload failures caused by race condition in vendor script loader. Added proper readiness gates that verify library globals exist before use.

## What Broke

1. **DOCX**: "Cannot read properties of undefined (reading 'convertToHtml')"
2. **PDF**: "Failed to read file: undefined"

## Root Cause

The `loadScript()` function returned early if the script tag already existed in DOM, without waiting for the script to finish loading. This caused `window.mammoth` and `window.pdfjsLib` to be undefined when the extraction code tried to use them.

## What Changed

### textExtractor.js - Vendor Loading

1. **loadingPromises tracking**: Prevents duplicate concurrent loads
2. **data-loaded attribute**: Marks scripts as fully loaded
3. **ensureMammothReady()**: Verifies `window.mammoth.convertToHtml` exists
4. **ensurePdfJsReady()**: Verifies `window.pdfjsLib.getDocument` exists

### Files Changed

| File | Change |
|------|--------|
| `src/js/upload/textExtractor.js` | Added readiness gates + fixed loadScript race condition |
| `docs/agent/REPORT_TASK-035.3.md` | NEW - Forensic audit report |

## How to Verify

1. Hard refresh: Ctrl+F5 on <http://localhost:8001>
2. Upload DOCX → Check console for `[VENDOR] Mammoth ready`
3. Upload PDF → Check console for `[VENDOR] PDF.js ready`
4. Both should succeed with no errors

## Compliance Gap

TASK-035.2 was partially delivered:

- R1-R3, R7: Fully implemented
- R4 (DOCX styles): HTML captured but not rendered
- R5 (Heading spacing): Not implemented
- O8 (↠ toggle): Not implemented
- O10 (ALL-CAPS headings): Not implemented

See REPORT_TASK-035.3.md for full audit table.
