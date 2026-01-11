$ErrorActionPreference = "Stop"

# Validate that the application exists
if (-not (Test-Path "src/index.html")) {
    Write-Host "Error: src/index.html not found. Repository may be corrupted." -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Resume_Builder Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Python
if (Get-Command "python3" -ErrorAction SilentlyContinue) {
    Write-Host "Using Python 3" -ForegroundColor Green
    Set-Location src
    Write-Host ""
    Write-Host "Server starting at: http://localhost:8000" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    python3 -m http.server 8000
}
elseif (Get-Command "python" -ErrorAction SilentlyContinue) {
    Write-Host "Using Python" -ForegroundColor Green
    Set-Location src
    Write-Host ""
    Write-Host "Server starting at: http://localhost:8000" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    python -m http.server 8000
}
elseif (Get-Command "npx" -ErrorAction SilentlyContinue) {
    Write-Host "Using Node.js (npx)" -ForegroundColor Green
    Set-Location src
    Write-Host ""
    Write-Host "Server starting at: http://localhost:8000" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    npx http-server -p 8000 -c-1
}
else {
    Write-Host "Error: No web server available!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install one of the following:"
    Write-Host "  - Python: https://www.python.org/downloads/"
    Write-Host "  - Node.js: https://nodejs.org/"
    Write-Host ""
    exit 1
}
