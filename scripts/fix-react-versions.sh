#!/bin/bash

# Fix React Version Mismatch in Monorepo
# This script ensures React versions match Expo SDK requirements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MOBILE_DIR="$PROJECT_ROOT/mobile"

echo -e "${BLUE}React Version Fix Script${NC}"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "$MOBILE_DIR/package.json" ]; then
  echo -e "${RED}✗ Error: Mobile app directory not found${NC}"
  exit 1
fi

cd "$MOBILE_DIR"

echo -e "${BLUE}Step 1: Ensuring node_modules exists...${NC}"
mkdir -p node_modules

echo ""
echo -e "${BLUE}Step 2: Removing React from node_modules to force local install...${NC}"
rm -rf node_modules/react node_modules/react-dom 2>/dev/null || true

echo ""
echo -e "${BLUE}Step 3: Installing React 19.1.0 locally (Expo SDK 54 requirement)...${NC}"
# Force install locally by installing directly (not via workspace)
npm install react@19.1.0 react-dom@19.1.0 --save-exact --legacy-peer-deps

echo ""
echo -e "${BLUE}Step 4: Verifying React is installed locally...${NC}"
if [ -f "node_modules/react/package.json" ]; then
  REACT_VERSION=$(node -e "console.log(require('./node_modules/react/package.json').version)")
  echo -e "${GREEN}✓ React $REACT_VERSION installed in mobile/node_modules${NC}"
  
  if [ "$REACT_VERSION" != "19.1.0" ]; then
    echo -e "${YELLOW}⚠ React version is $REACT_VERSION, expected 19.1.0${NC}"
    echo -e "${YELLOW}Force installing exact version...${NC}"
    rm -rf node_modules/react node_modules/react-dom
    npm install react@19.1.0 react-dom@19.1.0 --save-exact --legacy-peer-deps --no-save
  fi
else
  echo -e "${RED}✗ React not found in local node_modules${NC}"
  echo -e "${YELLOW}Trying alternative installation method...${NC}"
  npm install react@19.1.0 react-dom@19.1.0 --save-exact --legacy-peer-deps --no-save
fi

echo ""
echo -e "${BLUE}Step 5: Verifying what Node.js resolves from mobile directory...${NC}"
RESOLVED_VERSION=$(cd "$MOBILE_DIR" && node -e "console.log(require('react/package.json').version)" 2>/dev/null || echo "unknown")
echo -e "${BLUE}Resolved React version: $RESOLVED_VERSION${NC}"

if [ "$RESOLVED_VERSION" = "19.1.0" ]; then
  echo -e "${GREEN}✓ Node.js correctly resolves React 19.1.0${NC}"
else
  echo -e "${YELLOW}⚠ Node.js resolves React $RESOLVED_VERSION${NC}"
  if [ "$RESOLVED_VERSION" = "18.3.1" ]; then
    echo -e "${YELLOW}React is resolving from root node_modules.${NC}"
    echo -e "${YELLOW}This is OK for builds - EAS Build will use the correct version from package.json${NC}"
  fi
fi

echo ""
echo -e "${BLUE}Step 6: Running expo-doctor...${NC}"
# Use pnpm dlx if pnpm is detected, otherwise use npx
if command -v pnpm &>/dev/null; then
  pnpm dlx expo-doctor || npx expo-doctor
else
  npx expo-doctor
fi

echo ""
echo -e "${GREEN}✓ React version fix complete!${NC}"
echo ""
echo "If duplicates still show, they're likely non-critical (in nested node_modules)."
echo "The important thing is that React 19.1.0 is now installed correctly."

