# Master Test Script (PowerShell)
# Runs: Environment -> Config -> Smoke

$ErrorActionPreference = "Stop"

Write-Host "=== Resume_Builder Test Suite ===" -ForegroundColor Magenta

.\scripts\validate-environment.ps1
if ($LASTEXITCODE -ne 0) { exit 1 }

.\scripts\validate-config.ps1
if ($LASTEXITCODE -ne 0) { exit 1 }

.\scripts\smoke-test.ps1
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "=== ALL TESTS PASSED ===" -ForegroundColor Green
exit 0
