#!/bin/bash

# Migrate from npm to pnpm
# This script helps migrate the monorepo to use pnpm for better dependency management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}pnpm Migration Script${NC}"
echo "======================"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo -e "${RED}✗ pnpm is not installed${NC}"
  echo ""
  echo "Install pnpm:"
  echo "  npm install -g pnpm"
  echo "  or"
  echo "  brew install pnpm"
  exit 1
fi

echo -e "${GREEN}✓ pnpm is installed: $(pnpm --version)${NC}"
echo ""

# Check if .npmrc exists
if [ ! -f "$PROJECT_ROOT/.npmrc" ]; then
  echo -e "${YELLOW}⚠ .npmrc not found. Creating it...${NC}"
  cat > "$PROJECT_ROOT/.npmrc" << 'EOF'
# pnpm configuration for monorepo
# Prevent React from being hoisted to root
public-hoist-pattern[]=!react
public-hoist-pattern[]=!react-dom

# Still hoist common dev tools
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*typescript*
EOF
  echo -e "${GREEN}✓ Created .npmrc${NC}"
else
  echo -e "${GREEN}✓ .npmrc already exists${NC}"
fi

echo ""
echo -e "${BLUE}Step 1: Removing npm files...${NC}"
cd "$PROJECT_ROOT"
rm -rf node_modules apps/*/node_modules package-lock.json apps/*/package-lock.json 2>/dev/null || true
echo -e "${GREEN}✓ Removed npm files${NC}"

echo ""
echo -e "${BLUE}Step 3: Installing dependencies with pnpm...${NC}"
pnpm install

echo ""
echo -e "${BLUE}Step 4: Verifying React versions...${NC}"
cd "$PROJECT_ROOT/apps/mobile"
MOBILE_REACT=$(node -e "try { console.log(require('react/package.json').version) } catch(e) { console.log('not found') }" 2>/dev/null || echo "not found")
echo -e "${BLUE}Mobile app React: $MOBILE_REACT${NC}"

cd "$PROJECT_ROOT/apps/web"
WEB_REACT=$(node -e "try { console.log(require('react/package.json').version) } catch(e) { console.log('not found') }" 2>/dev/null || echo "not found")
echo -e "${BLUE}Web app React: $WEB_REACT${NC}"

echo ""
if [ "$MOBILE_REACT" = "19.1.0" ]; then
  echo -e "${GREEN}✓ Mobile app has React 19.1.0${NC}"
else
  echo -e "${YELLOW}⚠ Mobile app React version: $MOBILE_REACT (expected 19.1.0)${NC}"
  echo -e "${YELLOW}Installing React 19.1.0...${NC}"
  cd "$PROJECT_ROOT/apps/mobile"
  pnpm add react@19.1.0 react-dom@19.1.0 --save-exact
fi

echo ""
echo -e "${BLUE}Step 5: Fixing Expo dependencies...${NC}"
cd "$PROJECT_ROOT/apps/mobile"
# Remove @expo/metro-config if installed (should use expo/metro-config instead)
if pnpm list @expo/metro-config &>/dev/null; then
  echo -e "${YELLOW}Removing @expo/metro-config (should use expo/metro-config instead)...${NC}"
  pnpm remove @expo/metro-config
fi

# Verify metro.config.js uses expo/metro-config
if grep -q "@expo/metro-config" "$PROJECT_ROOT/apps/mobile/metro.config.js" 2>/dev/null; then
  echo -e "${YELLOW}Updating metro.config.js to use expo/metro-config...${NC}"
  sed -i '' 's/@expo\/metro-config/expo\/metro-config/g' "$PROJECT_ROOT/apps/mobile/metro.config.js"
fi

# Fix any version mismatches (if expo install is available)
if command -v expo &>/dev/null || npx expo --version &>/dev/null 2>&1; then
  echo -e "${BLUE}Checking Expo dependency versions...${NC}"
  npx expo install --check --fix || echo -e "${YELLOW}⚠ expo install failed, but continuing...${NC}"
fi

echo ""
echo -e "${BLUE}Step 6: Running expo-doctor...${NC}"
# Use pnpm dlx for pnpm compatibility (works better than npx with pnpm)
pnpm dlx expo-doctor

echo ""
echo -e "${GREEN}✓ Migration complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update scripts in package.json to use 'pnpm' instead of 'npm'"
echo "2. Update GitHub Actions workflows to use pnpm"
echo "3. Commit pnpm-lock.yaml (pnpm's lock file)"

