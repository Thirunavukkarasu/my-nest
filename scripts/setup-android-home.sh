#!/bin/bash

# Setup Android SDK Home Environment Variable
# This script detects Android SDK location and adds it to your shell configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Android SDK Setup Script${NC}"
echo "================================"
echo ""

# Detect Android SDK location
ANDROID_SDK_PATHS=(
  "$HOME/Library/Android/sdk"  # macOS default
  "$HOME/Android/Sdk"          # Linux default
  "/opt/android-sdk"          # Alternative Linux
  "/usr/local/android-sdk"    # Alternative macOS
)

ANDROID_HOME=""
for path in "${ANDROID_SDK_PATHS[@]}"; do
  if [ -d "$path" ]; then
    ANDROID_HOME="$path"
    echo -e "${GREEN}✓ Found Android SDK at: $ANDROID_HOME${NC}"
    break
  fi
done

# If not found, prompt user
if [ -z "$ANDROID_HOME" ]; then
  echo -e "${YELLOW}⚠ Android SDK not found in common locations.${NC}"
  echo ""
  echo "Please enter your Android SDK path (or press Enter to skip):"
  read -r custom_path
  
  if [ -n "$custom_path" ] && [ -d "$custom_path" ]; then
    ANDROID_HOME="$custom_path"
    echo -e "${GREEN}✓ Using custom path: $ANDROID_HOME${NC}"
  else
    echo -e "${RED}✗ Android SDK not found.${NC}"
    echo ""
    echo "To install Android SDK:"
    echo "1. Download Android Studio from https://developer.android.com/studio"
    echo "2. Install Android Studio and open it"
    echo "3. Go through the setup wizard to install Android SDK"
    echo "4. Run this script again"
    exit 1
  fi
fi

# Detect shell configuration file
SHELL_CONFIG=""
# Check $SHELL environment variable first (most reliable)
if [[ "$SHELL" == *"zsh"* ]]; then
  SHELL_CONFIG="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
  SHELL_CONFIG="$HOME/.bashrc"
elif [ -n "$ZSH_VERSION" ]; then
  SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
  SHELL_CONFIG="$HOME/.bashrc"
else
  echo -e "${YELLOW}⚠ Could not detect shell. Defaulting to ~/.zshrc${NC}"
  SHELL_CONFIG="$HOME/.zshrc"
fi

echo -e "${BLUE}Detected shell: $SHELL${NC}"
echo -e "${BLUE}Using config file: $SHELL_CONFIG${NC}"

# Check if ANDROID_HOME is already set
if grep -q "ANDROID_HOME" "$SHELL_CONFIG" 2>/dev/null; then
  echo -e "${YELLOW}⚠ ANDROID_HOME already configured in $SHELL_CONFIG${NC}"
  echo ""
  read -p "Do you want to update it? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipping update."
    exit 0
  fi
  # Remove old ANDROID_HOME entries
  sed -i.bak '/ANDROID_HOME/d' "$SHELL_CONFIG"
fi

# Add ANDROID_HOME to shell config
echo "" >> "$SHELL_CONFIG"
echo "# Android SDK" >> "$SHELL_CONFIG"
echo "export ANDROID_HOME=\"$ANDROID_HOME\"" >> "$SHELL_CONFIG"
echo "export PATH=\"\$PATH:\$ANDROID_HOME/emulator\"" >> "$SHELL_CONFIG"
echo "export PATH=\"\$PATH:\$ANDROID_HOME/platform-tools\"" >> "$SHELL_CONFIG"
echo "export PATH=\"\$PATH:\$ANDROID_HOME/tools\"" >> "$SHELL_CONFIG"
echo "export PATH=\"\$PATH:\$ANDROID_HOME/tools/bin\"" >> "$SHELL_CONFIG"

echo ""
echo -e "${GREEN}✓ Android SDK configuration added to $SHELL_CONFIG${NC}"
echo ""
echo "To apply the changes, run:"
echo -e "${YELLOW}  source $SHELL_CONFIG${NC}"
echo ""
echo "Or restart your terminal."

# Verify setup
echo "Verifying setup..."
if [ -d "$ANDROID_HOME/platform-tools" ]; then
  echo -e "${GREEN}✓ Android SDK platform-tools found${NC}"
else
  echo -e "${YELLOW}⚠ Android SDK platform-tools not found${NC}"
  echo "You may need to install Android SDK Platform-Tools via Android Studio"
fi

if [ -f "$ANDROID_HOME/platform-tools/adb" ]; then
  echo -e "${GREEN}✓ ADB found${NC}"
else
  echo -e "${YELLOW}⚠ ADB not found${NC}"
fi

echo ""
echo -e "${GREEN}Setup complete!${NC}"

