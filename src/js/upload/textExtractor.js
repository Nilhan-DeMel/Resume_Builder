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

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    return fullText;
}

async function extractFromWord(file) {
    await loadScript(MAMMOTH_SRC);
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}

// TODO: ODT support via JSZip if needed
// TODO: CRT/RTF basic support

