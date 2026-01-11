#!/bin/bash
set -euo pipefail

# Validate that the application exists
if [ ! -f "src/index.html" ]; then
    echo "Error: src/index.html not found. Repository may be corrupted."
    exit 1
fi

echo "Starting Resume_Builder..."
echo "Open src/index.html in your browser"
echo "✓ Application ready"
