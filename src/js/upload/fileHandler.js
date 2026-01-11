/**
 * File Upload Handler
 * Purpose: Core file upload logic
 */

import { isValidFileType, isValidFileSize } from '../utils/validators.js';
import { formatFileSize } from '../utils/helpers.js';
import { cvState } from '../state/cvState.js';
import { extractText } from './textExtractor.js';

/**
 * Handle file upload
 * @param {File} file - Uploaded file
 * @returns {Promise<Object>} Result with extracted text
 */
export async function handleFileUpload(file) {
    try {
        // Validate file type
        if (!isValidFileType(file)) {
            throw new Error(`Invalid file type. Please upload PDF, Word, Image, or Text files.`);
        }

        // Validate file size
        if (!isValidFileSize(file)) {
            throw new Error(`File too large. Maximum size is ${formatFileSize(10485760)}.`);
        }

        // Store original file
        cvState.setOriginalFile(file);

        // Extract text based on file type
        const text = await extractText(file);
        cvState.setOriginalText(text);

        return {
            success: true,
            text,
            fileName: file.name,
            fileSize: formatFileSize(file.size)
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
