#!/bin/bash
# Validate Configuration
# Checks: DEMO_MODE, UMD Supabase

echo "Validating Configuration..."

DEMO_FILE="src/js/config/demo.js"
INDEX_FILE="src/index.html"

# 1. Check DEMO_MODE
if grep -q "export const DEMO_MODE = true;" "$DEMO_FILE"; then
    echo "✅ DEMO_MODE is ENABLED. No API keys required."
else
    echo "ℹ️  DEMO_MODE is DISABLED."
    echo "   Checking for placeholders..."
    # Naive check for placeholders if not demo
    if grep -q "YOUR_SUPABASE" "src/js/config/supabase.js"; then
        echo "❌ CRITICAL: DEMO_MODE is false but placeholders found in supabase.js."
        exit 1
    fi
fi

# 2. Check Index for UMD
if grep -q "cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js" "$INDEX_FILE"; then
    echo "✅ Index uses UMD Supabase build."
else
    echo "⚠️  WARNING: Index might be using ESM Supabase build (risk of 'export' error)."
fi

echo "Configuration OK."
exit 0
