/**
 * Paste Handler
 * Purpose: Handle paste events for text/files
 */

import { cvState } from '../state/cvState.js';

/**
 * Initialize paste handler
 * @param {HTMLElement} element - Element to attach paste handler
 */
export function initPasteHandler(element) {
    element.addEventListener('paste', handlePaste);
}

/**
 * Handle paste event
 * @param {ClipboardEvent} e - Paste event
 */
async function handlePaste(e) {
    e.preventDefault();

    const items = e.clipboardData.items;

    // Check for files
    for (const item of items) {
        if (item.kind === 'file') {
            const file = item.getAsFile();
            // Trigger file upload
            const event = new CustomEvent('file-pasted', { detail: { file } });
            document.dispatchEvent(event);
            return;
        }
    }

    // Check for text
    const text = e.clipboardData.getData('text/plain');
    if (text) {
        cvState.setOriginalText(text);
        const event = new CustomEvent('text-pasted', { detail: { text } });
        document.dispatchEvent(event);
    }
}
