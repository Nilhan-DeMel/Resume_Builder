# Validate Environment (PowerShell)
Write-Host "Starting Environment Validation..." -ForegroundColor Cyan

# 1. Check Runtime
$python = Get-Command python -ErrorAction SilentlyContinue
$python3 = Get-Command python3 -ErrorAction SilentlyContinue
$node = Get-Command node -ErrorAction SilentlyContinue

if ($python3) { Write-Host "✅ Python 3 found." -ForegroundColor Green }
elseif ($python) { Write-Host "✅ Python found." -ForegroundColor Green }
elseif ($node) { Write-Host "✅ Node.js found." -ForegroundColor Green }
else {
    Write-Host "❌ CRITICAL: No Python or Node.js found." -ForegroundColor Red
    exit 1
}

# 2. Check Source
if (Test-Path "src/index.html") {
    Write-Host "✅ src/index.html found." -ForegroundColor Green
}
else {
    Write-Host "❌ CRITICAL: src/index.html missing. Run from repo root." -ForegroundColor Red
    exit 1
}

# 3. Check Port 8000
$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  WARNING: Port 8000 appears to be in use." -ForegroundColor Yellow
}
else {
    Write-Host "✅ Port 8000 appears free." -ForegroundColor Green
}

Write-Host "Environment OK." -ForegroundColor Cyan
exit 0
