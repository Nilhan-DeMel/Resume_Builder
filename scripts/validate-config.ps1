# Validate Configuration (PowerShell)
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
. "$PSScriptRoot\_lib\print.ps1"

Print-Info "Validating Configuration..."

$repoRoot = Resolve-Path "$PSScriptRoot\.."
$DEMO_FILE = "$repoRoot\src\js\config\demo.js"
$INDEX_FILE = "$repoRoot\src\index.html"

# 1. Check DEMO_MODE
if (Test-Path $DEMO_FILE) {
    $demoContent = Get-Content $DEMO_FILE -Raw
    if ($demoContent -match "export const DEMO_MODE = true;") {
        Print-Pass "DEMO_MODE is ENABLED."
    }
    else {
        Print-Info "DEMO_MODE is DISABLED."
        # Check for placeholders
        $supabaseContent = Get-Content "$repoRoot\src\js\config\supabase.js" -Raw
        if ($supabaseContent -match "YOUR_SUPABASE") {
            Print-Fail "DEMO_MODE is false but placeholders found in supabase.js."
            Print-Info "NEXT ACTION: Edit src/js/config/supabase.js with real keys OR enable DEMO_MODE."
            exit 1
        }
    }
}
else {
    Print-Fail "Config file missing: $DEMO_FILE"
    exit 1
}

# 2. Check Index for UMD
if (Test-Path $INDEX_FILE) {
    $indexContent = Get-Content $INDEX_FILE -Raw
    if ($indexContent -match "cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js") {
        Print-Pass "Index uses UMD Supabase build."
    }
    else {
        Print-Warn "Index might be using ESM Supabase build (risk of 'export' error)."
        Print-Info "NEXT ACTION: Ensure index.html loads Supabase via UMD for local dev."
    }
}
else {
    Print-Fail "Index file missing: $INDEX_FILE"
    exit 1
}

exit 0
