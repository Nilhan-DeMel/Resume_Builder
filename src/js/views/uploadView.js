/**
 * Upload View
 * Purpose: Handle file upload UI and interactions
 */

import { handleFileUpload } from '../upload/fileHandler.js';
import { initDragDrop } from '../upload/dragDrop.js';
import { initPasteHandler } from '../upload/pasteHandler.js';
import { cvState } from '../state/cvState.js';
import { navigateTo } from '../ui/router.js';
import { VIEWS } from '../utils/constants.js';
import { showToast } from '../ui/toast.js';

async function loadJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
}

/**
 * Initialize upload view
 */
export function initUploadView() {
    const uploadView = document.querySelector('[data-view="upload"]');
    if (!uploadView) return;

    // Render job level options
    renderJobLevelOptions(uploadView);

    // Handle file input
    const fileInput = uploadView.querySelector('#cv-file-input');
    fileInput?.addEventListener('change', handleFileInput);

    // Initialize drag-drop
    const dropZone = uploadView.querySelector('#drop-zone');
    if (dropZone) {
        initDragDrop(dropZone, handleDroppedFiles);

        // Click anywhere on drop-zone opens file picker (except interactive elements)
        dropZone.addEventListener('click', (e) => {
            const interactiveTags = ['INPUT', 'SELECT', 'BUTTON', 'A', 'TEXTAREA', 'LABEL'];
            if (interactiveTags.includes(e.target.tagName)) return;
            if (e.target.closest('input, select, button, a, textarea, label')) return;
            fileInput?.click();
        });
    }

    // Initialize paste handler
    initPasteHandler(document.body);

    // Listen for paste events
    document.addEventListener('file-pasted', (e) => {
        handleFileUpload(e.detail.file).then(processUploadResult);
    });

    document.addEventListener('text-pasted', (e) => {
        showToast('Text pasted successfully', 'success');
        navigateTo(VIEWS.EDITOR);
    });

    // Handle job description upload
    const jobDescInput = uploadView.querySelector('#job-desc-input');
    jobDescInput?.addEventListener('change', handleJobDescription);

    // Handle proceed button
    const proceedBtn = uploadView.querySelector('#proceed-btn');
    proceedBtn?.addEventListener('click', handleProceed);
}

function renderJobLevelOptions(container) {
    const select = container.querySelector('#job-level-select');
    if (!select) return;

    loadJson('/data/jobLevels.json')
        .then(data => {
            if (!data.jobLevels || !Array.isArray(data.jobLevels)) return;

            data.jobLevels.forEach(level => {
                const option = document.createElement('option');
                option.value = level.id;
                option.textContent = level.label;
                option.title = level.description;
                select.appendChild(option);
            });
        })
        .catch(err => console.error('[UploadView] jobLevels load failed:', err));

    select.addEventListener('change', (e) => {
        cvState.setJobLevel(e.target.value);
    });
}

async function handleFileInput(e) {
    const file = e.target.files[0];
    if (file) {
        const result = await handleFileUpload(file);
        processUploadResult(result);
    }
}

async function handleDroppedFiles(files) {
    if (files.length > 0) {
        const result = await handleFileUpload(files[0]);
        processUploadResult(result);
    }
}

function processUploadResult(result) {
    if (result.success) {
        showToast(`File uploaded: ${result.fileName}`, 'success');
        updateCvUploadStatus(true, result.fileName);
    } else {
        showToast(result.error, 'error');
        updateCvUploadStatus(false, null, result.error);
    }
}

/**
 * Update persistent CV upload status indicator
 * @param {boolean} success - Whether upload succeeded
 * @param {string|null} fileName - Uploaded file name (on success)
 * @param {string|null} errorMsg - Error message (on failure)
 */
function updateCvUploadStatus(success, fileName = null, errorMsg = null) {
    const dropZone = document.querySelector('#drop-zone');
    if (!dropZone) return;

    // Find or create status element
    let statusEl = dropZone.querySelector('#cv-upload-status');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'cv-upload-status';
        statusEl.style.cssText = 'margin-top: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem;';
        dropZone.appendChild(statusEl);
    }

    if (success && fileName) {
        // Green check-circle SVG
        const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
        statusEl.innerHTML = `${checkSvg}<span style="color: #22c55e; font-weight: 500;">Uploaded: ${fileName}</span>`;
        statusEl.style.display = 'flex';
    } else if (!success && errorMsg) {
        // Red X-circle SVG for error
        const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
        statusEl.innerHTML = `${errorSvg}<span style="color: #ef4444;">Upload failed</span>`;
        statusEl.style.display = 'flex';
    } else {
        statusEl.style.display = 'none';
    }
}

async function handleJobDescription(e) {
    const file = e.target.files[0];
    if (file) {
        const text = await file.text();
        cvState.setJobDescription(text);
        showToast('Job description uploaded', 'success');
    }
}

function handleProceed() {
    const snapshot = cvState.getSnapshot();

    if (!snapshot.originalText) {
        showToast('Please upload your CV first', 'error');
        return;
    }

    if (!snapshot.jobLevel) {
        showToast('Please select a job level', 'error');
        return;
    }

    navigateTo(VIEWS.EDITOR);
}
