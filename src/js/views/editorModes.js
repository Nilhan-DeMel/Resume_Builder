/**
 * Editor Modes - Styled/Plain View Toggle
 * Purpose: R4 compliance - render DOCX bold/italic/underline
 * 
 * TASK-035.4: Implements styled view for DOCX files
 */

// Allowed HTML tags for sanitization (security)
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'span'];

/**
 * Sanitize HTML to only allow safe formatting tags
 * @param {string} html - Raw HTML from mammoth
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
    if (!html) return '';

    // Create a temporary DOM element to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Recursively clean nodes
    cleanNode(temp);

    return temp.innerHTML;
}

/**
 * Recursively clean node, removing disallowed tags
 */
function cleanNode(node) {
    // Process child nodes (iterate backwards to handle removals)
    const children = Array.from(node.childNodes);
    for (const child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
            const tagName = child.tagName.toLowerCase();

            if (!ALLOWED_TAGS.includes(tagName)) {
                // Replace disallowed tag with its text content
                const textNode = document.createTextNode(child.textContent);
                node.replaceChild(textNode, child);
            } else {
                // Remove all attributes except safe ones
                const attrs = Array.from(child.attributes);
                for (const attr of attrs) {
                    // Only allow class attribute for styling
                    if (attr.name !== 'class') {
                        child.removeAttribute(attr.name);
                    }
                }
                // Recurse into allowed elements
                cleanNode(child);
            }
        }
    }
}

/**
 * Convert styled HTML to plain text preserving line breaks
 * @param {string} html - Styled HTML
 * @returns {string} Plain text with newlines
 */
export function htmlToPlainText(html) {
    if (!html) return '';

    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Replace <p> and <br> with newlines
    temp.querySelectorAll('p').forEach(p => {
        p.insertAdjacentText('afterend', '\n');
    });
    temp.querySelectorAll('br').forEach(br => {
        br.replaceWith('\n');
    });
    temp.querySelectorAll('li').forEach(li => {
        li.insertAdjacentText('afterend', '\n');
    });

    return temp.textContent.trim();
}

/**
 * Check if current file is DOCX (has styled HTML available)
 * @returns {boolean}
 */
export function hasStyledHtml() {
    return !!window.__docxStyledHtml;
}

/**
 * Get sanitized styled HTML for display
 * @returns {string} Sanitized HTML or empty string
 */
export function getStyledHtml() {
    const raw = window.__docxStyledHtml;
    if (!raw) return '';
    return sanitizeHtml(raw);
}

/**
 * Clear stored styled HTML (call on new upload)
 */
export function clearStyledHtml() {
    window.__docxStyledHtml = null;
}

/**
 * Strip ↠ markers from text (for O8 toggle)
 * @param {string} text - Text with potential ↠ markers
 * @returns {string} Text without ↠ markers
 */
export function stripArrowMarkers(text) {
    if (!text) return '';
    // Replace "  ↠ " with "  " (maintaining some spacing)
    return text.replace(/\s*↠\s*/g, '  ');
}

/**
 * Check if ↠ markers should be shown
 * @returns {boolean}
 */
export function shouldShowArrowMarkers() {
    const stored = localStorage.getItem('rb_show_alignment_markers');
    // Default to true if not set
    return stored === null ? true : stored === 'true';
}

/**
 * Set ↠ marker visibility preference
 * @param {boolean} show
 */
export function setShowArrowMarkers(show) {
    localStorage.setItem('rb_show_alignment_markers', String(show));
}
