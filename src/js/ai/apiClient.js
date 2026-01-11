/**
 * AI API Client
 * Purpose: Handle communication with Claude API (with demo mode support)
 */

import { API_CONFIG } from '../config/api.js';
import { DEMO_MODE, DEMO_RESPONSES } from '../config/demo.js';

/**
 * Call Claude API (or return demo response if in demo mode)
 * @param {string} prompt - Prompt to send
 * @param {Object} options - Additional options
 * @returns {Promise<string>} AI response
 */
export async function callClaudeAPI(prompt, options = {}) {
    // Demo mode - return mock response
    if (DEMO_MODE) {
        console.log('🎭 DEMO MODE: Using mock AI response');

        // Simulate API delay
        await delay(2000);

        // Determine which mock response to return based on prompt content
        if (prompt.includes('compatibility') || prompt.includes('validation')) {
            return JSON.stringify(DEMO_RESPONSES.atsValidation);
        }

        return DEMO_RESPONSES.optimizedCV;
    }

    // Real API mode
    try {
        if (API_CONFIG.ANTHROPIC_API_KEY === 'PLACEHOLDER_API_KEY') {
            throw new Error('API key not configured. Please add your Anthropic API key to src/js/config/api.js');
        }

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

/**
 * Helper function to simulate API delay
 * @param {number} ms - Milliseconds to delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
