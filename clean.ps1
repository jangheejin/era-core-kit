Write-Host "🔄 Cleaning node_modules, dist folders, build artifacts..."

# Helper function to remove a path if it exists
function Remove-IfExists($Path) {
    if (Test-Path $Path) {
        Remove-Item $Path -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Successfully Removed $Path"
    }
}

# Clean root-level files
Remove-IfExists "node_modules"
Remove-IfExists "pnpm-lock.yaml"
Remove-IfExists ".turbo"

# Clean dist/.next in apps/
Get-ChildItem -Path "apps" -Recurse -Directory -Force | Where-Object {
    $_.Name -eq "dist" -or $_.Name -eq ".next"
} | ForEach-Object {
    Remove-IfExists $_.FullName
}

# Clean dist folders in packages/
Get-ChildItem -Path "packages" -Recurse -Directory -Force | Where-Object {
    $_.Name -eq "dist"
} | ForEach-Object {
    Remove-IfExists $_.FullName
}

Write-Host "`n Success! Monorepo cleanup complete."
