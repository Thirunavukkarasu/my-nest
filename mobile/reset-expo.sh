#!/bin/bash

# Reset Expo and Metro Bundler Cache
# This script clears all caches and restarts Expo with a clean slate

echo "🧹 Clearing Expo and Metro caches..."

# Stop any running Metro bundler processes
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true

# Clear Expo cache
rm -rf .expo

# Clear Metro bundler cache
rm -rf node_modules/.cache
rm -rf metro.config.js.cache

# Clear Watchman cache (if installed)
watchman watch-del-all 2>/dev/null || true

# Clear npm/pnpm cache (optional, uncomment if needed)
# pnpm store prune 2>/dev/null || true

# Clear React Native cache
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true

echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting Expo with cleared cache..."
echo ""

# Start Expo with cleared cache
npx expo start --clear

