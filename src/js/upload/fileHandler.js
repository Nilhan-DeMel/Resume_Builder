import { isValidFileType, isValidFileSize } from '../utils/validators.js';
import { formatFileSize } from '../utils/helpers.js';
import { cvState } from '../state/cvState.js';
import { extractText } from './textExtractor.js';
import { normalizeCvText } from '../cv/labeler.js';
import { canonicalizeCv } from '../ai/canonicalizer.js';
import { renderCanonicalToEditorText } from '../cv/renderer.js';

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

        // Normalize text
        const normalizedText = normalizeCvText(rawText);
        cvState.setOriginalText(rawText);
        cvState.setNormalizedText(normalizedText);

        // Canonicalize using AI/heuristics
        const fileMeta = {
            fileName: file.name,
            fileType: file.type || file.name.split('.').pop(),
            method: file.type === 'application/pdf' ? 'pdf.js' :
                file.name.endsWith('.docx') ? 'mammoth' : 'text'
        };

        const { canonicalJson, confidence } = await canonicalizeCv({
            normalizedText,
            jobLevel: cvState.jobLevel,
            jobDescription: cvState.jobDescription,
            fileMeta
        });

        cvState.setCanonicalJson(canonicalJson);

        // Render canonical JSON to editor text
        const editorText = renderCanonicalToEditorText(canonicalJson);
        cvState.setEditedText(editorText);

        // Trace Logs
        console.log(`[TRACE:${window.TRACE_ID}] UPLOAD_OK name=${file.name} type=${file.type}`);
        console.log(`[TRACE:${window.TRACE_ID}] CANONICAL_OK confidence=${confidence} sections=${Object.keys(canonicalJson).length}`);
        console.log(`[TRACE:${window.TRACE_ID}] CVSTATE_OK normalized=${normalizedText?.length} edited=${editorText?.length}`);

        return {
            success: true,
            text: normalizedText,
            labeledText: editorText,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            warnings: canonicalJson.notes?.formattingIssues || []
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
