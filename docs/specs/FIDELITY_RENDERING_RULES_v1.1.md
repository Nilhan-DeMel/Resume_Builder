# Fidelity Rendering Rules v1.1

## Purpose

This document specifies the rules for rendering CV/Resume text in "Fidelity Mode" — preserving the original document structure without AI restructuring.

## Definitions

| Term | Definition |
|------|------------|
| **Line** | A sequence of characters terminated by `\n` |
| **Blank Line** | A line containing only whitespace |
| **Blank Line Run** | Consecutive blank lines |
| **Heading** | A standalone bold line (DOCX) or short ALL-CAPS line (PDF/TXT) |
| **Right-aligned Chunk** | Text positioned near the right margin on the same visual line as left-aligned text |
| **↠ Marker** | Visual indicator that following text was right-aligned in source |

---

## Core Rules

### R1 — Hard Newlines (No Line Merging)

- Every detected source line boundary becomes a hard `\n` in output.
- NEVER join text across newline boundaries.
- UI may visually wrap long lines, but underlying text remains one logical line.

### R2 — Blank Line Preservation with Cap

| Source Blank Lines | Output Blank Lines |
|-------------------|-------------------|
| 0 | 0 |
| 1 | 1 |
| 2+ | 2 (capped) |

**CRITICAL**: No combination of rules may produce more than 2 consecutive blank lines.

### R3 — ↠ Marker Semantics (STRICT)

The ↠ marker means: "This text was right-aligned on the same visual line."

**MUST emit ↠ ONLY when ALL conditions are met:**

1. Line has a left cluster starting near left margin (x < 15% page width)
2. Line has a right cluster near right margin (x > 70% page width)
3. Significant horizontal gap between clusters (gap > 100px or 20% page width)
4. Right cluster is SHORT (≤ 50 chars)
5. Right cluster matches common patterns:
   - Location: contains comma, city/country words
   - Date: contains digits + dash/month/year
   - Contact: email/phone/link format
6. Right cluster does NOT start with lowercase letter (except email)
7. Right cluster is NOT a sentence continuation (no preceding comma/conjunction)

**MUST NEVER emit ↠:**

- Inside normal paragraph text
- For text that continues from previous sentence
- When confidence is below threshold

**Correct Examples:**

```
Nilhan de Mel  ↠ Colombo, Sri Lanka
Senior Developer  ↠ 2020 - Present
```

**Incorrect Examples (MUST NEVER HAPPEN):**

```
↠ This has helped me to be…
↠ the American (US)…
```

### R4 — Style Fidelity (DOCX)

| Style | Rendering |
|-------|-----------|
| Bold | `<strong>` or `<b>` |
| Italic | `<em>` or `<i>` |
| Underline | `<u>` |

**PDF/TXT**: No style rendering (plain text only).

### R5 — Heading Spacing Rule

Headings get:

- 2 blank lines BEFORE (unless start of document)
- 1 blank line AFTER

**Heading Detection:**

- DOCX: Standalone line where all runs are bold
- PDF/TXT: Short ALL-CAPS line (≤30 chars) OR ends with `:` and is short

**IMPORTANT**: Obey R2 cap — never exceed 2 consecutive blank lines.

### R6 — Rule Collision Prevention

When R2 and R5 both request spacing at same boundary:

- Clamp total to max 2 blank lines
- R2 cap takes precedence

### R7 — Per-Format Strategy

| Format | Strategy |
|--------|----------|
| TXT | Exact as-is, CRLF→LF only, preserve blank lines, NO ↠ |
| DOCX | Preserve paragraphs + runs + style, minimal normalization, ↠ only with confident tab detection |
| PDF | Preserve line order, ↠ with strict detection, spacing via y-gap mapping |

---

## Configuration Thresholds

```json
{
  "pdf": {
    "yLineThreshold": 3,
    "blankLineGapMultiplier": {
      "small": 1.5,
      "large": 3.0
    },
    "rightMarginThreshold": 0.70,
    "leftMarginThreshold": 0.15,
    "minGapForArrow": 0.20,
    "maxRightChunkLength": 50
  },
  "general": {
    "maxConsecutiveBlankLines": 2,
    "headingMaxLength": 30
  }
}
```

---

## Options

### O8 — Toggle Alignment Markers (↠)

- UI toggle: "Show alignment markers (↠)"
- When OFF: remove ↠ markers from display (keep line breaks)
- Persist in localStorage: `rb_show_alignment_markers`

### O10 — ALL-CAPS Heading Detection

- Treat short ALL-CAPS lines (≤30 chars) as headings
- Apply R5 spacing rules

### O12 — Separate Extract/Render Paths

- TXT, DOCX, PDF have distinct extraction logic
- Unified output contract: lines + optional style spans

---

## Version History

- v1.0 (TASK-035): Initial fidelity mode
- v1.1 (TASK-035.2): Strict ↠ gating, blank line capping, DOCX styles, heading spacing
