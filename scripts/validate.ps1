$ErrorActionPreference = 'Stop'

$branch = git branch --show-current
$cwd = Get-Location

if ([string]::IsNullOrWhiteSpace($branch)) {
  throw 'No current git branch detected.'
}

Write-Host "Working directory: $cwd"
Write-Host "Current branch: $branch"
Write-Host 'Running standard validation: npm run check'

npm run check

Write-Host 'Validation passed.'
