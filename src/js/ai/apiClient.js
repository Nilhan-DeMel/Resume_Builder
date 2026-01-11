/**
 * AI API Client
 * Purpose: Handle communication with Claude API
 */

import { API_CONFIG } from '../config/api.js';

/**
 * Call Claude API
 * @param {string} prompt - Prompt to send
 * @param {Object} options - Additional options
 * @returns {Promise<string>} AI response
 */
export async function callClaudeAPI(prompt, options = {}) {
    try {
        const response = await fetch(API_CONFIG.ANTHROPIC_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_CONFIG.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: API_CONFIG.MODEL,
                max_tokens: options.maxTokens || API_CONFIG.MAX_TOKENS,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        return data.content[0].text;
    } catch (error) {
        console.error('Claude API error:', error);
        throw error;
    }
}
