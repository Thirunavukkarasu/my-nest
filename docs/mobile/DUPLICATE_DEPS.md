# Duplicate Dependencies in Monorepo

## Issue

`expo-doctor` reports duplicate dependencies even after adding `overrides`. This is common in monorepos and may not always be resolvable.

## Why This Happens

1. **Monorepo Structure**: Different workspaces (web, mobile) may need different versions
2. **Nested Dependencies**: Packages like NativeWind bundle their own dependencies
3. **npm Workspaces**: Each workspace can have its own `node_modules`

## Current Duplicates

The duplicates come from:
- `../../node_modules/react` - Root workspace (from web app)
- `../../node_modules/nativewind/node_modules/react` - NativeWind's nested dependencies

## Solution Applied

Added `overrides` at root level to force consistent versions:

```json
"overrides": {
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-native": "0.81.5",
  "react-native-reanimated": "~4.1.1",
  "react-native-worklets": "0.5.1",
  "nativewind": {
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-reanimated": "~4.1.1",
    "react-native-worklets": "0.5.1"
  }
}
```

## After Adding Overrides

1. **Clean reinstall**:
   ```bash
   rm -rf node_modules apps/*/node_modules package-lock.json apps/*/package-lock.json
   npm install
   ```

2. **Try deduplication**:
   ```bash
   npm dedupe
   ```

3. **Verify**:
   ```bash
   cd apps/mobile
   npx expo doctor
   ```

## If Duplicates Persist

**This is often acceptable** because:

1. **Build-time resolution**: EAS Build deduplicates during the build process
2. **Non-critical**: Nested dependencies in `node_modules/nativewind/node_modules` don't affect the final build
3. **Monorepo reality**: Some duplication is expected in workspace setups

### What Matters

- ✅ Your direct dependencies match Expo SDK requirements
- ✅ No version conflicts in your `apps/mobile/package.json`
- ✅ Builds succeed

### What Doesn't Matter

- ⚠️ Duplicates in nested `node_modules` (like `nativewind/node_modules`)
- ⚠️ Duplicates in root `node_modules` (from other workspaces)

## Testing

If builds work, the duplicates are non-critical. The `expo-doctor` warning is informational, not blocking.

## Related

- [Build Fixes](./BUILD_FIXES.md)
- [Expo Dependency Resolution](https://expo.fyi/resolving-dependency-issues)

