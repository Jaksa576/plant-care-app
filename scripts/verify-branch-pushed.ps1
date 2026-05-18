param(
  [switch]$AllowMain
)

$ErrorActionPreference = 'Stop'

$branch = git branch --show-current

if ([string]::IsNullOrWhiteSpace($branch)) {
  throw 'No current git branch detected.'
}

if ($branch -eq 'main' -and -not $AllowMain) {
  throw 'Refusing to verify main without -AllowMain.'
}

$dirty = git status --porcelain
if ($dirty) {
  throw "Uncommitted changes are present. Commit or discard them before verifying push status.`n$dirty"
}

git fetch --prune origin

$upstream = git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($upstream)) {
  throw "Branch '$branch' has no upstream. Push with: git push -u origin $branch"
}

$localHead = git rev-parse HEAD
$upstreamHead = git rev-parse '@{u}'
$aheadCount = [int](git rev-list --count '@{u}..HEAD')

if ($aheadCount -gt 0) {
  throw "Branch '$branch' is ahead of upstream '$upstream' by $aheadCount commit(s). Push before reporting completion."
}

git merge-base --is-ancestor HEAD '@{u}'
if ($LASTEXITCODE -ne 0) {
  throw "Local HEAD $localHead is not contained in upstream '$upstream' ($upstreamHead)."
}

Write-Host "Branch '$branch' is clean and pushed to '$upstream' at $localHead."
