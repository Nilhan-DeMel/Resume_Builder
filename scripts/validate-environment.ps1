# Validate Environment (PowerShell)
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
. "$PSScriptRoot\_lib\print.ps1"

Print-Info "Step 1: Runtime Check"

$python = Get-Command python -ErrorAction SilentlyContinue
$python3 = Get-Command python3 -ErrorAction SilentlyContinue
$node = Get-Command node -ErrorAction SilentlyContinue

if ($python3) { Print-Pass "Python 3 found." }
elseif ($python) { Print-Pass "Python found." }
elseif ($node) { Print-Pass "Node.js found." }
else {
    Print-Fail "No Python or Node.js runtime found."
    Print-Info "NEXT ACTION: Install Python 3.10+ or Node.js 18+."
    exit 1
}

Print-Info "Step 2: Source Check"
if (Test-Path "$PSScriptRoot\..\src\index.html") {
    Print-Pass "src/index.html found."
}
else {
    Print-Fail "src/index.html missing."
    Print-Info "NEXT ACTION: Run from repository root or restore files."
    exit 1
}

Print-Info "Step 3: Port 8000 Check"
$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Print-Warn "Port 8000 is BUSY."
    Print-Info "NEXT ACTION: Stop existing server or expect launch failure."
}
else {
    Print-Pass "Port 8000 is FREE."
}

exit 0
