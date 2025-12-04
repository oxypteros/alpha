<#
.SYNOPSIS
    A script to safely download and update the Alpha Hugo theme to the latest version.
.DESCRIPTION
    This script is for Windows users with PowerShell 7 or later. It checks the
    current version, creates a safe backup, and installs the latest release.
.AUTHOR
    oxypteros
.VERSION
    1.1.0
#>

# Configuration
$GithubRepo = "oxypteros/alpha"
$ThemeDir   = "alpha"

# Helper Functions
function Write-Info    { param($Message) Write-Host "INFO: $Message" -ForegroundColor Blue }
function Write-Success { param($Message) Write-Host "SUCCESS: $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "WARNING: $Message" -ForegroundColor Yellow }
function Write-Error   { param($Message) Write-Host "ERROR: $Message" -ForegroundColor Red; exit 1 }

# Check prerequisites.
# PowerShell 7+ has Invoke-RestMethod and Expand-Archive built-in.
Write-Info "Checking PowerShell version and environment..."
if ($PSVersionTable.PSVersion.Major -lt 7) {
    Write-Error "This script requires PowerShell 7 or newer. Please upgrade your PowerShell."
}
Write-Success "PowerShell version is compatible."

# Check current directory.
Write-Info "Checking current directory..."
if (-not (Test-Path -Path "themes") -or -not (Test-Path -Path "content")) {
    Write-Error "This script must be run from the root directory of your Hugo project."
}
if (-not (Test-Path -Path "themes/$ThemeDir")) {
    Write-Error "The theme directory 'themes/$ThemeDir' does not exist. This script is for updating, not installing."
}
Write-Success "Running in a valid Hugo project directory."

# Fetch the latest release information.
Write-Info "Fetching the latest release information for Alpha theme..."
$ApiUrl = "https://api.github.com/repos/$GithubRepo/releases/latest"
try {
    # Invoke-RestMethod automatically parses the JSON response into an object!!!
    $ReleaseInfo = Invoke-RestMethod -Uri $ApiUrl
} catch {
    Write-Error "Could not fetch release information. Check your network connection."
}
$LatestVersion = $ReleaseInfo.tag_name
$DownloadUrl = $ReleaseInfo.zipball_url

if (-not $LatestVersion) {
    Write-Error "Could not determine the latest version from the API response."
}
Write-Info "Latest version found: " -NoNewline
Write-Host "$LatestVersion" -ForegroundColor Green

# Verify theme and check current version.
$ThemeTomlPath = "themes/$ThemeDir/theme.toml"
if (Test-Path $ThemeTomlPath) {
    # Corrected line for 'name' to handle both single and double quotes
    # Using a double-quoted string for the pattern and escaping the internal double quote
    $ThemeNameLine = Get-Content $ThemeTomlPath | Select-String -Pattern "^\s*name\s*=\s*['`"]?" | Select-Object -First 1
    $ThemeName = $ThemeNameLine -replace "^\s*name\s*=\s*['`"]?" -replace "['`"]?\s*$"
    
    if ($ThemeName -ne $ThemeDir) {
        Write-Error "The theme name in '$ThemeTomlPath' ('$ThemeName') does not match the directory name ('$ThemeDir'). Aborting."
    }

    # Corrected line for 'version' to handle both single and double quotes
    # Using a double-quoted string for the pattern and escaping the internal double quote
    $VersionLine = Get-Content $ThemeTomlPath | Select-String -Pattern "^\s*version\s*=\s*['`"]?" | Select-Object -First 1
    $CurrentVersion = $VersionLine -replace "^\s*version\s*=\s*['`"]?" -replace "['`"]?\s*$"

    if (-not $CurrentVersion) {
        Write-Warning "Verified Alpha theme, but could not read the 'version' field. Will attempt to update."
    } elseif ($CurrentVersion -eq $LatestVersion) {
        Write-Success "You already have the latest version of Alpha ($CurrentVersion). No update needed."
        exit 0
    } else {
        Write-Info "Current version: $CurrentVersion → Updating to $LatestVersion"
    }
} else {
    Write-Warning "Could not determine current version (theme.toml not found). Will attempt to update."
}

# Backup current theme.
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = "themes/${ThemeDir}_backup_${Timestamp}"
Write-Info "Backing up current theme to '$BackupDir'..."
Copy-Item -Path "themes/$ThemeDir" -Destination $BackupDir -Recurse -Force -ErrorAction Stop
Write-Success "Backup created successfully."

# Download latest release.
Write-Info "Downloading the latest version..."
$TempZipFile = [System.IO.Path]::GetTempFileName()
try {
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $TempZipFile -ErrorAction Stop
} catch {
    Write-Error "Download failed. Your original theme has been backed up. Please try again."
}
Write-Success "Download complete."

# Unzip and install.
Write-Info "Unzipping and installing the new version..."
$TempUnzipDir = New-Item -ItemType Directory -Path (Join-Path $env:TEMP ([System.Guid]::NewGuid().ToString()))
Expand-Archive -Path $TempZipFile -DestinationPath $TempUnzipDir -ErrorAction Stop
$UnzippedFolder = Get-ChildItem -Path $TempUnzipDir | Select-Object -First 1
if (-not $UnzippedFolder) {
    Write-Error "Could not find unzipped theme folder. Aborting."
}
# Remove the old theme and move the new one into place
Remove-Item -Path "themes/$ThemeDir" -Recurse -Force
Move-Item -Path $UnzippedFolder.FullName -Destination "themes/$ThemeDir" -ErrorAction Stop
Write-Success "New version installed."

# Cleanup
Write-Info "Cleaning up temporary files..."
Remove-Item -Path $TempZipFile -Force
Remove-Item -Path $TempUnzipDir -Recurse -Force
Write-Success "Cleanup complete."

Write-Host ""
Write-Success "Alpha theme has been successfully updated to version $LatestVersion!"
Write-Info "Backup saved at: $BackupDir"
Write-Warning "If you had custom edits in 'themes/alpha', merge them back from the backup."