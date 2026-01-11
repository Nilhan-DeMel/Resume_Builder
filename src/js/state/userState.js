/**
 * User State Management
 * Purpose: Track user session and edit count
 */

class UserState {
    constructor() {
        this.user = null;
        this.editCount = 0;
        this.isPremium = false;
    }

    /**
     * Set current user
     * @param {Object} user - Supabase user object
     */
    setUser(user) {
        this.user = user;
        this.loadEditCount();
    }

    /**
     * Load edit count from storage
     */
    async loadEditCount() {
        // TODO: Load from Supabase database
        const stored = localStorage.getItem(`editCount_${this.user?.id}`);
        this.editCount = stored ? parseInt(stored, 10) : 0;
    }

    /**
     * Increment edit count
     * @returns {boolean} Whether edit is allowed
     */
    incrementEditCount() {
        this.editCount++;
        localStorage.setItem(`editCount_${this.user?.id}`, this.editCount.toString());
        return this.canEdit();
    }

    /**
     * Check if user can edit
     * @returns {boolean} Can edit
     */
    canEdit() {
        return this.editCount < 10 || this.isPremium;
    }

    /**
     * Get remaining free edits
     * @returns {number} Remaining edits
     */
    getRemainingEdits() {
        return Math.max(0, 10 - this.editCount);
    }

    /**
     * Clear user session
     */
    clear() {
        this.user = null;
        this.editCount = 0;
        this.isPremium = false;
    }
}

export const userState = new UserState();
