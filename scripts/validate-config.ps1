# Validate Configuration (PowerShell)
Write-Host "Validating Configuration..." -ForegroundColor Cyan

$DEMO_FILE = "src/js/config/demo.js"
$INDEX_FILE = "src/index.html"

# 1. Check DEMO_MODE
# Read raw content
$demoContent = Get-Content $DEMO_FILE -Raw
if ($demoContent -match "export const DEMO_MODE = true;") {
    Write-Host "PASS: DEMO_MODE is ENABLED." -ForegroundColor Green
} else {
    Write-Host "INFO: DEMO_MODE is DISABLED." -ForegroundColor Yellow
    # Check for placeholders
    $supabaseContent = Get-Content "src/js/config/supabase.js" -Raw
    if ($supabaseContent -match "YOUR_SUPABASE") {
        Write-Host "FAIL: DEMO_MODE is false but placeholders found." -ForegroundColor Red
        exit 1
    }
}

# 2. Check Index for UMD
$indexContent = Get-Content $INDEX_FILE -Raw
if ($indexContent -match "cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js") {
    Write-Host "PASS: Index uses UMD Supabase build." -ForegroundColor Green
} else {
    Write-Host "WARN: Index might be using ESM Supabase build." -ForegroundColor Yellow
}

Write-Host "Configuration OK." -ForegroundColor Cyan
exit 0
