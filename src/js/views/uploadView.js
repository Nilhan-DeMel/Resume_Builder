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
    } else {
        showToast(result.error, 'error');
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
