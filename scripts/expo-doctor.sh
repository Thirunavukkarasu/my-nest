#!/bin/bash

# Run expo-doctor with proper package manager detection
# This script ensures expo-doctor works correctly with pnpm

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MOBILE_DIR="$PROJECT_ROOT/apps/mobile"

cd "$MOBILE_DIR"

# Detect package manager and run expo-doctor
if command -v pnpm &>/dev/null && [ -f "$PROJECT_ROOT/pnpm-lock.yaml" ]; then
  echo "Using pnpm..."
  pnpm dlx expo-doctor
elif command -v yarn &>/dev/null && [ -f "$PROJECT_ROOT/yarn.lock" ]; then
  echo "Using yarn..."
  yarn exec expo-doctor
else
  echo "Using npm..."
  npx expo-doctor
fi

