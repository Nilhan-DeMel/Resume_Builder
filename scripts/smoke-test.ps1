# Smoke Test Wrapper
Write-Host "Running Smoke Test..." -ForegroundColor Cyan

$node = Get-Command node -ErrorAction SilentlyContinue

if (-not $node) {
    Write-Host "❌ Node.js required for smoke test." -ForegroundColor Red
    exit 1
}

node scripts/smoke-test.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Smoke test failed." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Smoke test passed." -ForegroundColor Green
exit 0
