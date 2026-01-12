# Audit Evidence Dump

Date: 2026-01-11
Branch: chore/audit-2026-01-11

---

## 1. scripts/run.sh

# !/bin/bash
set -euo pipefail

# Validate that the application exists

if [ ! -f "src/index.html" ]; then
    echo "Error: src/index.html not found. Repository may be corrupted."
    exit 1
fi

echo "========================================"
echo "Starting Resume_Builder Development Server"
echo "========================================"
echo ""

# Check if Python is available

if command -v python3 &> /dev/null; then
    echo "✓ Using Python 3"
    cd src
    echo ""
    echo "🚀 Server starting at: <http://localhost:8000>"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ Using Python 2"
    cd src
    echo ""
    echo "🚀 Server starting at: <http://localhost:8000>"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================"
    python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
    echo "✓ Using Node.js (npx)"
    cd src
    echo ""
    echo "🚀 Server starting at: <http://localhost:8000>"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================"
    npx http-server -p 8000 -c-1
else
    echo "❌ Error: No web server available!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: <https://www.python.org/downloads/>"
    echo "  - Node.js: <https://nodejs.org/>"
    echo ""
    echo "Or open src/index.html in a browser that supports file:// ES6 modules"
    exit 1
fi

---

## 2. scripts/setup.sh

# !/bin/bash
set -euo pipefail

# Single command to install all dependencies

echo "Setting up Resume_Builder environment..."
echo "No dependencies to install yet (vanilla HTML/CSS/JS)"
echo "Setup complete."

---

## 3. scripts/test.sh

# !/bin/bash
set -euo pipefail

# Single command to run all tests

echo "Running tests..."

# Currently no tests - will execute test framework when added

echo "No tests yet. Add tests when core functionality exists."
exit 0

---

## 4. src/js/config/demo.js

/**

* Demo Mode Configuration
* Purpose: Allow testing without real API keys
*
* Set DEMO_MODE = true to use mock responses instead of real APIs
 */

export const DEMO_MODE = true; // Set to false when using real APIs

export const DEMO_RESPONSES = {
    // Mock CV optimization response
    optimizedCV: `JOHN DOE
Professional Summary
Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact projects.

Professional Experience

SENIOR SOFTWARE ENGINEER | Tech Corp | 2020 - Present
* Led development of microservices architecture serving 2M+ daily active users
* Reduced application load time by 45% through performance optimization
* Mentored team of 5 junior engineers, improving code quality by 30%
* Implemented CI/CD pipeline, reducing deployment time from 2 hours to 15 minutes

SOFTWARE ENGINEER | StartupXYZ | 2017 - 2020
* Built RESTful APIs handling 10,000+ requests per second
* Developed React-based dashboard used by 500+ enterprise clients
* Optimized database queries, improving response time by 60%

Education
B.S. Computer Science | University Name | 2017

Technical Skills
Languages: JavaScript, Python, TypeScript, Java
Frameworks: React, Node.js, Express, Django
Tools: Docker, Kubernetes, AWS, Git, PostgreSQL`,

    // Mock ATS validation response
    atsValidation: {
        score: 95,
        issues: [],
        recommendations: [
            'Excellent formatting for ATS systems',
            'Strong use of action verbs and quantified achievements',
            'Clear section headings detected'
        ]
    }
};

---

## 5. src/js/ui/router.js

/**

* View Router
* Purpose: Handle view switching and routing
 */

import { VIEWS } from '../utils/constants.js';
import { appState } from '../state/appState.js';

/**

* Initialize router
 */
export function initRouter() {
    // Listen to app state changes
    appState.subscribe((state) => {
        renderView(state.currentView);
    });

    // Render initial view
    renderView(appState.currentView);
}

/**

* Render specific view
* @param {string} view - View name from VIEWS constant
 */
function renderView(view) {
    // Hide all views
    const allViews = document.querySelectorAll('[data-view]');
    allViews.forEach(v => v.classList.add('hidden'));

    // Show requested view
    const targetView = document.querySelector(`[data-view="${view}"]`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }
}

/**

* Navigate to view
* @param {string} view - View name
 */
export function navigateTo(view) {
    appState.setView(view);
}

---
