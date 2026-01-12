/**
 * Error Logger
 * Captures runtime errors for stateless agent debugging.
 * Stores last 50 errors in localStorage.
 */

const STORAGE_KEY = 'rb_error_log';
const MAX_LOGS = 50;

export const errorLogger = {
    log(error, context = 'General') {
        const entry = {
            timestamp: new Date().toISOString(),
            message: error.message || String(error),
            stack: error.stack || null,
            context
        };

        this._save(entry);
        console.error(`[${context}]`, error);
    },

    _save(entry) {
        try {
            const history = this.getHistory();
            history.unshift(entry);
            if (history.length > MAX_LOGS) history.pop();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            console.warn('Failed to save error log', e);
        }
    },

    getHistory() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    }
};

// Global hook for console inspection
window.__RB_ERRORS = errorLogger;
