/**
 * Fidelity Spacing Engine
 * Purpose: R5 compliance - heading spacing with R2 clamp
 * 
 * TASK-035.4: Centralizes blank-line insertion logic
 */

/**
 * Configuration for spacing rules
 */
const SPACING_CONFIG = {
    maxConsecutiveBlankLines: 2,
    headingMaxLength: 40,
    headingBlankLinesBefore: 2,
    headingBlankLinesAfter: 1
};

/**
 * Detect if a line is a heading
 * R5: Bold standalone OR O10: ALL-CAPS short line
 * 
 * @param {string} line - Text line
 * @param {Object} options - { isBold: boolean }
 * @returns {boolean}
 */
export function isHeading(line, options = {}) {
    if (!line || typeof line !== 'string') return false;

    const trimmed = line.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > SPACING_CONFIG.headingMaxLength) return false;

    // R5: If marked as bold, it's a heading
    if (options.isBold) return true;

    // O10: ALL-CAPS detection for TXT/PDF
    return isAllCapsHeading(trimmed);
}

/**
 * O10: Detect ALL-CAPS heading
 * Heuristic:
 * - Length <= 40
 * - Contains at least 3 letters
 * - Letters are mostly A-Z (allow punctuation like ":")
 * - Not a full sentence (no periods followed by lowercase)
 * 
 * @param {string} line - Trimmed text line
 * @returns {boolean}
 */
export function isAllCapsHeading(line) {
    if (!line || line.length > SPACING_CONFIG.headingMaxLength) return false;

    // Must have at least 3 letters
    const letters = line.match(/[A-Za-z]/g);
    if (!letters || letters.length < 3) return false;

    // Check if mostly uppercase
    const upperCount = letters.filter(c => c === c.toUpperCase()).length;
    const lowerCount = letters.filter(c => c === c.toLowerCase()).length;

    // More than 80% uppercase
    if (upperCount / letters.length < 0.8) return false;

    // Not a sentence (no period followed by space and text)
    if (/\.\s+\S/.test(line)) return false;

    // Known heading patterns (optional whitelist boost)
    const knownHeadings = [
        'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS',
        'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'CERTIFICATIONS',
        'AWARDS', 'PUBLICATIONS', 'LANGUAGES', 'INTERESTS', 'REFERENCES',
        'OBJECTIVE', 'PROFILE', 'ABOUT ME', 'CONTACT', 'ACHIEVEMENTS'
    ];

    // Exact match or close match with colon
    const normalized = line.replace(/[:\s]+$/, '').toUpperCase();
    if (knownHeadings.includes(normalized)) return true;

    // General all-caps short line
    return upperCount >= 3 && lowerCount <= 1;
}

/**
 * Apply heading spacing to lines
 * R5 + R2: Insert blank lines around headings, clamp to max 2
 * 
 * @param {string[]} lines - Array of text lines
 * @param {Object[]} lineMetadata - Optional metadata per line { isBold }
 * @returns {string[]} Lines with heading spacing applied
 */
export function applyHeadingSpacing(lines, lineMetadata = []) {
    if (!lines || !lines.length) return lines;

    const result = [];
    let consecutiveBlankLines = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const meta = lineMetadata[i] || {};
        const isBlank = !line || line.trim() === '';

        if (isBlank) {
            // Track blank lines, respect R2 cap
            if (consecutiveBlankLines < SPACING_CONFIG.maxConsecutiveBlankLines) {
                result.push(line);
                consecutiveBlankLines++;
            }
            continue;
        }

        // Check if this is a heading
        const isHead = isHeading(line, meta);

        if (isHead) {
            // R5: Ensure 2 blank lines before heading (if not at start)
            if (result.length > 0) {
                // Count existing trailing blank lines in result
                let trailingBlanks = 0;
                for (let j = result.length - 1; j >= 0 && result[j].trim() === ''; j--) {
                    trailingBlanks++;
                }

                // Add blank lines up to 2
                const needed = SPACING_CONFIG.headingBlankLinesBefore - trailingBlanks;
                for (let j = 0; j < needed && trailingBlanks + j < SPACING_CONFIG.maxConsecutiveBlankLines; j++) {
                    result.push('');
                }
            }
        }

        // Add the actual line
        result.push(line);
        consecutiveBlankLines = 0;

        // R5: After heading, we want 1 blank line (handled naturally by next content)
        // Don't force it here to avoid over-spacing
    }

    return result;
}

/**
 * Process text through spacing engine
 * @param {string} text - Raw text with \n line breaks
 * @returns {string} Text with heading spacing applied
 */
export function processTextWithSpacing(text) {
    if (!text) return '';

    const lines = text.split('\n');
    const spaced = applyHeadingSpacing(lines);
    return spaced.join('\n');
}

/**
 * Clamp consecutive blank lines in text
 * R2: Never more than 2 consecutive blank lines
 * 
 * @param {string} text - Text to clamp
 * @returns {string} Clamped text
 */
export function clampBlankLines(text) {
    if (!text) return '';

    // Replace 3+ consecutive newlines with 2
    return text.replace(/\n{3,}/g, '\n\n');
}
