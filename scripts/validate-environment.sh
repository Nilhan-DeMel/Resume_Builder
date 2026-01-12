#!/bin/bash
# Validate Environment
# Checks: Runtime (node/python), Port 8000, Source files

echo "Starting Environment Validation..."

# 1. Check Runtime
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found."
elif command -v python &> /dev/null; then
    echo "✅ Python found."
elif command -v node &> /dev/null; then
    echo "✅ Node.js found."
else
    echo "❌ CRITICAL: No Python or Node.js found. Cannot start server."
    exit 1
fi

# 2. Check Source
if [ -f "src/index.html" ]; then
    echo "✅ src/index.html found."
else
    echo "❌ CRITICAL: src/index.html missing. Run from repo root."
    exit 1
fi

# 3. Check Port 8000 (Advisory)
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  WARNING: Port 8000 appears to be in use. Server start might fail."
else
    echo "✅ Port 8000 appears free."
fi

echo "Environment OK."
exit 0
