/**
 * Loading Indicators
 * Purpose: Show/hide loading states
 */

/**
 * Show global loader
 * @param {string} message - Loading message
 */
export function showLoader(message = 'Loading...') {
    let loader = document.querySelector('#global-loader');

    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = `
      <div class="loader-spinner"></div>
      <p class="loader-message">${message}</p>
    `;
        document.body.appendChild(loader);
    }

    loader.classList.add('active');
}

/**
 * Hide global loader
 */
export function hideLoader() {
    const loader = document.querySelector('#global-loader');
    if (loader) {
        loader.classList.remove('active');
    }
}

/**
 * Update loader message
 * @param {string} message - New message
 */
export function updateLoaderMessage(message) {
    const loaderMessage = document.querySelector('.loader-message');
    if (loaderMessage) {
        loaderMessage.textContent = message;
    }
}
