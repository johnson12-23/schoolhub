$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$stateFile = Join-Path (Join-Path $root ".schoolhub") "dev-session.json"

function Get-ListenerPid([int]$Port) {
  $match = netstat -ano | Select-String "LISTENING\s+(\d+)$" | Where-Object { $_.Line -match ":$Port\s" } | Select-Object -First 1
  if ($match -and $match.Matches.Count -gt 0) {
    return [int]$match.Matches[0].Groups[1].Value
  }

  return $null
}

function Stop-SchoolHubPid([int]$TargetPid) {
  if ($TargetPid) {
    cmd.exe /c "taskkill /PID $TargetPid /T /F" | Out-Null
  }
}

try {
  if (Test-Path $stateFile) {
    $session = Get-Content $stateFile | ConvertFrom-Json
    if ($session.backendPid) { Stop-SchoolHubPid $session.backendPid }
    if ($session.frontendPid) { Stop-SchoolHubPid $session.frontendPid }
    Remove-Item -LiteralPath $stateFile -Force -ErrorAction SilentlyContinue
  }

  $backendPid = Get-ListenerPid 5000
  $frontendPid = Get-ListenerPid 5173
  if ($backendPid) { Stop-SchoolHubPid $backendPid }
  if ($frontendPid) { Stop-SchoolHubPid $frontendPid }

  Write-Host "SchoolHub dev servers stopped." -ForegroundColor Green
} catch {
  Write-Host "SchoolHub dev session could not be stopped cleanly." -ForegroundColor Red
  throw
}
