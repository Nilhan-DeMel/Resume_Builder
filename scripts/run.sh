#!/bin/bash
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
    echo "🚀 Server starting at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ Using Python 2"
    cd src
    echo ""
    echo "🚀 Server starting at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================"
    python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
    echo "✓ Using Node.js (npx)"
    cd src
    echo ""
    echo "🚀 Server starting at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================"
    npx http-server -p 8000 -c-1
else
    echo "❌ Error: No web server available!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    echo "Or open src/index.html in a browser that supports file:// ES6 modules"
    exit 1
fi
