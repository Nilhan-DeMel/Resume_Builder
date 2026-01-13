/**
 * CV Canonicalizer
 * Purpose: Convert normalized CV text into canonical JSON structure
 * Uses AI when available; falls back to heuristic parsing in DEMO mode
 */

import { DEMO_MODE } from '../config/demo.js';
import { callClaudeAPI } from './apiClient.js';

/**
 * Create empty canonical JSON structure
 */
function createEmptyCanonical() {
    return {
        meta: {
            sourceFileName: '',
            sourceFileType: '',
            extraction: { method: '', warnings: [], confidence: 0.0 },
            canonicalVersion: 'v1'
        },
        contact: {
            fullName: null,
            headline: null,
            email: [],
            phone: [],
            location: null,
            address: null,
            linkedin: null,
            website: [],
            otherLinks: []
        },
        summary: { about: null, targetRole: null, jobLevel: null },
        experience: [],
        education: [],
        skills: { core: [], tools: [], soft: [], domains: [], all: [] },
        certifications: [],
        projects: [],
        publications: [],
        awards: [],
        volunteer: [],
        languages: [],
        organizations: [],
        recommendations: [],
        additional: { interests: [], references: [], securityClearance: null },
        notes: { uncapturedContent: [], ambiguities: [], formattingIssues: [], aiSuggestions: [] },
        raw: { normalizedText: '', labeledTextPreview: '' }
    };
}

/**
 * Heuristic parser for DEMO mode (no AI)
 * Extracts basic fields using regex patterns
 */
function heuristicParse(normalizedText, fileMeta) {
    const canonical = createEmptyCanonical();
    const lines = normalizedText.split('\n');

    // Meta
    canonical.meta.sourceFileName = fileMeta?.fileName || 'unknown';
    canonical.meta.sourceFileType = fileMeta?.fileType || 'unknown';
    canonical.meta.extraction.method = fileMeta?.method || 'heuristic';
    canonical.meta.extraction.confidence = 0.5;

    // Contact detection
    const emailMatch = normalizedText.match(/[\w.-]+@[\w.-]+\.\w+/g);
    if (emailMatch) canonical.contact.email = emailMatch;

    const phoneMatch = normalizedText.match(/(\+?\d[\d\s\-()]{8,}\d)/g);
    if (phoneMatch) canonical.contact.phone = phoneMatch.map(p => p.trim());

    const linkedinMatch = normalizedText.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) canonical.contact.linkedin = linkedinMatch[0];

    // Name heuristic: first non-empty line that's not email/phone
    for (const line of lines.slice(0, 5)) {
        if (line && !line.includes('@') && !line.match(/^\+?\d/) && line.length > 2 && line.length < 60) {
            canonical.contact.fullName = line;
            break;
        }
    }

    // Section detection
    const sections = {
        summary: [],
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: []
    };

    let currentSection = null;
    const SECTION_MAP = {
        'summary': /^(summary|profile|about|objective)/i,
        'experience': /^(experience|work|employment|career)/i,
        'education': /^(education|academic|qualifications)/i,
        'skills': /^(skills|technical|competencies|technologies)/i,
        'certifications': /^(certifications|certificates|licenses)/i,
        'projects': /^(projects|portfolio)/i
    };

    for (const line of lines) {
        const trimmed = line.trim();

        // Check for section header
        let foundSection = null;
        for (const [key, regex] of Object.entries(SECTION_MAP)) {
            if (regex.test(trimmed)) {
                foundSection = key;
                break;
            }
        }

        if (foundSection) {
            currentSection = foundSection;
        } else if (currentSection && trimmed) {
            sections[currentSection].push(trimmed);
        }
    }

    // Map sections to canonical
    if (sections.summary.length) {
        canonical.summary.about = sections.summary.join(' ');
    }

    if (sections.skills.length) {
        canonical.skills.all = sections.skills.flatMap(s =>
            s.split(/[,;]/).map(sk => sk.trim()).filter(Boolean)
        );
    }

    // Experience parsing (simplified)
    let currentExp = null;
    for (const line of sections.experience) {
        const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4}|present)/i);
        if (dateMatch || line.match(/^[A-Z]/)) {
            if (currentExp) canonical.experience.push(currentExp);
            currentExp = {
                jobTitle: null,
                company: null,
                location: null,
                employmentType: null,
                startDate: dateMatch ? dateMatch[1] : null,
                endDate: dateMatch ? dateMatch[2] : null,
                isCurrent: dateMatch?.[2]?.toLowerCase() === 'present',
                jobDescription: [],
                achievements: [],
                keywords: []
            };
            if (!dateMatch) currentExp.jobTitle = line;
        } else if (currentExp && line.startsWith('-')) {
            currentExp.jobDescription.push(line.replace(/^-\s*/, ''));
        }
    }
    if (currentExp) canonical.experience.push(currentExp);

    // Education parsing (simplified)
    for (const line of sections.education) {
        if (line.match(/\d{4}/) || line.match(/(university|college|school)/i)) {
            canonical.education.push({
                institution: line.match(/(university|college|school).*/i)?.[0] || null,
                degree: line.match(/(B\.?S\.?|M\.?S\.?|Ph\.?D|Bachelor|Master)/i)?.[0] || null,
                fieldOfStudy: null,
                startDate: null,
                endDate: line.match(/(\d{4})/)?.[1] || null,
                grade: null,
                notes: []
            });
        }
    }

    // Uncaptured content: lines not in detected sections
    const capturedLines = new Set([
        ...sections.summary,
        ...sections.experience,
        ...sections.education,
        ...sections.skills,
        ...sections.certifications,
        ...sections.projects
    ]);

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !capturedLines.has(trimmed) && trimmed.length > 3) {
            // Skip section headers
            let isHeader = false;
            for (const regex of Object.values(SECTION_MAP)) {
                if (regex.test(trimmed)) { isHeader = true; break; }
            }
            if (!isHeader && canonical.notes.uncapturedContent.length < 20) {
                canonical.notes.uncapturedContent.push(trimmed);
            }
        }
    }

    canonical.raw.normalizedText = normalizedText;
    canonical.raw.labeledTextPreview = normalizedText.substring(0, 500);

    return canonical;
}

/**
 * Build AI prompt for canonicalization
 */
function buildCanonicalPrompt(normalizedText, jobLevel, jobDescription) {
    return `You are a CV/Resume parser. Convert the following CV text into a structured JSON object.

RULES:
1. Return ONLY valid JSON (no markdown, no explanation)
2. Use null for unknown fields, not empty strings
3. Put any text you cannot confidently place into notes.uncapturedContent
4. Do not hallucinate information
5. Preserve original content exactly (do not rewrite)
6. Dates should be strings in original format

TARGET SCHEMA (v1):
{
  "contact": { "fullName", "headline", "email": [], "phone": [], "location", "linkedin", "website": [] },
  "summary": { "about", "targetRole", "jobLevel" },
  "experience": [{ "jobTitle", "company", "location", "startDate", "endDate", "isCurrent", "jobDescription": [], "achievements": [] }],
  "education": [{ "institution", "degree", "fieldOfStudy", "endDate", "notes": [] }],
  "skills": { "core": [], "tools": [], "soft": [], "all": [] },
  "certifications": [{ "name", "issuer", "issueDate" }],
  "projects": [{ "name", "description": [] }],
  "notes": { "uncapturedContent": [], "ambiguities": [] }
}

${jobLevel ? `Target Job Level: ${jobLevel}` : ''}
${jobDescription ? `Job Description:\n${jobDescription.substring(0, 500)}` : ''}

CV TEXT:
${normalizedText}

JSON:`;
}

/**
 * Main canonicalizer function
 * @param {Object} params - { normalizedText, jobLevel, jobDescription, fileMeta }
 * @returns {Promise<Object>} { canonicalJson, notes, confidence }
 */
export async function canonicalizeCv({ normalizedText, jobLevel, jobDescription, fileMeta }) {
    console.log(`[TRACE:${window.TRACE_ID}] CANONICALIZER_START chars=${normalizedText?.length} demo=${DEMO_MODE}`);

    if (!normalizedText || normalizedText.trim().length < 50) {
        console.warn('[Canonicalizer] Text too short for meaningful parsing');
        return {
            canonicalJson: createEmptyCanonical(),
            notes: ['Text too short'],
            confidence: 0
        };
    }

    // Both modes use heuristic parser for now
    // Real AI mode will be enabled when DEMO_MODE = false and API key is set
    let canonicalJson;
    let confidence = 0.5;

    if (DEMO_MODE) {
        // DEMO mode: use heuristic parser
        canonicalJson = heuristicParse(normalizedText, fileMeta);
        console.log(`[TRACE:${window.TRACE_ID}] CANONICALIZER_HEURISTIC sections=${Object.keys(canonicalJson).length}`);
    } else {
        // Real mode: try AI, fall back to heuristic
        try {
            const prompt = buildCanonicalPrompt(normalizedText, jobLevel, jobDescription);
            const response = await callClaudeAPI(prompt, { maxTokens: 4000 });

            // Parse AI response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                canonicalJson = JSON.parse(jsonMatch[0]);
                canonicalJson.raw = { normalizedText, labeledTextPreview: normalizedText.substring(0, 500) };
                canonicalJson.meta = {
                    ...canonicalJson.meta,
                    sourceFileName: fileMeta?.fileName || '',
                    sourceFileType: fileMeta?.fileType || '',
                    extraction: { method: 'ai', warnings: [], confidence: 0.9 },
                    canonicalVersion: 'v1'
                };
                confidence = 0.9;
                console.log(`[TRACE:${window.TRACE_ID}] CANONICALIZER_AI_OK`);
            } else {
                throw new Error('AI response not valid JSON');
            }
        } catch (err) {
            console.warn('[Canonicalizer] AI failed, using heuristic:', err);
            canonicalJson = heuristicParse(normalizedText, fileMeta);
            canonicalJson.notes.aiSuggestions.push(`AI parsing failed: ${err.message}`);
        }
    }

    console.log(`[TRACE:${window.TRACE_ID}] CANONICALIZER_DONE confidence=${confidence}`);

    return {
        canonicalJson,
        notes: canonicalJson.notes,
        confidence
    };
}
