/**
 * AI Prompt Builder
 * Purpose: Build optimized prompts for CV rewriting
 */

import atsRulesData from '../../data/atsRules.json' assert { type: 'json' };
import jobLevelsData from '../../data/jobLevels.json' assert { type: 'json' };

/**
 * Build CV optimization prompt
 * @param {string} cvText - Original CV text
 * @param {string} jobLevel - Job level ID
 * @param {string} jobDescription - Job description (optional)
 * @returns {string} Formatted prompt
 */
export function buildOptimizationPrompt(cvText, jobLevel, jobDescription = '') {
    const level = jobLevelsData.jobLevels.find(l => l.id === jobLevel);
    const atsRules = atsRulesData.atsRules;

    let prompt = `You are an expert CV/resume writer specializing in ATS (Applicant Tracking System) optimization.

TASK: Rewrite the following CV to optimize it for a ${level.label} position.

ORIGINAL CV:
${cvText}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n` : ''}

OPTIMIZATION REQUIREMENTS:

1. Job Level Focus (${level.label}):
   ${level.optimizationFocus}

2. ATS Compatibility (CRITICAL):
   - Use standard section headings: ${atsRules.structure.standardHeadings.join(', ')}
   - Avoid tables, text boxes, headers, and footers
   - Use standard fonts only
   - Ensure chronological order
   - Include relevant keywords from job description
   - Quantify achievements with numbers and metrics
   - Use clear, parseable formatting

3. Content Guidelines:
   - Highlight measurable achievements
   - Use action verbs
   - Include relevant skills and technologies
   - Tailor experience descriptions to target role
   - Maintain professional tone
   - Keep formatting simple and clean

4. Output Format:
   - Return ONLY the optimized CV text
   - Use clear section breaks with standard headings
   - Use simple bullet points (•) for lists
   - Ensure all text is selectable (no images or graphics)

IMPORTANT: The output MUST be ATS-compatible. This is the highest priority.`;

    return prompt;
}

/**
 * Build validation prompt for ATS compatibility
 * @param {string} cvText - CV text to validate
 * @returns {string} Validation prompt
 */
export function buildValidationPrompt(cvText) {
    return `Review this CV for ATS (Applicant Tracking System) compatibility.

CV TEXT:
${cvText}

Check for:
1. Standard section headings (Experience, Education, Skills, Summary)
2. No tables, text boxes, or complex formatting
3. Standard fonts and clear structure
4. Chronological order
5. Keywords and quantified achievements
6. Selectable text (no graphics as text)

Provide a compatibility score (0-100) and list any issues found.

Format your response as JSON:
{
  "score": <number>,
  "issues": [<list of issues>],
  "recommendations": [<list of improvements>]
}`;
}
