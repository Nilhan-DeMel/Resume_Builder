#!/usr/bin/env bash
set -euo pipefail

echo "=== Resume_Builder Configuration ==="
echo ""
echo "This script will help you configure the application."
echo ""

# Check if config files exist
if [ ! -f "src/js/config/supabase.js" ]; then
    echo "❌ Error: Configuration files not found"
    exit 1
fi

echo "✓ Configuration files found"
echo ""
echo "📋 What you need to do manually:"
echo ""
echo "1. Create a Supabase project at https://supabase.com"
echo "   - Copy your Project URL"
echo "   - Copy your Anon/Public Key"
echo "   - Update src/js/config/supabase.js"
echo ""
echo "2. Create a Firebase project at https://firebase.google.com"
echo "   - Copy your Firebase config object"
echo "   - Update src/js/config/firebase.js"
echo ""
echo "3. Get Anthropic API key from https://console.anthropic.com"
echo "   - Copy your API key"
echo "   - Update src/js/config/api.js"
echo ""
echo "4. Follow the detailed guides:"
echo "   - docs/SUPABASE_SETUP.md"
echo "   - docs/FIREBASE_SETUP.md"
echo "   - docs/API_INTEGRATION.md"
echo ""
echo "After configuration, run: ./scripts/run.sh"
