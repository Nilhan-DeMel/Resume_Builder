/**
 * Feature Flags
 * Purpose: Toggle features without code changes
 */

export const FEATURES = {
    /**
     * FIDELITY_MODE: When true, Editor shows extracted text in exact order
     * without any AI/canonicalization/labeling. (TASK-035)
     */
    FIDELITY_MODE: true,

    /**
     * CANONICAL_MODE: When true, uses AI/heuristic structuring (TASK-033)
     * Note: Disabled by design per TASK-035. Set FIDELITY_MODE=false to enable.
     */
    CANONICAL_MODE: false
};
