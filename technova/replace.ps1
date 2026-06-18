$excludeDirs = @('node_modules', '.git', 'dist', 'build', '.gemini', 'artifacts')
$excludeExtensions = @('.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.webp')
$baseDir = "c:\Users\prajwal\OneDrive\Desktop\Business\technova"

function Process-Directory($dir) {
    if (-Not (Test-Path $dir)) { return }
    $items = Get-ChildItem -Path $dir
    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            if ($excludeDirs -notcontains $item.Name) {
                Process-Directory $item.FullName
            }
        } else {
            $ext = $item.Extension.ToLower()
            if ($excludeExtensions -notcontains $ext -and $item.Name -ne 'replace.ps1' -and $item.Name -ne 'replace.js' -and $item.Name -ne 'package-lock.json') {
                try {
                    $content = [System.IO.File]::ReadAllText($item.FullName, [System.Text.Encoding]::UTF8)
                    
                    # Mask credentials
                    $newContent = $content -replace 'admin@technova\.com', '__ADMIN_CRED_MASK__'
                    $newContent = $newContent -replace 'admin@velixora\.com', '__ADMIN_CRED_MASK2__'
                    $newContent = $newContent -replace 'client@technova\.com', '__CLIENT_CRED_MASK__'
                    $newContent = $newContent -replace 'client@velixora\.com', '__CLIENT_CRED_MASK2__'

                    # Main replacements
                    $newContent = $newContent -creplace 'Velixora', 'Tarkko'
                    $newContent = $newContent -creplace 'velixora', 'tarkko'
                    $newContent = $newContent -creplace 'VELIXORA', 'TARKKO'
                    $newContent = $newContent -creplace 'TechNova', 'Tarkko'
                    $newContent = $newContent -creplace 'technova_theme', 'tarkko_theme'
                    $newContent = $newContent -creplace 'support@technova\.in', 'support@tarkko.in'
                    $newContent = $newContent -creplace 'employee@technova\.com', 'employee@tarkko.com'
                    
                    # Fix logo text splits
                    $newContent = $newContent -creplace '>Velix<', '>Tark<'
                    $newContent = $newContent -creplace '>ora<', '>ko<'

                    # Unmask credentials
                    $newContent = $newContent -replace '__ADMIN_CRED_MASK__', 'admin@technova.com'
                    $newContent = $newContent -replace '__ADMIN_CRED_MASK2__', 'admin@velixora.com'
                    $newContent = $newContent -replace '__CLIENT_CRED_MASK__', 'client@technova.com'
                    $newContent = $newContent -replace '__CLIENT_CRED_MASK2__', 'client@velixora.com'
                    
                    if ($content -cne $newContent) {
                        [System.IO.File]::WriteAllText($item.FullName, $newContent, [System.Text.Encoding]::UTF8)
                        Write-Output "Updated: $($item.FullName)"
                    }
                } catch {
                    Write-Error "Failed to process $($item.FullName): $_"
                }
            }
        }
    }
}

Process-Directory "$baseDir\client"
Process-Directory "$baseDir\server"
$readme = "$baseDir\README.md"
if (Test-Path $readme) {
    $content = [System.IO.File]::ReadAllText($readme, [System.Text.Encoding]::UTF8)
    
    $newContent = $content -replace 'admin@technova\.com', '__ADMIN_CRED_MASK__'
    $newContent = $newContent -creplace 'Velixora', 'Tarkko'
    $newContent = $newContent -creplace 'velixora', 'tarkko'
    $newContent = $newContent -replace '__ADMIN_CRED_MASK__', 'admin@technova.com'
    
    if ($content -cne $newContent) {
        [System.IO.File]::WriteAllText($readme, $newContent, [System.Text.Encoding]::UTF8)
        Write-Output "Updated: $readme"
    }
}
Write-Output "Done."
