#requires -version 5.0
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- config ---
$RepoRoot   = (Resolve-Path ".").Path
$OutZip     = Join-Path $RepoRoot "repo-relevant.zip"

# Exclude any path segment matching these (case-insensitive)
$ExcludeDirNames = @(
  "node_modules",
  ".next",
  "dist",
  "build",
  "out",
  ".turbo",
  ".cache",
  ".git"
)

# Exclude files by name (you can add more)
$ExcludeFileNames = @(
  ".DS_Store"
)

# Optional: exclude by extension
$ExcludeExtensions = @(
  ".log"
)

# Optional: exclude entire top-level folders you don't want (e.g., Next apps)
# Example: exclude "apps/web" and "packages/next-ui"
$ExcludeTopLevelPaths = @(
  # "apps\web",
  # "packages\next-ui"
)

# --- helpers ---
function Should-ExcludePath {
  param([string]$FullPath)

  $rel = $FullPath.Substring($RepoRoot.Length).TrimStart('\','/')
  if ([string]::IsNullOrWhiteSpace($rel)) { return $true }

  # top-level path exclusion
  foreach ($p in $ExcludeTopLevelPaths) {
    if ($rel -like ($p.TrimEnd('\') + "\*") -or $rel -eq $p.TrimEnd('\')) { return $true }
  }

  # exclude dir segments anywhere in path
  foreach ($d in $ExcludeDirNames) {
    if ($rel -match "(^|[\\/])$([regex]::Escape($d))([\\/]|$)") { return $true }
  }

  $name = [IO.Path]::GetFileName($rel)
  if ($ExcludeFileNames -contains $name) { return $true }

  $ext = [IO.Path]::GetExtension($rel)
  if ($ExcludeExtensions -contains $ext) { return $true }

  return $false
}

# --- stage to temp ---
$stage = Join-Path ([IO.Path]::GetTempPath()) ("repo_stage_" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $stage | Out-Null

try {
  # Gather files (only files), then filter by path rules
  $files = Get-ChildItem -Path $RepoRoot -Recurse -File -Force |
           Where-Object { -not (Should-ExcludePath $_.FullName) }

  foreach ($f in $files) {
    $rel  = $f.FullName.Substring($RepoRoot.Length).TrimStart('\','/')
    $dest = Join-Path $stage $rel
    $destDir = Split-Path $dest -Parent
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    Copy-Item -LiteralPath $f.FullName -Destination $dest -Force
  }

  # Create zip
  if (Test-Path $OutZip) { Remove-Item $OutZip -Force }
  Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $OutZip -Force

  Write-Host "Created: $OutZip"
}
finally {
  # cleanup
  if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
}
