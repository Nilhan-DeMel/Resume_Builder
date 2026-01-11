/**
 * CV Optimizer
 * Purpose: Orchestrate CV optimization workflow
 */

import { callClaudeAPI } from './apiClient.js';
import { buildOptimizationPrompt, buildValidationPrompt } from './promptBuilder.js';
import { cvState } from '../state/cvState.js';
import { appState } from '../state/appState.js';
import { VIEWS } from '../utils/constants.js';

/**
 * Optimize CV using AI
 * @returns {Promise<Object>} Result object
 */
export async function optimizeCV() {
    try {
        appState.setLoading(true);
        appState.setView(VIEWS.PROCESSING);

        const { editedText, jobLevel, jobDescription } = cvState.getSnapshot();

        // Build prompt
        const prompt = buildOptimizationPrompt(editedText, jobLevel, jobDescription);

        // Call AI API
        const optimizedCV = await callClaudeAPI(prompt);

        // Store optimized CV
        cvState.setOptimizedCV(optimizedCV);

        // Validate ATS compatibility
        const validationPrompt = buildValidationPrompt(optimizedCV);
        const validationResult = await callClaudeAPI(validationPrompt);

        let atsScore;
        try {
            const validation = JSON.parse(validationResult);
            atsScore = validation.score;
        } catch {
            atsScore = null;
        }

        return {
            success: true,
            optimizedCV,
            atsScore
        };
    } catch (error) {
        console.error('CV optimization error:', error);
        appState.setError('Failed to optimize CV. Please try again.');
        return {
            success: false,
            error: error.message
        };
    } finally {
        appState.setLoading(false);
    }
}
