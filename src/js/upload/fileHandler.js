/**
 * File Upload Handler
 * Purpose: Core file upload logic
 */

import { isValidFileType, isValidFileSize } from '../utils/validators.js';
import { formatFileSize } from '../utils/helpers.js';
import { cvState } from '../state/cvState.js';
import { extractText } from './textExtractor.js';
import { normalizeCvText, labelCvText } from '../cv/labeler.js';

/**
 * Handle file upload
 * @param {File} file - Uploaded file
 * @returns {Promise<Object>} Result with extracted text
 */
export async function handleFileUpload(file) {
    try {
        // Validate file type
        if (!isValidFileType(file)) {
            // Note: textExtractor handles broad types now, but validator might be strict
            // For now, validator allows what constants.js ALLOWED_TYPES defines
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

        // Normalize and Label
        const normalizedText = normalizeCvText(rawText);
        const { labeledText, structure, warnings } = labelCvText(normalizedText);

        cvState.setOriginalText(normalizedText); // Store clean original
        cvState.setEditedText(labeledText);      // Editor starts with labeled text

        // Trace Logs (TASK-032)
        console.log(`[TRACE:${window.TRACE_ID}] UPLOAD_OK name=${file.name} type=${file.type}`);
        console.log(`[TRACE:${window.TRACE_ID}] EXTRACT_OK rawChars=${rawText.length} labeledChars=${labeledText.length}`);
        console.log(`[TRACE:${window.TRACE_ID}] CVSTATE_OK original=${cvState.originalText?.length} edited=${cvState.editedText?.length}`);

        return {
            success: true,
            text: normalizedText,
            labeledText,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            warnings
        };
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
