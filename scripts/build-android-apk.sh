#!/bin/bash

# Build Android APK Script
# This script builds Android APK using EAS Build with proper checks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MOBILE_DIR="$PROJECT_ROOT/mobile"

# Default values
BUILD_TYPE="production"
LOCAL_BUILD=false
PROFILE="production"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --preview)
      BUILD_TYPE="preview"
      PROFILE="preview"
      shift
      ;;
    --production)
      BUILD_TYPE="production"
      PROFILE="production"
      shift
      ;;
    --local)
      LOCAL_BUILD=true
      shift
      ;;
    --cloud)
      LOCAL_BUILD=false
      shift
      ;;
    -h|--help)
      echo "Build Android APK Script"
      echo ""
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --preview       Build preview APK (default: production)"
      echo "  --production    Build production APK (default)"
      echo "  --local         Build locally (requires Android SDK)"
      echo "  --cloud         Build on EAS servers (default)"
      echo "  -h, --help      Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0                    # Build production APK on cloud"
      echo "  $0 --preview           # Build preview APK on cloud"
      echo "  $0 --local             # Build production APK locally"
      echo "  $0 --preview --local  # Build preview APK locally"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}Android APK Build Script${NC}"
echo "=============================="
echo ""
echo "Build Type: $BUILD_TYPE"
echo "Build Location: $([ "$LOCAL_BUILD" = true ] && echo "Local" || echo "Cloud (EAS)")"
echo ""

# Check if we're in the right directory
if [ ! -f "$MOBILE_DIR/package.json" ]; then
  echo -e "${RED}✗ Error: Mobile app directory not found at $MOBILE_DIR${NC}"
  exit 1
fi

# Change to mobile directory
cd "$MOBILE_DIR"

# Check if EAS is configured
if [ ! -f "eas.json" ]; then
  echo -e "${RED}✗ Error: eas.json not found${NC}"
  echo ""
  echo "Please configure EAS first:"
  echo "  cd mobile"
  echo "  npx eas-cli build:configure"
  exit 1
fi

# Check if user is logged in to EAS (only for cloud builds)
if [ "$LOCAL_BUILD" = false ]; then
  if ! npx eas-cli whoami &>/dev/null; then
    echo -e "${YELLOW}⚠ Not logged in to EAS${NC}"
    echo ""
    echo "Please login to EAS:"
    echo "  npx eas-cli login"
    exit 1
  fi
fi

# For local builds, check Android SDK
if [ "$LOCAL_BUILD" = true ]; then
  if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}✗ Error: ANDROID_HOME environment variable not set${NC}"
    echo ""
    echo "Please set up Android SDK first:"
    echo "  1. Run: ./scripts/setup-android-home.sh"
    echo "  2. Or manually set ANDROID_HOME in your shell config"
    echo ""
    echo "See docs/mobile/ANDROID_SDK_SETUP.md for detailed instructions"
    exit 1
  fi

  if [ ! -d "$ANDROID_HOME" ]; then
    echo -e "${RED}✗ Error: Android SDK not found at $ANDROID_HOME${NC}"
    exit 1
  fi

  echo -e "${GREEN}✓ Android SDK found at: $ANDROID_HOME${NC}"
fi

# Check Node.js and npm
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Error: Node.js not found${NC}"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ Error: npm not found${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

# Detect package manager
if command -v pnpm &> /dev/null && [ -f "../../pnpm-lock.yaml" ]; then
  PACKAGE_MANAGER="pnpm"
elif command -v yarn &> /dev/null && [ -f "../../yarn.lock" ]; then
  PACKAGE_MANAGER="yarn"
else
  PACKAGE_MANAGER="npm"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo ""
  echo "Installing dependencies with $PACKAGE_MANAGER..."
  if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm install
  elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn install
  else
    npm install
  fi
fi

# Build command
BUILD_CMD="npx eas-cli build --platform android --profile $PROFILE"

if [ "$LOCAL_BUILD" = true ]; then
  BUILD_CMD="$BUILD_CMD --local"
fi

echo ""
echo -e "${BLUE}Starting build...${NC}"
echo "Command: $BUILD_CMD"
echo ""

# Execute build
if eval "$BUILD_CMD"; then
  echo ""
  echo -e "${GREEN}✓ Build completed successfully!${NC}"
  
  if [ "$LOCAL_BUILD" = true ]; then
    echo ""
    echo "APK location: Check the output above for the build path"
  else
    echo ""
    echo "APK is available on Expo dashboard:"
    echo "  https://expo.dev/accounts/[your-account]/projects/[project-id]/builds"
  fi
else
  echo ""
  echo -e "${RED}✗ Build failed${NC}"
  exit 1
fi

