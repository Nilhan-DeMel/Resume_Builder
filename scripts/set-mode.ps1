# Set Mode (PowerShell)
param (
    [Parameter(Mandatory = $true)]
    [ValidateSet("demo", "production")]
    [string]$Mode
)

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
. "$PSScriptRoot\_lib\print.ps1"

$repoRoot = Resolve-Path "$PSScriptRoot\.."
$DEMO_FILE = "$repoRoot\src\js\config\demo.js"

Print-Info "Switching to $Mode mode..."

$content = Get-Content $DEMO_FILE -Raw
if ($Mode -eq "demo") {
    $newContent = $content -replace "export const DEMO_MODE = false;", "export const DEMO_MODE = true;"
}
else {
    $newContent = $content -replace "export const DEMO_MODE = true;", "export const DEMO_MODE = false;"
}

Set-Content $DEMO_FILE $newContent -NoNewline

# Verify
$finalContent = Get-Content $DEMO_FILE -Raw
if ($Mode -eq "demo" -and $finalContent -match "true") {
    Print-Pass "Mode set to DEMO."
}
elseif ($Mode -eq "production" -and $finalContent -match "false") {
    Print-Pass "Mode set to PRODUCTION."
}
else {
    Print-Fail "Failed to switch mode. Check file content."
    exit 1
}

exit 0
