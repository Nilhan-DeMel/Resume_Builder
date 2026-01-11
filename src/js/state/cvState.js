/**
 * CV Data State
 * Purpose: Manage CV data throughout the workflow
 */

class CVState {
    constructor() {
        this.originalFile = null;
        this.originalText = '';
        this.editedText = '';
        this.jobLevel = null;
        this.jobDescription = '';
        this.optimizedCV = null;
        this.outputFiles = {
            pdf: null,
            docx: null
        };
    }

    /**
     * Set original uploaded file
     * @param {File} file - Uploaded file
     */
    setOriginalFile(file) {
        this.originalFile = file;
    }

    /**
     * Set extracted text from CV
     * @param {string} text - Extracted CV text
     */
    setOriginalText(text) {
        this.originalText = text;
        this.editedText = text; // Initialize edited text
    }

    /**
     * Set user-edited text
     * @param {string} text - Edited text
     */
    setEditedText(text) {
        this.editedText = text;
    }

    /**
     * Set selected job level
     * @param {string} level - Job level ID
     */
    setJobLevel(level) {
        this.jobLevel = level;
    }

    /**
     * Set job description
     * @param {string} description - Job description text
     */
    setJobDescription(description) {
        this.jobDescription = description;
    }

    /**
     * Set AI-optimized CV
     * @param {string} optimizedCV - Optimized CV text
     */
    setOptimizedCV(optimizedCV) {
        this.optimizedCV = optimizedCV;
    }

    /**
     * Set output files
     * @param {Object} files - {pdf: Blob, docx: Blob}
     */
    setOutputFiles(files) {
        this.outputFiles = files;
    }

    /**
     * Reset for new CV
     */
    reset() {
        this.originalFile = null;
        this.originalText = '';
        this.editedText = '';
        this.jobLevel = null;
        this.jobDescription = '';
        this.optimizedCV = null;
        this.outputFiles = { pdf: null, docx: null };
    }

    /**
     * Get current CV data snapshot
     * @returns {Object} CV data
     */
    getSnapshot() {
        return {
            originalText: this.originalText,
            editedText: this.editedText,
            jobLevel: this.jobLevel,
            jobDescription: this.jobDescription,
            optimizedCV: this.optimizedCV
        };
    }
}

export const cvState = new CVState();
