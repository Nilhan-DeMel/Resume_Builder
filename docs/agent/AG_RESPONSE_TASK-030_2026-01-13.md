# AG Response — TASK-030: Clarify Expected Flow After "Start Optimization"

**Date**: 2026-01-13
**Task**: TASK-030

---

## A) EXPECTED PROGRAM FLOW (Current Repo State)

### Step-by-Step Flow

| Step | Action | File/Function | What Happens |
|------|--------|---------------|--------------|
| 1 | User uploads CV | `uploadView.js` → `handleFileUpload()` | File validated, text extracted |
| 2 | Text stored | `fileHandler.js:33` | `cvState.setOriginalText(text)` → also sets `editedText` |
| 3 | User selects job level | `uploadView.js:88-90` | `cvState.setJobLevel(value)` |
| 4 | User clicks "Start Optimization" | `uploadView.js:174` | `navigateTo(VIEWS.EDITOR)` |
| 5 | Router renders Editor | `router.js:26-35` | Shows `data-view="editor"` div |
| 6 | **GAP** | NO `editorView.js` | Textarea shows hardcoded placeholder |
| 7 | User should edit CV | **NOT WIRED** | `cvState.editedText` not bound to textarea |
| 8 | User clicks "Optimize" | **NOT WIRED** | Should call `optimizeCV()` |
| 9 | Processing view | `optimizer.js:19` | Sets `VIEWS.PROCESSING`, calls Claude API |
| 10 | Output view | `optimizer.js:30` | `cvState.setOptimizedCV(result)` |
| 11 | Download | `pdfGenerator.js`, `docxGenerator.js` | **STUBS** — return raw Blobs |

### cvState Keys Used

| Key | Set By | Read By |
|-----|--------|---------|
| `originalText` | `fileHandler.js:33` | `optimizer.js:21` (via `editedText`) |
| `editedText` | `cvState.setOriginalText()` (auto-copies) | `optimizer.js:21` |
| `jobLevel` | `uploadView.js:81` | `optimizer.js:21` |
| `jobDescription` | `uploadView.js:120` | `optimizer.js:21` |
| `optimizedCV` | `optimizer.js:30` | Output view (not wired) |

---

## B) WHY IT'S BLANK TODAY — Root Cause

### Missing Files

| File | Status | Evidence |
|------|--------|----------|
| `src/js/views/editorView.js` | ❌ **MISSING** | `find_by_name` returned only `authView.js`, `uploadView.js` |
| `src/js/views/processingView.js` | ❌ **MISSING** | Not found |
| `src/js/views/outputView.js` | ❌ **MISSING** | Not found |
| `src/js/ai/optimizer.js` | ✅ EXISTS | Exports `optimizeCV()`, never imported by any view |

### Editor HTML (Exists but Static)

**File**: `src/index.html:105-127`

```html
<div data-view="editor" class="view hidden">
    <div class="container">
        <h1>Review & Edit</h1>
        <div class="editor-container">
            <div class="editor-main">
                <textarea class="editor-content" spellcheck="false">Editor content placeholder...</textarea>
            </div>
            ...
        </div>
    </div>
</div>
```

**Problem**: The `<textarea>` has hardcoded placeholder text. No JavaScript ever:

1. Reads `cvState.editedText`
2. Populates the textarea with CV content
3. Attaches change listeners to sync edits back to state

### main.js Initialization

**File**: `src/js/main.js:38-45`

```javascript
// Initialize all views
console.log('Step 2: Initializing views...');
initAuthView();
initUploadView();

console.log('  ✓ Auth view initialized');
console.log('  ✓ Upload view initialized');

// TODO: Initialize other views  ← THIS IS THE GAP
```

**No `initEditorView()` call exists.**

### Navigation Trigger

**File**: `src/js/views/uploadView.js:161-175`

```javascript
function handleProceed() {
    const snapshot = cvState.getSnapshot();

    if (!snapshot.originalText) {
        showToast('Please upload your CV first', 'error');
        return;
    }

    if (!snapshot.jobLevel) {
        showToast('Please select a job level', 'error');
        return;
    }

    navigateTo(VIEWS.EDITOR);  // ← Navigates to editor, but nothing binds state
}
```

---

## C) REAL vs DEMO: What Exists Already

| Component | Status | DEMO Integration? |
|-----------|--------|-------------------|
| **Text Extraction (.txt)** | ✅ REAL | Yes — works now |
| **Text Extraction (PDF/Word/Image)** | ⚠️ STUB | Partially — returns placeholder text |
| **Editor View** | ❌ MISSING JS | No — HTML exists, no behavior |
| **optimizeCV()** | ✅ COMPLETE | Yes — uses `callClaudeAPI()` which mocks in DEMO_MODE |
| **PDF Generator** | ⚠️ STUB | Partially — returns raw Blob |
| **DOCX Generator** | ⚠️ STUB | Partially — returns raw Blob |
| **Auth (Supabase)** | ✅ REAL + DEMO bypass | Yes — DEMO_MODE skips real auth |

### Can We Wire This Today?

| Feature | Wire Now? | What's Needed |
|---------|-----------|---------------|
| Editor shows CV text | ✅ YES | Create `editorView.js`, populate textarea from `cvState.editedText` |
| Optimize button | ✅ YES | Add button in HTML + call `optimizeCV()` |
| Processing view | ✅ YES | `optimizeCV()` already navigates to PROCESSING |
| Output view | ✅ YES | Create `outputView.js`, read `cvState.optimizedCV` |
| Real PDF/DOCX | ❌ NOT YET | Requires jsPDF, docx libraries |

---

## D) CHOICES WE NEED TO MAKE NOW

### 1. What does the Editor display initially?

- **Option A**: Raw extracted text in a single textarea ← **RECOMMENDED (fast)**
- Option B: Sectioned editor (Experience/Education/Skills blocks) ← Complex

### 2. What is editable?

- **Option A**: Whole CV text as one block ← **RECOMMENDED**
- Option B: Per-section blocks ← Requires parsing

### 3. When is optimization run?

- **Option A**: Button click from Editor ("Optimize Now") ← **RECOMMENDED**
- Option B: Auto-run on entering Processing view ← Risky UX

### 4. Where do we store edits?

- **Option A**: `cvState.editedText` (existing field) ← **RECOMMENDED**
- Option B: Overwrite `originalText` with versioning ← Overkill for MVP

### 5. What happens if extraction was stubbed (PDF/DOCX)?

- **Option A**: Allow editing placeholder + continue ← **RECOMMENDED (transparent)**
- Option B: Block with clear message ← Breaks DEMO flow

---

## E) IMMEDIATE NEXT STEPS (Recommended Path)

### Golden Path MVP

```
Upload (.txt) → Editor (editable textarea) → Processing (optimizeCV mock) → Output (optimized text + stub downloads)
```

### Files to Create/Modify

| File | Action | Key Functions |
|------|--------|---------------|
| `src/js/views/editorView.js` | **CREATE** | `initEditorView()`, bind textarea to `cvState.editedText`, add "Optimize" button |
| `src/js/views/outputView.js` | **CREATE** | `initOutputView()`, display `cvState.optimizedCV`, download buttons |
| `src/js/main.js` | **MODIFY** | Import + call `initEditorView()`, `initOutputView()` |
| `src/index.html` | **MODIFY** | Add `id="cv-textarea"`, add "Optimize Now" button in editor, add `id="optimized-text"` in output |

### Exact Wiring Steps

1. **Create `editorView.js`**:

   ```javascript
   export function initEditorView() {
       const textarea = document.querySelector('.editor-content');
       const optimizeBtn = document.querySelector('#optimize-btn');
       
       // Populate with CV text when view becomes visible
       appState.subscribe((state) => {
           if (state.currentView === VIEWS.EDITOR) {
               textarea.value = cvState.getSnapshot().editedText;
           }
       });
       
       // Sync edits back to state
       textarea.addEventListener('input', (e) => cvState.setEditedText(e.target.value));
       
       // Optimize button
       optimizeBtn?.addEventListener('click', async () => {
           const result = await optimizeCV();
           if (result.success) navigateTo(VIEWS.OUTPUT);
       });
   }
   ```

2. **Add in `main.js`**:

   ```javascript
   import { initEditorView } from './views/editorView.js';
   // In initApp():
   initEditorView();
   ```

3. **Update `index.html`** editor section:
   - Add `id="optimize-btn"` to a new button

---

## Summary

| Question | Answer |
|----------|--------|
| Why is Editor blank? | `editorView.js` doesn't exist → no JS binds `cvState.editedText` to textarea |
| Is `optimizeCV()` working? | Yes, but never called from UI |
| Can we wire it in DEMO? | Yes, `callClaudeAPI()` already mocks responses in DEMO_MODE |
| Recommended next step | Create `editorView.js` + wire "Optimize" button → unblocks entire flow |

---

**Awaiting user decision on Choices D1-D5 before implementation.**
