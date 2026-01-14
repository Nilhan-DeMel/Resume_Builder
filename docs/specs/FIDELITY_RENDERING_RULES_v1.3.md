# Fidelity Rendering Rules v1.3

**Effective**: 2026-01-14  
**Status**: Authoritative

---

## Overview

This document defines ALL formatting rules for Fidelity Mode rendering across TXT, DOCX, and PDF formats.

---

## Core Rules

### R1: Hard Newlines (Line Preservation)

**ALL formats must preserve every original line break.**

- Never merge lines
- Never collapse whitespace across line boundaries
- Only normalize CRLF → LF

**Rationale**: Users uploaded THEIR formatting. We preserve it exactly.

---

### R2: Blank Line Cap

**Never more than 2 consecutive blank lines.**

- Cap runs of 3+ blank lines to exactly 2
- Applied AFTER all other spacing rules
- Prevents excessive vertical gaps

**Implementation**: `clampBlankLines()` in fidelitySpacing.js

---

### R3: ↠ Alignment Marker Semantics — v1.3 UPDATE

**Two detection cases:**

#### Case 1: RIGHT-ALIGNED LINE (prefix marker)

```
Condition: xMin > 55% page width AND ≤60 chars AND NOT paragraph
Output: "↠ <text>"
```

**Example**:

```
↠ Nilhan de Mel
↠ Colombo 6, Sri Lanka
↠ nilhan.dev@gmail.com
```

#### Case 2: MIXED LINE TAIL (segment marker)

```
Condition: Left cluster + gap (>20% page) + right cluster (≤50 chars) + pattern match
Output: "<left>  ↠ <right>"
```

**Example**:

```
Senior Software Engineer  ↠ 2020-2023
```

#### Anti-False-Positive Guards

- **isLikelyParagraph()**: Reject if >10 words OR ends with period + >5 words OR contains "the/and/or" + >6 words
- **Gate 1-6**: All confidence gates from v1.1 still apply for Case 2

**Thresholds**:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| centerThreshold | 55% page width | Catches right-aligned blocks |
| rightMarginThreshold | 70% page width | For tail segment detection |
| maxRightChunkLen | 50 chars | Dates/locations are short |
| minGapPct | 20% page width | Significant visual gap |

---

### R4: DOCX Style Fidelity

**DOCX uploads must render bold/italic/underline in styled view.**

- Use mammoth.js `convertToHtml()`
- Sanitize to allowed tags: `<b>, <strong>, <i>, <em>, <u>, <p>, <br>, <ul>, <ol>, <li>, <span>`
- Render in contenteditable div
- Maintain plain text fallback

**Implementation**: editorModes.js

---

### R5: Heading Spacing

**Standalone bold OR ALL-CAPS lines get 2 blank lines before.**

- Bold line (DOCX) → heading
- ALL-CAPS ≤40 chars (TXT/PDF) → heading
- Insert 2 blank lines before (if not at start)
- Subject to R2 cap (never 3+ blank lines)

**Implementation**: fidelitySpacing.js `applyHeadingSpacing()`

---

### R6: Rule Collision Prevention

R2 (blank line cap) takes precedence over R5 (heading spacing).

**Net effect**: Heading gets up to 2 blank lines, never 3+.

---

### R7: Per-Format Strategy

#### TXT Files

- Minimal normalization (CRLF → LF)
- R5 heading detection via ALL-CAPS
- No style rendering

#### DOCX Files

- Styled view (mammoth HTML) DEFAULT
- Plain view fallback (toggle)
- R5 heading detection via bold flag

#### PDF Files (v1.3 UPDATE)

- **Line preservation** via y-coordinate grouping
- **↠ detection** via xMin/xMax analysis (R3 v1.3)
- **Style capture** via fontName heuristics:
  - `isBold = /Bold|Black|Heavy/i.test(fontName)`
  - `isItalic = /Italic|Oblique/i.test(fontName)`
  - Stored per item, not yet rendered (future: optional styled view)
- **Blank line insertion** via median gap detection

---

## Optional Features

### O8: ↠ Toggle

- UI button: "↠ ON/OFF"
- Persisted in `localStorage.rb_show_alignment_markers`
- When OFF: strip markers from DISPLAY only (text unchanged)

### O10: ALL-CAPS Heading Detection

- Length ≤40 chars
- ≥3 letters, ≥80% uppercase
- Not a sentence (no period + space + text)
- Whitelist: SUMMARY, EXPERIENCE, EDUCATION, SKILLS, etc.

---

## Changelog

### v1.3 (2026-01-14) — TASK-035.5

- **R3 UPDATE**: Added RIGHT-ALIGNED LINE detection (xMin > 55%)
- **R3 UPDATE**: Added `isLikelyParagraph()` guard
- **R7 UPDATE**: Added PDF style capture via fontName
- Removed ATS panel constraint (editor now full width)

### v1.1 (2026-01-13) — TASK-035.2

- R3: Strict ↠ gating (6 confidence gates) for mixed lines
- R2: Median-based blank line density + cap
- R4: DOCX styled HTML extraction

### v1.0 (2026-01-13) — TASK-035.1

- R1: Strict line preservation
- Initial ↠ detection (buggy, replaced in v1.3)
