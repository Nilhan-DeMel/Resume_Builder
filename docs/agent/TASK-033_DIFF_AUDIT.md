# TASK-033: Format Drift Audit

## Purpose

Explain why the SAME CV content produces different ordering/structure when uploaded as TXT, DOCX, or PDF.

---

## Root Causes of Format Drift

### 1. PDF Extraction (pdf.js) Issues

| Issue | Explanation |
|-------|-------------|
| **Text item ordering** | pdf.js `getTextContent()` returns text items in **rendering order**, not reading order. Multi-column layouts or tables cause items to interleave unexpectedly. |
| **Space joining** | Current implementation joins all text items with a single space (`items.map(i => i.str).join(' ')`), collapsing logical line breaks into a single line. |
| **Page artifacts** | Headers/footers repeat on every page, causing section headings to appear multiple times or in unexpected positions. |
| **Missing newlines** | pdf.js does not inherently preserve paragraph breaks; we add `\n\n` per page but not per logical paragraph. |
| **Fonts without ToUnicode** | Some PDFs produce garbled characters if font encoding is incomplete. |

### 2. DOCX Extraction (mammoth.js) Issues

| Issue | Explanation |
|-------|-------------|
| **Paragraph-aware** | Mammoth extracts text paragraph-by-paragraph, preserving logical structure better than PDF. |
| **Tables as linear text** | Tables are flattened; cell order depends on document structure. |
| **Headers/footers excluded** | By default, mammoth ignores document headers/footers, which is generally good but can miss contact info placed there. |
| **Lists as plain lines** | Bullet/numbered lists lose visual markers (become plain text), though mammoth preserves some structure. |

### 3. TXT (Baseline)

| Issue | Explanation |
|-------|-------------|
| **Linear and verbatim** | TXT is the baseline; order is exactly as authored. |
| **No formatting metadata** | No bold/italic signals, so section detection relies purely on capitalization/patterns. |
| **User-controlled structure** | Most predictable but depends on user's original formatting. |

---

## Drift Manifestations

1. **Section ordering differs**: PDF may put "Skills" before "Experience" if multi-column layout is misread.
2. **Contact info position**: In DOCX, contact in header is lost; in PDF, it may merge into body text.
3. **Newline collapse**: PDF loses newlines; TXT preserves them; DOCX adds paragraph breaks.
4. **Bullet points**: TXT has `-` or `•`; DOCX has paragraph markers; PDF has visual glyphs that may not extract.

---

## What Can Be Fixed Deterministically vs. Requires AI

| Fix Type | Deterministic (Code) | Requires AI |
|----------|---------------------|-------------|
| Normalize bullets | ✅ Yes (regex) | No |
| Collapse multiple newlines | ✅ Yes (regex) | No |
| Remove page headers/footers | Partial (pattern match) | ✅ Better |
| Infer section order | Heuristic only | ✅ Yes |
| Resolve multi-column text | No | ✅ Yes |
| Correct garbled characters | No | Possibly |
| Map contact info fields | Regex + heuristic | ✅ Yes |
| Parse dates/roles | Regex + heuristic | ✅ Yes |

---

## Conclusion

**The core problem**: PDF extraction loses logical structure (newlines, columns), while DOCX preserves paragraph order but loses header/footer content. TXT is most predictable but depends on user formatting.

**The solution**: Use AI to "canonicalize" the extracted+normalized text into a consistent JSON structure that abstracts away source format differences. The AI can infer missing structure, handle ambiguity, and populate a Notes section for unmapped content.

---

## Phase 1 STOP GATE: ✅ Complete

This audit document satisfies the Phase 1 requirement. Proceeding to Phase 2: Define Canonical JSON Schema.
