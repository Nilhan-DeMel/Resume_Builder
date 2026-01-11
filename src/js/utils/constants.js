/**
 * Application Constants
 * Purpose: Centralize all app-wide constants
 */

export const APP_NAME = 'Resume_Builder';
export const FREE_EDIT_LIMIT = 10;
export const PAID_EDIT_COST = 1.00; // USD

export const FILE_TYPES = {
    PDF: 'application/pdf',
    WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    WORD_LEGACY: 'application/msword',
    IMAGE: ['image/jpeg', 'image/png', 'image/jpg'],
    TEXT: 'text/plain'
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const VIEWS = {
    AUTH: 'auth',
    UPLOAD: 'upload',
    EDITOR: 'editor',
    PROCESSING: 'processing',
    OUTPUT: 'output'
};

export const COLORS = {
    // Post-AI 2026 color scheme: Warm, professional, modern
    PRIMARY: '#6366f1',      // Indigo - Trust, professionalism
    SECONDARY: '#8b5cf6',    // Purple - Innovation, creativity
    ACCENT: '#ec4899',       // Pink - Warmth, approachability
    SUCCESS: '#10b981',      // Green - Success, completion
    WARNING: '#f59e0b',      // Amber - Caution
    ERROR: '#ef4444',        // Red - Errors
    BACKGROUND: '#0f172a',   // Slate dark - Modern, depth
    SURFACE: '#1e293b',      // Slate medium - Cards, panels
    TEXT_PRIMARY: '#f1f5f9', // Almost white - Primary text
    TEXT_SECONDARY: '#94a3b8' // Slate gray - Secondary text
};
