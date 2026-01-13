import { isValidFileType, isValidFileSize } from '../utils/validators.js';
import { formatFileSize } from '../utils/helpers.js';
import { cvState } from '../state/cvState.js';
import { extractText } from './textExtractor.js';
import { FEATURES } from '../config/features.js';
import { toFidelityText } from '../cv/fidelity.js';

// Canonical mode imports (disabled by default per TASK-035)
// import { normalizeCvText } from '../cv/labeler.js';
// import { canonicalizeCv } from '../ai/canonicalizer.js';
// import { renderCanonicalToEditorText } from '../cv/renderer.js';

/**
 * Handle file upload
 * @param {File} file - Uploaded file
 * @returns {Promise<Object>} Result with extracted text
 */
export async function handleFileUpload(file) {
    try {
        // Validate file type
        if (!isValidFileType(file)) {
            if (!file.name.match(/\.(txt|pdf|docx|doc)$/i)) {
                throw new Error(`Invalid file type. Please upload PDF, Word, or Text files.`);
            }
        }

        // Validate file size
        if (!isValidFileSize(file)) {
            throw new Error(`File too large. Maximum size is ${formatFileSize(10485760)}.`);
        }

        // Store original file
        cvState.setOriginalFile(file);

        // Extract text based on file type
        const rawText = await extractText(file);

        // FIDELITY MODE (TASK-035): Show exact extracted text, no AI/structuring
        if (FEATURES.FIDELITY_MODE) {
            const fileType = file.type || file.name.split('.').pop();
            const fidelityText = toFidelityText({
                fileType,
                extractedText: rawText
            });

            cvState.setOriginalText(fidelityText);
            cvState.setEditedText(fidelityText);

            console.log(`[TRACE:${window.TRACE_ID}] FIDELITY_MODE upload name=${file.name} chars=${fidelityText?.length}`);

            return {
                success: true,
                text: fidelityText,
                labeledText: fidelityText, // No labeling in fidelity mode
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                warnings: []
            };
        }

        // CANONICAL MODE (disabled by design per TASK-035)
        // This code path is kept for future use but not invoked when FIDELITY_MODE=true
        throw new Error('Canonical mode is disabled. Set FEATURES.FIDELITY_MODE=false to enable.');

    } catch (error) {
        console.error('File upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Handle multiple file uploads
 * @param {FileList} files - List of files
 * @returns {Promise<Object[]>} Array of results
 */
export async function handleMultipleFiles(files) {
    const results = [];
    for (const file of files) {
        const result = await handleFileUpload(file);
        results.push(result);
    }
    return results;
}
