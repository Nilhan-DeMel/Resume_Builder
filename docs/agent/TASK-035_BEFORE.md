# TASK-035: Before State — Root Cause Analysis

## Problem Observed

- Same CV content renders differently for TXT vs DOCX vs PDF
- Incorrect categorization (e.g., dates parsed as phone numbers)
- "NOTES / UNCAPTURED" section adds confusion
- Section headers like `--- [ EXPERIENCE ] ---` are injected incorrectly

## Root Causes

### 1. Pipeline Flow (Current)

```
Upload → extractText() → normalizeCvText() → canonicalizeCv() → renderCanonicalToEditorText() → Editor
                            ↑                      ↑                         ↑
                      labeler.js           canonicalizer.js             renderer.js
                      (reorders)           (heuristic parsing)          (adds headers)
```

### 2. Specific Issues

| Issue | Source File | Function | Problem |
|-------|-------------|----------|---------|
| Date parsed as phone | `canonicalizer.js` | `heuristicParse()` | Regex `/(\+?\d[\d\s\-()]{8,}\d)/g` matches dates like "2020 - 2023" |
| Section headers injected | `renderer.js` | `formatSection()` | Adds `--- [ SECTION ] ---` to output |
| NOTES/UNCAPTURED appended | `renderer.js` | `renderCanonicalToEditorText()` | Always appends notes section |
| Content reordering | `canonicalizer.js` | `heuristicParse()` | Sections detected then re-grouped, breaking original order |
| Different bullet handling | `labeler.js` | `normalizeCvText()` | Converts bullets to `-`, collapses newlines |

### 3. Example of Bad Output (Canonical Mode)

```
----------------------------------------
--- [ CONTACT ] ---
----------------------------------------
Full Name: John Doe
Phone: 2020 - 2023          ← DATE MISREAD AS PHONE
Email: john@example.com

----------------------------------------
--- [ EXPERIENCE ] ---
----------------------------------------
...

----------------------------------------
--- [ NOTES / UNCAPTURED ] ---
----------------------------------------
Uncaptured Content:
- Random line that wasn't detected
```

## Solution

Implement "Fidelity Mode":

- Bypass canonicalizer and renderer entirely
- Show extracted text in EXACT order as extracted
- No headers, no notes, no categorization
- Minimal normalization (only prevent word-joining in PDFs)

## Phase 1 STOP GATE: ✅ Complete

Root causes identified. Proceeding to Phase 2.
