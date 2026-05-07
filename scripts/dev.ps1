$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$runtimeDir = Join-Path $root ".schoolhub"
$stateFile = Join-Path $runtimeDir "dev-session.json"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

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

if (!(Test-Path $runtimeDir)) {
  New-Item -ItemType Directory -Path $runtimeDir | Out-Null
}

if (Test-Path $stateFile) {
  try {
    $previous = Get-Content $stateFile | ConvertFrom-Json
    if ($previous.backendPid) { Stop-SchoolHubPid $previous.backendPid }
    if ($previous.frontendPid) { Stop-SchoolHubPid $previous.frontendPid }
    Start-Sleep -Seconds 1
  } catch {
    Write-Host "Previous SchoolHub session info could not be read. Starting fresh." -ForegroundColor Yellow
  }
}

$existingBackendPid = Get-ListenerPid 5000
$existingFrontendPid = Get-ListenerPid 5173
if ($existingBackendPid) { Stop-SchoolHubPid $existingBackendPid }
if ($existingFrontendPid) { Stop-SchoolHubPid $existingFrontendPid }
Start-Sleep -Seconds 1

$backendLog = Join-Path $runtimeDir ("backend-dev-" + $timestamp + ".log")
$frontendLog = Join-Path $runtimeDir ("frontend-dev-" + $timestamp + ".log")

$backend = Start-Process -FilePath "cmd.exe" `
  -ArgumentList "/c", "npm.cmd run dev > `"$backendLog`" 2>&1" `
  -WorkingDirectory (Join-Path $root "backend") `
  -PassThru

$frontend = Start-Process -FilePath "cmd.exe" `
  -ArgumentList "/c", "npm.cmd run dev > `"$frontendLog`" 2>&1" `
  -WorkingDirectory (Join-Path $root "frontend") `
  -PassThru

Write-Host "SchoolHub servers started." -ForegroundColor Green
Write-Host "Backend PID: $($backend.Id)" -ForegroundColor Yellow
Write-Host "Frontend PID: $($frontend.Id)" -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend URL: http://localhost:5000" -ForegroundColor Green
Write-Host "Backend log: $backendLog" -ForegroundColor Yellow
Write-Host "Frontend log: $frontendLog" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop them later, run:" -ForegroundColor White
Write-Host "npm run stop" -ForegroundColor Magenta

$session = @{
  backendPid = $null
  frontendPid = $null
  backendLog = $backendLog
  frontendLog = $frontendLog
  startedAt = (Get-Date).ToString("o")
}

Start-Sleep -Seconds 6

$session.backendPid = Get-ListenerPid 5000
$session.frontendPid = Get-ListenerPid 5173
$session | ConvertTo-Json | Set-Content -LiteralPath $stateFile

if (-not $session.backendPid -or -not $session.frontendPid) {
  Write-Host ""
  Write-Host "One or more SchoolHub servers did not bind to the expected ports." -ForegroundColor Red
  Write-Host "Check backend log: $backendLog" -ForegroundColor Yellow
  Write-Host "Check frontend log: $frontendLog" -ForegroundColor Yellow
  exit 1
}
