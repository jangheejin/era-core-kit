# PowerShell 5 compatible
$ErrorActionPreference = "Stop"

$mode = "dry"  # change to "move" to actually move files
$reportPath = "knip.site.files.json"
$siteRoot = "apps/site"
$archiveRoot = "apps/site/__archive__"

if (-not (Test-Path $reportPath)) {
  throw "Missing $reportPath. Run knip JSON report first."
}

# Read JSON (Knip output can be an array of findings, or an object with sections)
$jsonText = Get-Content -Raw $reportPath
$report = $jsonText | ConvertFrom-Json

# Extract unused files list robustly
$unused = @()

function Add-Files($maybeFiles) {
  if ($null -eq $maybeFiles) { return }
  if ($maybeFiles -is [System.Array]) {
    $unused += $maybeFiles
  } else {
    $unused += @($maybeFiles)
  }
}

if ($report -is [System.Array]) {
  foreach ($item in $report) {
    # Most common: item.files is an array of relative paths
    if ($item.PSObject.Properties.Name -contains "files") {
      Add-Files $item.files
    }
  }
} else {
  # Alternate shapes: report.files directly
  if ($report.PSObject.Properties.Name -contains "files") {
    Add-Files $report.files
  }
}

$unused = $unused | Where-Object { $_ -and ($_ -is [string]) } | Sort-Object -Unique

if ($unused.Count -eq 0) {
  Write-Host "No unused files found in report (or report format didn't include .files)."
  Write-Host "Open $reportPath and confirm it contains a 'files' section."
  exit 0
}

Write-Host "Found $($unused.Count) unused files."
Write-Host ""

# DRY RUN output
Write-Host "--- DRY RUN ---"
foreach ($rel in $unused) {
  Write-Host ("MOVE {0}/{1} -> {2}/{1}" -f $siteRoot, $rel, $archiveRoot)
}

if ($mode -ne "move") {
  Write-Host ""
  Write-Host "Dry run only. To execute, set `$mode = `"move`" at top of script."
  exit 0
}

# Ensure archive root exists
New-Item -ItemType Directory -Force $archiveRoot | Out-Null

foreach ($rel in $unused) {
  $srcGit = "$siteRoot/$rel"
  $dstGit = "$archiveRoot/$rel"

  # Create destination directory
  $dstDir = Split-Path ($dstGit -replace '/', '\') -Parent
  if ($dstDir -and -not (Test-Path $dstDir)) {
    New-Item -ItemType Directory -Force $dstDir | Out-Null
  }

  # Prefer git mv if file is tracked
  git ls-files --error-unmatch -- $srcGit 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) {
    git mv -- $srcGit $dstGit
  } else {
    # Untracked file fallback
    $srcWin = $srcGit -replace '/', '\'
    $dstWin = $dstGit -replace '/', '\'
    if (Test-Path $srcWin) {
      Move-Item -Force $srcWin $dstWin
    }
  }
}

Write-Host ""
Write-Host "Done. Review changes:"
Write-Host "  git status"
