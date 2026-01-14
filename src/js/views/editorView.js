/**
 * Editor View
 * Purpose: Handle CV review and editing
 * 
 * TASK-035.4: Added R4 (styled view), O8 (↠ toggle)
 */

import { cvState } from '../state/cvState.js';
import { appState } from '../state/appState.js';
import { VIEWS } from '../utils/constants.js';
import { navigateTo } from '../ui/router.js';
import { optimizeCV } from '../ai/optimizer.js';
import {
    hasStyledHtml,
    getStyledHtml,
    htmlToPlainText,
    stripArrowMarkers,
    shouldShowArrowMarkers,
    setShowArrowMarkers
} from './editorModes.js';

// State for view mode
let isStyledView = true;
let styledContainer = null;
let plainTextarea = null;
let arrowToggleBtn = null;
let viewModeBtn = null;

export function initEditorView() {
    const editorView = document.querySelector('[data-view="editor"]');
    if (!editorView) return;

    plainTextarea = editorView.querySelector('.editor-content');
    const toolbar = editorView.querySelector('.editor-toolbar');

    // Create styled container (contenteditable div) for R4
    createStyledContainer(editorView);

    // Create toolbar buttons for O8 and view toggle
    createToolbarButtons(toolbar);

    // Subscribe to state changes
    appState.subscribe((state) => {
        if (state.currentView === VIEWS.EDITOR) {
            console.log(`[TRACE:${window.TRACE_ID}] EDITOR_RENDER_TRIGGERED view=${state.currentView}`);
            updateEditorContent();
        }
    });

    // Handle plain textarea edits
    if (plainTextarea) {
        plainTextarea.addEventListener('input', (e) => {
            cvState.setEditedText(e.target.value);
        });
    }

    // Inject "Optimize Now" button if missing
    let optimizeBtn = editorView.querySelector('#optimize-btn');
    if (!optimizeBtn && toolbar) {
        optimizeBtn = document.createElement('button');
        optimizeBtn.id = 'optimize-btn';
        optimizeBtn.className = 'btn btn-primary';
        optimizeBtn.textContent = 'Optimize Now';
        optimizeBtn.style.marginLeft = 'auto';
        toolbar.appendChild(optimizeBtn);
    }

    if (optimizeBtn) {
        optimizeBtn.addEventListener('click', handleOptimize);
    }
}

/**
 * Create styled container (contenteditable div) for DOCX styled view
 */
function createStyledContainer(editorView) {
    styledContainer = document.createElement('div');
    styledContainer.id = 'editor-styled';
    styledContainer.className = 'editor-content editor-styled';
    styledContainer.contentEditable = 'true';
    styledContainer.style.cssText = `
        display: none;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: inherit;
        line-height: 1.6;
        padding: 1rem;
        min-height: 400px;
        background: var(--surface-dark, #1a1a2e);
        color: var(--text-primary, #fff);
        border-radius: 8px;
        overflow-y: auto;
    `;

    // Insert after textarea
    if (plainTextarea && plainTextarea.parentNode) {
        plainTextarea.parentNode.insertBefore(styledContainer, plainTextarea.nextSibling);
    }

    // Handle styled container edits
    styledContainer.addEventListener('input', () => {
        // Sync to plain text state
        cvState.setEditedText(htmlToPlainText(styledContainer.innerHTML));
    });
}

/**
 * Create toolbar buttons for view mode toggle and ↠ toggle
 */
function createToolbarButtons(toolbar) {
    if (!toolbar) return;

    // Create button container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'editor-toggles';
    btnContainer.style.cssText = 'display: flex; gap: 0.5rem; margin-right: 1rem;';

    // O8: Arrow marker toggle
    arrowToggleBtn = document.createElement('button');
    arrowToggleBtn.id = 'arrow-toggle-btn';
    arrowToggleBtn.className = 'btn btn-secondary btn-sm';
    arrowToggleBtn.title = 'Toggle alignment markers (↠)';
    updateArrowToggleLabel();
    arrowToggleBtn.addEventListener('click', handleArrowToggle);

    // R4: View mode toggle
    viewModeBtn = document.createElement('button');
    viewModeBtn.id = 'view-mode-toggle';
    viewModeBtn.className = 'btn btn-secondary btn-sm';
    viewModeBtn.title = 'Toggle styled/plain view';
    viewModeBtn.textContent = 'View: Styled';
    viewModeBtn.addEventListener('click', handleViewModeToggle);

    btnContainer.appendChild(arrowToggleBtn);
    btnContainer.appendChild(viewModeBtn);

    // Insert at start of toolbar
    toolbar.insertBefore(btnContainer, toolbar.firstChild);
}

/**
 * Update arrow toggle button label
 */
function updateArrowToggleLabel() {
    if (!arrowToggleBtn) return;
    const showArrows = shouldShowArrowMarkers();
    arrowToggleBtn.textContent = showArrows ? '↠ ON' : '↠ OFF';
    arrowToggleBtn.style.opacity = showArrows ? '1' : '0.6';
}

/**
 * Handle O8: Arrow marker toggle
 */
function handleArrowToggle() {
    const current = shouldShowArrowMarkers();
    setShowArrowMarkers(!current);
    updateArrowToggleLabel();
    updateEditorContent(); // Re-render with new setting
    console.log(`[FIDELITY:O8] Arrow markers ${!current ? 'ON' : 'OFF'}`);
}

/**
 * Handle R4: View mode toggle
 */
function handleViewModeToggle() {
    isStyledView = !isStyledView;
    viewModeBtn.textContent = isStyledView ? 'View: Styled' : 'View: Plain';
    updateEditorContent();
    console.log(`[FIDELITY:R4] View mode: ${isStyledView ? 'Styled' : 'Plain'}`);
}

/**
 * Update editor content based on current mode
 */
function updateEditorContent() {
    const snapshot = cvState.getSnapshot();
    let content = snapshot.editedText || snapshot.originalText || '';

    // O8: Apply arrow marker visibility
    if (!shouldShowArrowMarkers()) {
        content = stripArrowMarkers(content);
    }

    // R4: Check if styled view should be used
    const useStyledView = isStyledView && hasStyledHtml();

    if (useStyledView && styledContainer) {
        // Show styled container, hide textarea
        styledContainer.style.display = 'block';
        if (plainTextarea) plainTextarea.style.display = 'none';

        // Render sanitized HTML
        const styledHtml = getStyledHtml();
        styledContainer.innerHTML = styledHtml;

        console.log(`[TRACE:${window.TRACE_ID}] EDITOR_SET styled=true htmlChars=${styledHtml.length}`);
    } else if (plainTextarea) {
        // Show textarea, hide styled container
        if (styledContainer) styledContainer.style.display = 'none';
        plainTextarea.style.display = 'block';

        plainTextarea.value = content;

        console.log(`[TRACE:${window.TRACE_ID}] EDITOR_SET styled=false textChars=${content.length}`);
    }

    // Update view mode button visibility
    if (viewModeBtn) {
        viewModeBtn.style.display = hasStyledHtml() ? 'inline-block' : 'none';
    }
}

async function handleOptimize() {
    const { editedText } = cvState.getSnapshot();
    if (!editedText || editedText.trim().length < 50) {
        alert('Please ensure your CV has sufficient content before optimizing.');
        return;
    }

    const result = await optimizeCV();

    if (result.success) {
        navigateTo(VIEWS.OUTPUT);
    }
}
