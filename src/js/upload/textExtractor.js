import { FILE_TYPES } from '../utils/constants.js';

// Vendor script paths (relative to server root)
const PDFJS_SRC = '/vendor/pdfjs/pdf.min.js';
const PDFJS_WORKER_SRC = '/vendor/pdfjs/pdf.worker.min.js';
const MAMMOTH_SRC = '/vendor/mammoth/mammoth.browser.min.js';

// Track loading state to prevent duplicate loads
const loadingPromises = {};

/**
 * Load a script and wait for it to be ready
 * @param {string} src - Script path
 * @returns {Promise<void>}
 */
async function loadScript(src) {
    // If already loading, wait for that promise
    if (loadingPromises[src]) {
        return loadingPromises[src];
    }

    // If script tag exists and is loaded, return immediately
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript && existingScript.dataset.loaded === 'true') {
        return Promise.resolve();
    }

    // Create new loading promise
    loadingPromises[src] = new Promise((resolve, reject) => {
        // Remove any existing failed script
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            script.dataset.loaded = 'true';
            console.log(`[VENDOR] Loaded: ${src}`);
            resolve();
        };
        script.onerror = () => {
            delete loadingPromises[src];
            reject(new Error(`Failed to load vendor script: ${src}`));
        };
        document.head.appendChild(script);
    });

    return loadingPromises[src];
}

/**
 * Ensure mammoth.js is ready for use
 * @returns {Promise<void>}
 * @throws {Error} if mammoth fails to load or is missing expected functions
 */
async function ensureMammothReady() {
    await loadScript(MAMMOTH_SRC);

    // Verify global exists
    if (typeof window.mammoth === 'undefined') {
        throw new Error('Mammoth library failed to initialize (window.mammoth is undefined)');
    }

    // Verify required functions exist
    if (typeof window.mammoth.convertToHtml !== 'function') {
        throw new Error('Mammoth library is corrupted (convertToHtml not found)');
    }
    if (typeof window.mammoth.extractRawText !== 'function') {
        throw new Error('Mammoth library is corrupted (extractRawText not found)');
    }

    console.log('[VENDOR] Mammoth ready:', typeof window.mammoth);
}

/**
 * Ensure pdf.js is ready for use
 * @returns {Promise<void>}
 * @throws {Error} if pdf.js fails to load or is missing expected functions
 */
async function ensurePdfJsReady() {
    await loadScript(PDFJS_SRC);

    // Verify global exists
    if (typeof window.pdfjsLib === 'undefined') {
        throw new Error('PDF.js library failed to initialize (window.pdfjsLib is undefined)');
    }

    // Verify required functions exist
    if (typeof window.pdfjsLib.getDocument !== 'function') {
        throw new Error('PDF.js library is corrupted (getDocument not found)');
    }

    // Set worker path
    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
    }

    console.log('[VENDOR] PDF.js ready:', typeof window.pdfjsLib);
}

/**
 * Extract text from file based on type
 * @param {File} file - File to extract from
 * @returns {Promise<string>} Extracted text
 */
export async function extractText(file) {
    const fileType = file.type;

    try {
        if (fileType === FILE_TYPES.TEXT) {
            return await extractFromText(file);
        } else if (fileType === FILE_TYPES.PDF) {
            return await extractFromPDF(file);
        } else if ([FILE_TYPES.WORD, FILE_TYPES.WORD_LEGACY].includes(fileType)) {
            return await extractFromWord(file);
        } else if (file.name.endsWith('.docx')) {
            // Fallback for mime type issues
            return await extractFromWord(file);
        }

        // Basic fallback for unknown types that might be text
        try {
            const text = await file.text();
            // Basic heuristic: if it has too many null bytes, it's binary
            if (text.includes('\0')) throw new Error('Binary file');
            return text;
        } catch {
            throw new Error('Unsupported file type');
        }

    } catch (err) {
        console.error('Extraction failed:', err);
        throw new Error(`Failed to read file: ${err.message}`);
    }
}

async function extractFromText(file) {
    return await file.text();
}

async function extractFromPDF(file) {
    // Use readiness gate to ensure pdf.js is properly loaded
    await ensurePdfJsReady();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // ===== FIDELITY RULES v1.1 CONFIGURATION =====
    const CONFIG = {
        yLineThreshold: 3,
        rightMarginPct: 0.70,
        leftMarginPct: 0.15,
        minGapPct: 0.20,
        maxRightChunkLen: 50,
        maxConsecutiveBlankLines: 2
    };

    const allLines = [];
    let consecutiveBlankLines = 0;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1.0 });
        const pageWidth = viewport.width;

        // Extract items with coordinates AND style hints (TASK-035.5 Phase 3)
        const items = textContent.items
            .filter(item => item.str && item.str.trim())
            .map(item => {
                const fontName = item.fontName || '';
                return {
                    str: item.str,
                    x: item.transform[4],
                    y: item.transform[5],
                    width: item.width || 0,
                    // Style detection from fontName
                    isBold: /Bold|Black|Heavy/i.test(fontName),
                    isItalic: /Italic|Oblique/i.test(fontName),
                    fontName: fontName
                };
            });

        if (!items.length) continue;

        // Sort by y descending (top first), then x ascending (left first)
        items.sort((a, b) => {
            const yDiff = b.y - a.y;
            if (Math.abs(yDiff) > CONFIG.yLineThreshold) return yDiff;
            return a.x - b.x;
        });

        // Compute median line height for blank line detection
        const lineYs = [];
        let prevY = null;
        for (const item of items) {
            if (prevY !== null && Math.abs(item.y - prevY) > CONFIG.yLineThreshold) {
                lineYs.push(prevY);
            }
            prevY = item.y;
        }
        lineYs.push(prevY);

        const lineGaps = [];
        for (let i = 1; i < lineYs.length; i++) {
            lineGaps.push(Math.abs(lineYs[i] - lineYs[i - 1]));
        }
        const medianGap = lineGaps.length ? lineGaps.sort((a, b) => a - b)[Math.floor(lineGaps.length / 2)] : 12;

        // Group into lines
        const lines = [];
        let currentLine = [];
        let currentY = null;

        for (const item of items) {
            if (currentY !== null && Math.abs(item.y - currentY) > CONFIG.yLineThreshold) {
                if (currentLine.length) {
                    lines.push({ items: currentLine, y: currentY });
                }
                currentLine = [];
            }
            currentLine.push(item);
            currentY = item.y;
        }
        if (currentLine.length) {
            lines.push({ items: currentLine, y: currentY });
        }

        // Process lines with blank line detection
        let lastY = null;
        for (const line of lines) {
            // Check for blank line insertion based on gap
            if (lastY !== null) {
                const gap = Math.abs(line.y - lastY);
                let blanksToAdd = 0;
                if (gap >= medianGap * 3.0) {
                    blanksToAdd = 2;
                } else if (gap >= medianGap * 1.5) {
                    blanksToAdd = 1;
                }

                // R2: Cap at max 2 consecutive blank lines
                for (let i = 0; i < blanksToAdd && consecutiveBlankLines < CONFIG.maxConsecutiveBlankLines; i++) {
                    allLines.push('');
                    consecutiveBlankLines++;
                }
            }

            // Build line text with strict ↠ detection
            const lineText = buildLineWithStrictArrowDetection(line.items, pageWidth, CONFIG);
            allLines.push(lineText);
            consecutiveBlankLines = 0; // Reset on non-blank line
            lastY = line.y;
        }

        // Page break (counts as 1 blank)
        if (pageNum < pdf.numPages && consecutiveBlankLines < CONFIG.maxConsecutiveBlankLines) {
            allLines.push('');
            consecutiveBlankLines++;
        }
    }

    return allLines.join('\n');
}

/**
 * Build line text with SMART ↠ detection per FIDELITY_RULES v1.3
 * 
 * Detects two cases:
 * 1. RIGHT-ALIGNED LINE: All items start far right → prefix "↠ <text>"
 * 2. MIXED LINE TAIL: Left cluster + gap + right cluster → "<left>  ↠ <right>"
 */
function buildLineWithStrictArrowDetection(lineItems, pageWidth, config) {
    const rightMarginThreshold = pageWidth * config.rightMarginPct; // 70% for right cluster
    const centerThreshold = pageWidth * 0.55; // 55% for right-aligned line detection
    const leftMargin = pageWidth * config.leftMarginPct;
    const minGap = pageWidth * config.minGapPct;

    // Compute line metrics
    const xMin = Math.min(...lineItems.map(i => i.x));
    const xMax = Math.max(...lineItems.map(i => i.x + (i.width || 0)));
    const rightGap = pageWidth - xMax;

    // Join tokens helper
    const joinTokens = (items) => {
        let result = '';
        for (let i = 0; i < items.length; i++) {
            const token = items[i].str;
            if (i > 0 && result.length > 0) {
                const prevChar = result[result.length - 1];
                const currChar = token[0];
                if (/[A-Za-z0-9]/.test(prevChar) && /[A-Za-z0-9]/.test(currChar)) {
                    result += ' ';
                }
            }
            result += token;
        }
        return result;
    };

    const fullText = joinTokens(lineItems);
    const charCount = fullText.length;

    // ===== CASE 1: RIGHT-ALIGNED LINE (prefix ↠) =====
    // Line starts far right (past 55% of page width) AND is short
    const isRightAlignedLine =
        xMin > centerThreshold &&
        charCount <= 60 &&
        !isLikelyParagraph(fullText);

    if (isRightAlignedLine) {
        console.log(`[TRACE_PDF:RA_LINE] xMin=${xMin.toFixed(1)} centerThresh=${centerThreshold.toFixed(1)} chars=${charCount} → "↠ ${fullText.substring(0, 40)}..."`);
        return `↠ ${fullText}`;
    }

    // ===== CASE 2: MIXED LINE WITH TAIL SEGMENT =====
    // Separate potential left and right clusters
    const leftItems = lineItems.filter(item => item.x < rightMarginThreshold);
    const rightItems = lineItems.filter(item => item.x >= rightMarginThreshold);

    const leftText = joinTokens(leftItems);
    const rightText = joinTokens(rightItems);

    if (rightText && leftText) {
        const shouldEmitArrow = checkArrowConfidence(leftItems, rightItems, leftText, rightText, leftMargin, minGap, config);

        if (shouldEmitArrow) {
            console.log(`[TRACE_PDF:RA_TAIL] PASS: "${leftText}" ↠ "${rightText}"`);
            return `${leftText}  ↠ ${rightText}`;
        } else {
            console.log(`[TRACE_PDF:RA_NONE] Merged: "${fullText.substring(0, 60)}..."`);
            return fullText;
        }
    } else if (rightText) {
        // Only right items but didn't match Case 1 criteria
        // (longer text or paragraph-like)
        console.log(`[TRACE_PDF:RA_SKIP] Right-only but not short enough: "${rightText.substring(0, 40)}..."`);
        return rightText;
    }

    return leftText;
}

/**
 * Check if text looks like a paragraph (not suitable for ↠)
 */
function isLikelyParagraph(text) {
    if (!text) return false;
    const words = text.split(/\s+/).length;
    // More than 10 words is likely a paragraph
    if (words > 10) return true;
    // Ends with common sentence endings
    if (/\.\s*$/.test(text) && words > 5) return true;
    // Contains sentence-continuation patterns
    if (/\b(the|and|or|but|which|that|this|these|those|with|from)\s/i.test(text) && words > 6) return true;
    return false;
}

/**
 * Check if we should emit ↠ marker
 * Returns true only when ALL confidence gates pass
 */
function checkArrowConfidence(leftItems, rightItems, leftText, rightText, leftMargin, minGap, config) {
    // Gate 1: Left cluster must start near left margin
    if (leftItems.length === 0 || leftItems[0].x > leftMargin * 2) {
        return false; // Left text doesn't start near left margin
    }

    // Gate 2: Significant horizontal gap between clusters
    const leftMaxX = Math.max(...leftItems.map(i => i.x + (i.width || 0)));
    const rightMinX = Math.min(...rightItems.map(i => i.x));
    const gap = rightMinX - leftMaxX;
    if (gap < minGap) {
        return false; // Not enough gap
    }

    // Gate 3: Right chunk must be short
    if (rightText.length > config.maxRightChunkLen) {
        return false; // Right chunk too long (likely paragraph continuation)
    }

    // Gate 4: Right chunk must not start with lowercase (except email)
    const firstChar = rightText.trim()[0];
    if (firstChar && /^[a-z]/.test(firstChar) && !rightText.includes('@')) {
        return false; // Starts with lowercase = sentence continuation
    }

    // Gate 5: Right chunk should match common patterns
    const isDateLike = /\b\d{4}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)\b/i.test(rightText) ||
        /\d+\s*[-–—]\s*(Present|\d{4})/i.test(rightText);
    const isLocationLike = /,/.test(rightText) && rightText.length < 40;
    const isContactLike = /@|\.com|\.org|\.edu|\+\d|http|www\./i.test(rightText);

    if (!isDateLike && !isLocationLike && !isContactLike) {
        // Not a recognized right-side pattern
        // Additional check: if it looks like a sentence fragment, reject
        if (/^(the|a|an|is|are|was|were|has|have|had|this|that|which|who|what)\s/i.test(rightText)) {
            return false;
        }
        // Accept short non-sentence text (might be a skill/label)
        if (rightText.length > 25) {
            return false;
        }
    }

    // Gate 6: Must not follow sentence continuation punctuation
    if (leftText.endsWith(',') || leftText.endsWith('and') || leftText.endsWith('or')) {
        return false;
    }

    return true;
}

async function extractFromWord(file) {
    // Use readiness gate to ensure mammoth.js is properly loaded
    await ensureMammothReady();
    const arrayBuffer = await file.arrayBuffer();

    // Extract styled HTML for display (R4: Style Fidelity)
    const htmlResult = await window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    const styledHtml = htmlResult.value;

    // Also extract raw text for editing/plain view
    const textResult = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    const plainText = textResult.value;

    // Store styled HTML in a data attribute or return both
    // For now, return plain text but log styled HTML availability
    console.log('[FIDELITY:DOCX] Styled HTML available, length:', styledHtml.length);

    // TODO: Store styledHtml in cvState for display layer
    // For MVP, return plain text but with style markers preserved via HTML
    // We'll use styledHtml in the editor display layer
    window.__docxStyledHtml = styledHtml;

    return plainText;
}

// TODO: ODT support via JSZip if needed
// TODO: CRT/RTF basic support

/**
 * Get stored styled HTML from last DOCX extraction
 * @returns {string|null} HTML string or null
 */
export function getDocxStyledHtml() {
    return window.__docxStyledHtml || null;
}
