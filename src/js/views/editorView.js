/**
 * Editor View
 * Purpose: Handle CV review and editing
 */

import { cvState } from '../state/cvState.js';
import { appState } from '../state/appState.js';
import { VIEWS } from '../utils/constants.js';
import { navigateTo } from '../ui/router.js';
import { optimizeCV } from '../ai/optimizer.js';

export function initEditorView() {
    const editorView = document.querySelector('[data-view="editor"]');
    if (!editorView) return;

    const textarea = editorView.querySelector('.editor-content');
    const toolbar = editorView.querySelector('.editor-toolbar');

    // Subscribe to state changes to populate textarea
    appState.subscribe((state) => {
        if (state.currentView === VIEWS.EDITOR) {
            updateEditorContent(textarea);
        }
    });

    // Handle text edits
    if (textarea) {
        textarea.addEventListener('input', (e) => {
            cvState.setEditedText(e.target.value);
        });
    }

    // Inject "Optimize Now" button if missing (per requirement)
    let optimizeBtn = editorView.querySelector('#optimize-btn');
    if (!optimizeBtn && toolbar) {
        optimizeBtn = document.createElement('button');
        optimizeBtn.id = 'optimize-btn';
        optimizeBtn.className = 'btn btn-primary';
        optimizeBtn.textContent = 'Optimize Now';
        optimizeBtn.style.marginLeft = 'auto'; // Push to right
        toolbar.appendChild(optimizeBtn);
    } else if (!optimizeBtn) {
        // Fallback injection if toolbar missing (unlikely based on HTML)
        const container = editorView.querySelector('.editor-main');
        if (container) {
            optimizeBtn = document.createElement('button');
            optimizeBtn.id = 'optimize-btn';
            optimizeBtn.className = 'btn btn-primary';
            optimizeBtn.textContent = 'Optimize Now';
            container.appendChild(optimizeBtn);
        }
    }

    if (optimizeBtn) {
        optimizeBtn.addEventListener('click', handleOptimize);
    }
}

function updateEditorContent(textarea) {
    if (!textarea) return;

    const snapshot = cvState.getSnapshot();
    // Use editedText (which defaults to labeledText) or fallback to original
    const content = snapshot.editedText || snapshot.originalText || '';

    if (content) {
        textarea.value = content;
    } else {
        textarea.value = '';
        textarea.placeholder = 'No CV text found. Please upload a file.';
    }
}

async function handleOptimize() {
    // Basic validation
    const { editedText } = cvState.getSnapshot();
    if (!editedText || editedText.trim().length < 50) {
        alert('Please ensure your CV has sufficient content before optimizing.');
        return;
    }

    // Call optimizer
    const result = await optimizeCV();

    if (result.success) {
        navigateTo(VIEWS.OUTPUT);
    }
}
