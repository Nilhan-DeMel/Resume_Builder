/**
 * Drag and Drop Handler
 * Purpose: Handle drag-drop file uploads
 */

/**
 * Initialize drag-drop zone
 * @param {HTMLElement} dropZone - Drop zone element
 * @param {Function} onFileDrop - Callback for file drop
 */
export function initDragDrop(dropZone, onFileDrop) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => highlight(dropZone), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => unhighlight(dropZone), false);
    });

    // Handle drop
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        onFileDrop(files);
    }, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(element) {
    element.classList.add('drag-active');
}

function unhighlight(element) {
    element.classList.remove('drag-active');
}
