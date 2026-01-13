/**
 * CV Labeler
 * Purpose: Normalize and auto-label CV text for Editor/AI
 */

/**
 * Clean and normalize raw CV text
 * @param {string} rawText - Extracted text
 * @returns {string} Normalized text
 */
export function normalizeCvText(rawText) {
    if (!rawText) return '';

    return rawText
        // Remove page artifacts
        .replace(/^Page \d+ of \d+$/gm, '')
        .replace(/^[ \t]*$/gm, '') // Empty lines
        // Normalize bullet points
        .replace(/[•●▪]/g, '-')
        // Normalize newlines (max 2 consecutive)
        .replace(/\n{3,}/g, '\n\n')
        // Trim whitespace
        .split('\n').map(line => line.trim()).join('\n')
        .trim();
}

/**
 * Auto-label CV sections
 * @param {string} normalizedText - Cleaned text
 * @returns {Object} { labeledText, structure, confidence }
 */
export function labelCvText(normalizedText) {
    const lines = normalizedText.split('\n');
    let labeledLines = [];
    let currentSection = null;
    let structure = {
        contact: [],
        sections: {}
    };

    // Heuristics
    const SECTION_PATTERNS = {
        CONTACT: /^(contact|personal info|details)$/i,
        EXPERIENCE: /^(experience|work history|employment|career)$/i,
        EDUCATION: /^(education|academic background|qualifications)$/i,
        SKILLS: /^(skills|technical skills|competencies|technologies)$/i,
        PROJECTS: /^(projects|portfolio)$/i,
        SUMMARY: /^(summary|profile|about|objective)$/i,
        CERTIFICATIONS: /^(certifications|certificates|courses)$/i,
        LANGUAGES: /^(languages)$/i
    };

    // Prepend Contact section if heuristically detected at top
    let inContactHeader = true;

    lines.forEach((line, index) => {
        const lowerLine = line.toLowerCase();

        // Check for Section Header
        let foundSection = null;
        for (const [key, regex] of Object.entries(SECTION_PATTERNS)) {
            if (regex.test(lowerLine) || (line.toUpperCase() === line && line.length > 3 && regex.test(lowerLine))) {
                foundSection = key;
                break;
            }
        }

        if (foundSection) {
            inContactHeader = false;
            currentSection = foundSection;
            labeledLines.push(`\n[${foundSection}]`);
            structure.sections[foundSection] = structure.sections[foundSection] || [];
        } else if (inContactHeader && index < 10) {
            // Heuristic: Top 10 lines likely contact info if not a section
            if (!currentSection) {
                // Check if it looks like contact info
                if (line.match(/@/) || line.match(/http/) || line.match(/\d{3,}/)) {
                    if (labeledLines.indexOf('[CONTACT]') === -1) labeledLines.push('[CONTACT]');
                    currentSection = 'CONTACT';
                }
            }
            if (currentSection === 'CONTACT') {
                labeledLines.push(line);
                structure.contact.push(line);
                return;
            }
        }

        // Regular line processing
        if (!foundSection) {
            labeledLines.push(line);
            if (currentSection && structure.sections[currentSection]) {
                structure.sections[currentSection].push(line);
            }
        }
    });

    const labeledText = labeledLines.join('\n').trim();

    // Simple confidence check
    const sectionCount = Object.keys(structure.sections).length;
    let confidence = 'high';
    let warnings = [];

    if (sectionCount < 3) {
        confidence = 'low';
        warnings.push('Few sections detected. Review headings.');
        return {
            labeledText: `(${warnings[0]})\n\n${labeledText}`,
            structure,
            confidence,
            warnings
        };
    }

    return {
        labeledText,
        structure,
        confidence: 'high',
        warnings: []
    };
}
