# TASK-035.3 Forensic Audit Report

Date: 2026-01-14
Agent: Antigravity

## Executive Summary

DOCX and PDF uploads were broken due to a race condition in the vendor script loader. Scripts were being injected but code was executing before they finished loading. TXT worked because it has no vendor dependencies.

---

## Evidence Captured

### Screenshot 1: DOCX Upload Error

![DOCX Error](file:///C:/Users/Nilhan%20Work/.gemini/antigravity/brain/abf26316-519a-4860-a35a-7d048f1e5e1f/uploaded_image_0_1768369198199.png)

**Error**: "Failed to read file: Cannot read properties of undefined (reading 'convertToHtml')"

### Screenshot 2: PDF Upload Error

![PDF Error](file:///C:/Users/Nilhan%20Work/.gemini/antigravity/brain/abf26316-519a-4860-a35a-7d048f1e5e1f/uploaded_image_1_1768369198199.png)

**Error**: "Failed to read file: undefined"

---

## Root Cause Analysis

### Primary Cause: Race Condition in loadScript()

**Old Code (textExtractor.js lines 8-16):**

```javascript
async function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return; // BUG: Returns BEFORE script loads!
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
```

**Problem**: If the script tag already exists in DOM (e.g., from a previous attempt), `loadScript()` returns immediately WITHOUT waiting for the script to finish loading. `window.mammoth` and `window.pdfjsLib` are still undefined.

### Secondary Causes

1. **No global verification**: Code assumes global exists after `await loadScript()` without checking
2. **Poor error propagation**: PDF errors were swallowed, producing "undefined" message
3. **No retry mechanism**: Failed script loads were not retried

---

## Fix Applied

### New Vendor Loader (textExtractor.js)

```javascript
// Track loading state to prevent duplicate loads
const loadingPromises = {};

async function loadScript(src) {
    // If already loading, wait for that promise
    if (loadingPromises[src]) {
        return loadingPromises[src];
    }
    
    // If script tag exists and is loaded, return immediately
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript && existingScript.dataset.loaded === 'true') {
        return Promise.resolve();
    }
    
    // Create new loading promise
    loadingPromises[src] = new Promise((resolve, reject) => {
        // Remove any existing failed script
        if (existingScript) {
            existingScript.remove();
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
        };
        script.onerror = () => {
            delete loadingPromises[src];
            reject(new Error(`Failed to load vendor script: ${src}`));
        };
        document.head.appendChild(script);
    });
    
    return loadingPromises[src];
}
```

### Readiness Gates

```javascript
async function ensureMammothReady() {
    await loadScript(MAMMOTH_SRC);
    
    if (typeof window.mammoth === 'undefined') {
        throw new Error('Mammoth library failed to initialize');
    }
    if (typeof window.mammoth.convertToHtml !== 'function') {
        throw new Error('Mammoth library is corrupted');
    }
}

async function ensurePdfJsReady() {
    await loadScript(PDFJS_SRC);
    
    if (typeof window.pdfjsLib === 'undefined') {
        throw new Error('PDF.js library failed to initialize');
    }
    if (typeof window.pdfjsLib.getDocument !== 'function') {
        throw new Error('PDF.js library is corrupted');
    }
}
```

---

## TASK-035.2 Compliance Audit

| Requirement | Implemented? | Evidence |
|-------------|--------------|----------|
| R1 - Hard Newlines | Yes | textExtractor.js:244 - each line group → `\n` |
| R2 - Blank Line Cap | Yes | textExtractor.js:237-241 - cap at maxConsecutiveBlankLines=2 |
| R3 - Strict ↠ Gating | Yes | textExtractor.js:294-365 - 6 confidence gates |
| R4 - DOCX Style Fidelity | Partial | textExtractor.js:373 - HTML captured but not rendered |
| R5 - Heading Spacing | No | Not implemented |
| R6 - Rule Collision Prevention | Partial | R2 cap exists, but R5 not done |
| R7 - Per-format Strategy | Yes | Separate TXT/DOCX/PDF paths |
| O8 - ↠ Toggle | No | Not implemented |
| O10 - ALL-CAPS Heading Detection | No | Not implemented |
| O12 - Separate Extract Paths | Yes | extractFromText/PDF/Word functions |
| Rules Spec Created | Yes | docs/specs/FIDELITY_RENDERING_RULES_v1.1.md |

### Follow-up Tasks Needed

- [ ] TASK-035.4: Implement DOCX styled rendering in editor
- [ ] TASK-035.5: Implement heading spacing (R5)
- [ ] TASK-035.6: Implement ↠ toggle (O8)
- [ ] TASK-035.7: Implement ALL-CAPS heading detection (O10)

---

## Verification

### Tests Passing

- ✅ Smoke test: 11/11 checks pass
- ✅ Vendor files exist: mammoth.browser.min.js (642KB), pdf.min.js (320KB)
- ✅ Readiness gates verify globals before use

### Manual Verification Steps

1. Hard refresh (Ctrl+F5) on <http://localhost:8001>
2. Upload TXT file → Should succeed ✅
3. Upload DOCX file → Should succeed (check console for `[VENDOR] Mammoth ready`)
4. Upload PDF file → Should succeed (check console for `[VENDOR] PDF.js ready`)
