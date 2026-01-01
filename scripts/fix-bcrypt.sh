#!/bin/bash

# Fix bcrypt native module issues in pnpm monorepo
# This script rebuilds bcrypt and clears Next.js cache

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WEB_DIR="$PROJECT_ROOT/web"

echo -e "${BLUE}Fixing bcrypt native module issues...${NC}"
echo "================================"
echo ""

# Step 1: Reinstall dependencies with new hoisting pattern
echo -e "${BLUE}Step 1: Reinstalling dependencies...${NC}"
cd "$PROJECT_ROOT"
pnpm install
echo -e "${GREEN}✓ Dependencies reinstalled${NC}"
echo ""

# Step 2: Rebuild bcrypt
echo -e "${BLUE}Step 2: Rebuilding bcrypt...${NC}"
cd "$WEB_DIR"
pnpm rebuild bcrypt || echo -e "${YELLOW}⚠ bcrypt rebuild may have failed, but continuing...${NC}"
echo -e "${GREEN}✓ bcrypt rebuild attempted${NC}"
echo ""

# Step 3: Clear Next.js cache
echo -e "${BLUE}Step 3: Clearing Next.js cache...${NC}"
rm -rf "$WEB_DIR/.next"
echo -e "${GREEN}✓ Next.js cache cleared${NC}"
echo ""

echo -e "${GREEN}✓ Fix complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Make sure you have a .env.local file in web/ with:"
echo "   - POSTGRES_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL"
echo ""
echo "2. Start the dev server:"
echo "   cd web && pnpm dev"

