/**
 * Validation Utilities
 * Purpose: Input validation functions
 */

import { FILE_TYPES, MAX_FILE_SIZE } from './constants.js';

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @returns {boolean} Is valid type
 */
export function isValidFileType(file) {
    const validTypes = [
        FILE_TYPES.PDF,
        FILE_TYPES.WORD,
        FILE_TYPES.WORD_LEGACY,
        FILE_TYPES.TEXT,
        ...FILE_TYPES.IMAGE
    ];
    return validTypes.includes(file.type);
}

/**
 * Validate file size
 * @param {File} file - File to validate
 * @returns {boolean} Is within size limit
 */
export function isValidFileSize(file) {
    return file.size <= MAX_FILE_SIZE;
}

/**
 * Validate CV content has minimum required fields
 * @param {string} content - CV text content
 * @returns {Object} {valid: boolean, missing: string[]}
 */
export function validateCVContent(content) {
    const requiredSections = ['experience', 'education', 'skills'];
    const missing = [];

    requiredSections.forEach(section => {
        if (!content.toLowerCase().includes(section)) {
            missing.push(section);
        }
    });

    return {
        valid: missing.length === 0,
        missing
    };
}
