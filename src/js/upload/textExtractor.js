import { FILE_TYPES } from '../utils/constants.js';

// Load vendor scripts dynamically
const PDFJS_SRC = '/vendor/pdfjs/pdf.min.js';
const PDFJS_WORKER_SRC = '/vendor/pdfjs/pdf.worker.min.js';
const MAMMOTH_SRC = '/vendor/mammoth/mammoth.browser.min.js';

async function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
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
    await loadScript(PDFJS_SRC);
    // Set worker
    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const allLines = [];
    let lastLineY = null;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1.0 });
        const pageWidth = viewport.width;

        // Extract items with coordinates
        const items = textContent.items.map(item => ({
            str: item.str,
            x: item.transform[4],
            y: item.transform[5],
            width: item.width || 0
        }));

        // Sort by y descending (top first), then x ascending (left first)
        items.sort((a, b) => {
            const yDiff = b.y - a.y;
            if (Math.abs(yDiff) > 3) return yDiff; // 3-unit threshold for same line
            return a.x - b.x;
        });

        // Group into lines based on y-threshold
        const Y_THRESHOLD = 3;
        const BLANK_LINE_GAP = 15; // Gap threshold for blank line insertion
        const RIGHT_MARGIN_THRESHOLD = pageWidth * 0.65; // 65% of page width

        let currentLine = [];
        let currentY = null;

        for (const item of items) {
            if (currentY !== null) {
                const yGap = Math.abs(item.y - currentY);

                if (yGap > Y_THRESHOLD) {
                    // Finish current line
                    if (currentLine.length) {
                        const lineText = buildLineWithRightMarker(currentLine, RIGHT_MARGIN_THRESHOLD);
                        allLines.push(lineText);

                        // Check for blank line (large gap)
                        if (lastLineY !== null && Math.abs(item.y - lastLineY) > BLANK_LINE_GAP) {
                            allLines.push(''); // Insert blank line
                        }
                        lastLineY = currentY;
                    }
                    currentLine = [];
                }
            }
            currentLine.push(item);
            currentY = item.y;
        }

        // Finish last line of page
        if (currentLine.length) {
            const lineText = buildLineWithRightMarker(currentLine, RIGHT_MARGIN_THRESHOLD);
            allLines.push(lineText);
            lastLineY = currentY;
        }

        // Page break
        if (pageNum < pdf.numPages) {
            allLines.push(''); // Blank line between pages
        }
    }

    return allLines.join('\n');
}

/**
 * Build line text with ↠ marker for right-justified chunks
 */
function buildLineWithRightMarker(lineItems, rightMarginThreshold) {
    // Separate left and right chunks
    const leftChunks = [];
    const rightChunks = [];

    for (const item of lineItems) {
        if (item.x >= rightMarginThreshold) {
            rightChunks.push(item.str);
        } else {
            leftChunks.push(item.str);
        }
    }

    // Join with smart spacing
    const joinTokens = (tokens) => {
        let result = '';
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (i > 0 && result.length > 0) {
                const prevChar = result[result.length - 1];
                const currChar = token[0];
                // Add space if needed to prevent word-joining
                if (/[A-Za-z0-9]/.test(prevChar) && /[A-Za-z0-9]/.test(currChar)) {
                    result += ' ';
                }
            }
            result += token;
        }
        return result;
    };

    const leftText = joinTokens(leftChunks);
    const rightText = joinTokens(rightChunks);

    if (rightText && leftText) {
        return `${leftText}  ↠ ${rightText}`;
    } else if (rightText) {
        return `↠ ${rightText}`;
    }
    return leftText;
}

async function extractFromWord(file) {
    await loadScript(MAMMOTH_SRC);
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}

// TODO: ODT support via JSZip if needed
// TODO: CRT/RTF basic support

