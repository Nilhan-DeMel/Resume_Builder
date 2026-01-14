/**
 * Fidelity Mode Processor
 * Purpose: Render CV text in exact extraction order without restructuring
 * 
 * TASK-035: This module bypasses all AI/canonicalization/labeling.
 * TASK-035.4: Added R5 heading spacing + O10 ALL-CAPS detection
 */

import { processTextWithSpacing, clampBlankLines } from './fidelitySpacing.js';

/**
 * Minimal normalization for fidelity mode
 * STRICT: Only standardizes line endings, preserves ALL newlines and blank lines
 * @param {string} text - Raw extracted text
 * @returns {string} Minimally normalized text
 */
export function normalizeMinimal(text) {
    if (!text) return '';

    // STRICT: Only normalize CRLF to LF, preserve everything else
    // Do NOT collapse newlines, do NOT trim lines
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
}

/**
 * Build reading-order text from PDF text items
 * Sorts by: page → y (top to bottom) → x (left to right)
 * @param {Array} pdfItems - Array of {str, x, y, page} items
 * @returns {string} Text in reading order
 */
export function buildPdfReadingOrderText(pdfItems) {
    if (!pdfItems || !pdfItems.length) return '';

    // Sort by page, then y descending (top first), then x ascending (left first)
    const sorted = [...pdfItems].sort((a, b) => {
        // Page first
        if (a.page !== b.page) return a.page - b.page;
        // Y coordinate (higher y = lower on page in PDF coords, so we want descending y for top-to-bottom)
        // Actually in PDF, y=0 is bottom, so higher y is top. Sort descending.
        const yDiff = b.y - a.y;
        if (Math.abs(yDiff) > 5) return yDiff; // 5-unit threshold for "same line"
        // Same line: sort by x (left to right)
        return a.x - b.x;
    });

    // Group into lines based on y-threshold
    const lines = [];
    let currentLine = [];
    let lastY = null;
    const Y_THRESHOLD = 5; // Units to consider "same line"

    for (const item of sorted) {
        if (lastY !== null && Math.abs(item.y - lastY) > Y_THRESHOLD) {
            // New line
            if (currentLine.length) {
                lines.push(currentLine);
            }
            currentLine = [];
        }
        currentLine.push(item);
        lastY = item.y;
    }
    if (currentLine.length) {
        lines.push(currentLine);
    }

    // Join items within lines with smart spacing
    const textLines = lines.map(line => {
        let result = '';
        for (let i = 0; i < line.length; i++) {
            const token = line[i].str;
            if (i > 0) {
                const prev = line[i - 1].str;
                // Add space if previous ends with alphanumeric and current starts with alphanumeric
                const prevEndsAlpha = /[A-Za-z0-9]$/.test(prev);
                const currStartsAlpha = /^[A-Za-z0-9]/.test(token);
                if (prevEndsAlpha && currStartsAlpha) {
                    result += ' ';
                }
            }
            result += token;
        }
        return result;
    });

    return textLines.join('\n');
}

/**
 * Convert extracted content to fidelity text
 * TASK-035.4: Now applies R5 heading spacing + O10 ALL-CAPS
 * 
 * @param {Object} params - { fileType, extractedText, pdfItems }
 * @returns {string} Fidelity text (exact order, no structuring)
 */
export function toFidelityText({ fileType, extractedText, pdfItems }) {
    let text;

    // For PDF with items array, use reading order builder
    if (pdfItems && pdfItems.length) {
        text = buildPdfReadingOrderText(pdfItems);
    } else {
        // For TXT/DOCX, use minimal normalization
        text = normalizeMinimal(extractedText);
    }

    // R5 + O10: Apply heading spacing (detects ALL-CAPS headings for TXT)
    text = processTextWithSpacing(text);

    // R2: Final clamp to ensure no 3+ blank lines
    text = clampBlankLines(text);

    return text;
}
