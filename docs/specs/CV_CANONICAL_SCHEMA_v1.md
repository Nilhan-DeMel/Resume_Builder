# CV Canonical Schema v1

## Overview

This document defines the canonical JSON structure for CV/Resume data. All extracted CV content (regardless of source format: TXT, DOCX, PDF) is mapped into this structure by the AI canonicalizer.

## Schema Version

**v1** (2026-01-13)

---

## JSON Structure

```json
{
  "meta": {
    "sourceFileName": "string",
    "sourceFileType": "string (txt|docx|pdf|other)",
    "extraction": {
      "method": "string (pdf.js|mammoth|text)",
      "warnings": ["string"],
      "confidence": 0.0
    },
    "canonicalVersion": "v1"
  },
  "contact": {
    "fullName": "string|null",
    "headline": "string|null",
    "email": ["string"],
    "phone": ["string"],
    "location": "string|null",
    "address": "string|null",
    "linkedin": "string|null",
    "website": ["string"],
    "otherLinks": ["string"]
  },
  "summary": {
    "about": "string|null",
    "targetRole": "string|null",
    "jobLevel": "string|null"
  },
  "experience": [
    {
      "jobTitle": "string|null",
      "company": "string|null",
      "location": "string|null",
      "employmentType": "string|null",
      "startDate": "string|null",
      "endDate": "string|null",
      "isCurrent": "boolean|null",
      "jobDescription": ["string"],
      "achievements": ["string"],
      "keywords": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string|null",
      "degree": "string|null",
      "fieldOfStudy": "string|null",
      "startDate": "string|null",
      "endDate": "string|null",
      "grade": "string|null",
      "notes": ["string"]
    }
  ],
  "skills": {
    "core": ["string"],
    "tools": ["string"],
    "soft": ["string"],
    "domains": ["string"],
    "all": ["string"]
  },
  "certifications": [
    {
      "name": "string|null",
      "issuer": "string|null",
      "issueDate": "string|null",
      "expiryDate": "string|null",
      "credentialId": "string|null",
      "url": "string|null"
    }
  ],
  "projects": [
    {
      "name": "string|null",
      "role": "string|null",
      "description": ["string"],
      "links": ["string"]
    }
  ],
  "publications": ["string"],
  "awards": ["string"],
  "volunteer": ["string"],
  "languages": ["string"],
  "organizations": ["string"],
  "recommendations": ["string"],
  "additional": {
    "interests": ["string"],
    "references": ["string"],
    "securityClearance": "string|null"
  },
  "notes": {
    "uncapturedContent": ["string"],
    "ambiguities": ["string"],
    "formattingIssues": ["string"],
    "aiSuggestions": ["string"]
  },
  "raw": {
    "normalizedText": "string",
    "labeledTextPreview": "string"
  }
}
```

---

## Field Descriptions

### meta

- **sourceFileName**: Original uploaded file name
- **sourceFileType**: File extension/type
- **extraction.method**: Library used for extraction
- **extraction.warnings**: Any issues during extraction
- **extraction.confidence**: 0.0-1.0 score of extraction quality
- **canonicalVersion**: Schema version for compatibility

### contact

Core identity and contact information. Arrays for fields that can have multiple values (emails, phones, websites).

### summary

Professional summary, objective, or "about" section. Also captures target role and job level if specified.

### experience

Array of work history entries as **ordered** list (most recent first).

### education

Array of educational qualifications, ordered by date.

### skills

Categorized skills. The `all` field is a flat list of all skills for quick access.

### certifications, projects, publications, awards, volunteer, languages, organizations

Standard resume sections. Each is optional but structured.

### notes

**Critical for robustness**:

- **uncapturedContent**: Text that couldn't be confidently mapped to a field
- **ambiguities**: Entries where data was unclear (e.g., "2020" without month)
- **formattingIssues**: Problems detected during extraction (e.g., multi-column mess)
- **aiSuggestions**: Recommendations from AI for improving the CV

### raw

Preserved original text for reference and editing.

---

## Exception Handling Rules

1. **Unstructured CV**: Populate what's detectable; dump remainder into `notes.uncapturedContent`.
2. **Ambiguous dates**: Store as-is (string) and add note to `notes.ambiguities`.
3. **Multi-column/table issues**: Best-effort extraction + add to `notes.formattingIssues`.
4. **Missing fields**: Set to `null`; do not hallucinate.
5. **Always preserve**: `raw.normalizedText` must contain the full normalized input.

---

## Phase 2 STOP GATE: ✅ Complete

This schema document satisfies the Phase 2 requirement. Proceeding to Phase 3: Implement AI Canonicalizer.
