$ErrorActionPreference = "Stop"

Write-Host "=== Resume_Builder Configuration ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will help you configure the application."
Write-Host ""

# Check if config files exist
if (-not (Test-Path "src/js/config/supabase.js")) {
    Write-Host "❌ Error: Configuration files not found" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Configuration files found" -ForegroundColor Green
Write-Host ""
Write-Host "📋 What you need to do manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create a Supabase project at https://supabase.com"
Write-Host "   - Copy your Project URL"
Write-Host "   - Copy your Anon/Public Key"
Write-Host "   - Update src/js/config/supabase.js"
Write-Host ""
Write-Host "2. Create a Firebase project at https://firebase.google.com"
Write-Host "   - Copy your Firebase config object"
Write-Host "   - Update src/js/config/firebase.js"
Write-Host ""
Write-Host "3. Get Anthropic API key from https://console.anthropic.com"
Write-Host "   - Copy your API key"
Write-Host "   - Update src/js/config/api.js"
Write-Host ""
Write-Host "4. Follow the detailed guides:"
Write-Host "   - docs/SUPABASE_SETUP.md"
Write-Host "   - docs/FIREBASE_SETUP.md"
Write-Host "   - docs/API_INTEGRATION.md"
Write-Host ""
Write-Host "After configuration, run: .\scripts\run.ps1" -ForegroundColor Cyan
