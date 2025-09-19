#!/bin/bash

# alpha-update.sh
#
# A script to safely download and update the Alpha Hugo theme on Linux to the latest
# version from the GitHub repository.
#
# Author: oxypteros
# Version: 1.2.0
# License: MIT


# Configuration 
GITHUB_REPO="oxypteros/alpha"
THEME_DIR="alpha"

# Colors
C_BLUE="\033[0;34m"
C_GREEN="\033[0;32m"
C_RED="\033[0;31m"
C_YELLOW="\033[0;33m"
C_NC="\033[0m"

info()    { echo -e "${C_BLUE}INFO:${C_NC} $1"; }
success() { echo -e "${C_GREEN}SUCCESS:${C_NC} $1"; }
warn()    { echo -e "${C_YELLOW}WARNING:${C_NC} $1"; }
error()   { echo -e "${C_RED}ERROR:${C_NC} $1" >&2; exit 1; }

# Check for prerequisites
info "Checking for required tools (curl, unzip, jq)..."
for cmd in curl unzip jq; do
  if ! command -v "$cmd" &>/dev/null; then
    error "'$cmd' is not installed. Please install it (e.g., 'sudo apt-get install $cmd' or 'sudo dnf install $cmd')."
  fi
done
success "All required tools are present."

# Check for Hugo project context
info "Checking current directory..."
if [ ! -d "themes" ] || [ ! -d "content" ]; then
  error "This script must be run from the root of your Hugo project (must contain 'themes/' and 'content/')."
fi

if [ ! -d "themes/$THEME_DIR" ]; then
  warn "Theme directory 'themes/$THEME_DIR' not found."
  warn "If you're using Hugo Modules, update Alpha with:"
  echo -e "   ${C_GREEN}hugo mod get -u github.com/$GITHUB_REPO${C_NC}"
  exit 0
fi
success "Valid Hugo project detected."

# Fetch latest release info
info "Fetching the latest release info for Alpha..."
API_URL="https://api.github.com/repos/$GITHUB_REPO/releases/latest"
RELEASE_INFO=$(curl -s "$API_URL")

LATEST_VERSION=$(echo "$RELEASE_INFO" | jq -r '.tag_name')
DOWNLOAD_URL=$(echo "$RELEASE_INFO" | jq -r '.zipball_url')

if [ -z "$LATEST_VERSION" ] || [ "$LATEST_VERSION" == "null" ]; then
  error "Could not determine the latest version. GitHub API or network issue."
fi
info "Latest version: ${C_GREEN}${LATEST_VERSION}${C_NC}"

# Check current version
THEME_TOML_PATH="themes/$THEME_DIR/theme.toml"

if [ -f "$THEME_TOML_PATH" ]; then
  # Look for 'name =' before the first TOML table (like '[author]').
  NAME_LINE=$(awk '/^\[/{exit} /^\s*name\s*=/ {print}' "$THEME_TOML_PATH")

  # Extract the value by first removing the key part, then stripping any surrounding quotes.
  # Remove the key part, then strip quotes (backward compatibility)
  THEME_NAME=$(echo "$NAME_LINE" | sed -E 's/^\s*name\s*=\s*//' | sed -E "s/^['\"]|['\"]$//g")

  if [ -z "$THEME_NAME" ]; then
      error "Could not parse the theme name from '$THEME_TOML_PATH'. Aborting for safety."
  fi

  if [ "$THEME_NAME" != "$THEME_DIR" ]; then
    error "The theme name in '$THEME_TOML_PATH' ('$THEME_NAME') does not match the expected directory name ('$THEME_DIR'). Aborting for safety."
  fi

  # Read the version string.
  VERSION_LINE=$(grep -E '^\s*version\s*=' "$THEME_TOML_PATH")
  CURRENT_VERSION=$(echo "$VERSION_LINE" | sed -E 's/^\s*version\s*=\s*//' | sed -E "s/^['\"]|['\"]$//g")

  # Handle all cases based on the version check.
  if [ -z "$CURRENT_VERSION" ]; then
    warn "Verified Alpha theme, but could not read the 'version' field in theme.toml. Will attempt to update."
  elif [ "$CURRENT_VERSION" == "$LATEST_VERSION" ]; then
    success "You already have the latest version of Alpha (${CURRENT_VERSION}). No update needed."
    exit 0
  else
    info "Current version: ${CURRENT_VERSION} → Updating to ${LATEST_VERSION}"
  fi
else
  warn "Could not determine current version (theme.toml not found). Will attempt to update."
fi

# Backup current theme.
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="themes/${THEME_DIR}_backup_${TIMESTAMP}"
info "Backing up current theme to '$BACKUP_DIR'..."
cp -r "themes/$THEME_DIR" "$BACKUP_DIR" || error "Backup failed. Aborting."
success "Backup created successfully."

# Download latest release.
info "Downloading the latest version..."
TEMP_ZIP_FILE=$(mktemp)
curl -L -o "$TEMP_ZIP_FILE" "$DOWNLOAD_URL" || error "Download failed. Original theme is untouched."
success "Download complete."

# Unzip and install
info "Unzipping new version..."
TEMP_UNZIP_DIR=$(mktemp -d)
unzip -q "$TEMP_ZIP_FILE" -d "$TEMP_UNZIP_DIR" || error "Failed to unzip the downloaded file."

UNZIPPED_FOLDER=$(find "$TEMP_UNZIP_DIR" -mindepth 1 -maxdepth 1 -type d)
if [ -z "$UNZIPPED_FOLDER" ]; then
  error "Could not find unzipped theme folder. Aborting."
fi

rm -rf "themes/$THEME_DIR"
mv "$UNZIPPED_FOLDER" "themes/$THEME_DIR" || error "Failed to move new theme into place."
success "New version installed."

# Cleanup
info "Cleaning up..."
rm -f "$TEMP_ZIP_FILE"
rm -rf "$TEMP_UNZIP_DIR"
success "Cleanup complete."

echo ""
success "Alpha has been successfully updated to version ${LATEST_VERSION}!"
info "Backup saved at: ${BACKUP_DIR}"
warn "If you had custom edits in 'themes/alpha', merge them back from the backup."
