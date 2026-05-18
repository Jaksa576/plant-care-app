$ErrorActionPreference = 'Stop'

$cwd = Get-Location
$branch = git branch --show-current

Write-Host "Working directory: $cwd"
Write-Host "git: $(git --version)"
Write-Host "node: $(node --version)"
Write-Host "npm: $(npm --version)"

if ([string]::IsNullOrWhiteSpace($branch)) {
  throw 'No current git branch detected.'
}

if ($branch -eq 'main') {
  throw 'Refusing to set up a Codex worktree on main. Create or switch to a named branch first.'
}

git fetch --prune origin

$rootEnvPath = 'C:\Code\plant-care-app\.env.local'
$worktreeEnvPath = Join-Path $cwd '.env.local'

if (-not (Test-Path -LiteralPath $worktreeEnvPath)) {
  if (-not (Test-Path -LiteralPath $rootEnvPath)) {
    throw "Missing .env.local in this worktree and at $rootEnvPath."
  }

  Copy-Item -LiteralPath $rootEnvPath -Destination $worktreeEnvPath
  Write-Host 'Copied .env.local from root repo into this worktree.'
}

$envContent = Get-Content -LiteralPath $worktreeEnvPath
$requiredKeys = @(
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
)

foreach ($key in $requiredKeys) {
  $hasKey = $envContent | Where-Object {
    $_ -match "^\s*$([regex]::Escape($key))\s*="
  }

  if (-not $hasKey) {
    throw ".env.local is missing required key: $key"
  }
}

Write-Host '.env.local contains required public Supabase keys.'

npm install

Write-Host 'Codex worktree setup complete.'
