/**
 * API Configuration
 * Purpose: Centralize all API endpoints and keys
 * 
 * SECURITY NOTE:
 * - ANTHROPIC_API_KEY should be stored as repository secret
 * - In production, use backend proxy to protect API key
 * - Never expose API keys in client-side code in production
 */

export const API_CONFIG = {
    ANTHROPIC_API_KEY: 'PLACEHOLDER_API_KEY', // TODO: Replace with secret
    ANTHROPIC_ENDPOINT: 'https://api.anthropic.com/v1/messages',
    MODEL: 'claude-sonnet-4-20250514',
    MAX_TOKENS: 4096
};

export const ENDPOINTS = {
    AI_OPTIMIZE: '/api/optimize-cv', // TODO: Implement backend proxy
    STORAGE_UPLOAD: '/api/upload',
    STORAGE_DOWNLOAD: '/api/download'
};
