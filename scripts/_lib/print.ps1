function Print-Pass($msg) { Write-Host "[PASS] $msg" -ForegroundColor Green }
function Print-Fail($msg) { Write-Host "[FAIL] $msg" -ForegroundColor Red }
function Print-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Print-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }

Export-ModuleMember -Function Print-Pass, Print-Fail, Print-Warn, Print-Info
