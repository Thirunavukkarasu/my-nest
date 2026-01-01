# Quick Start: Fix All Build Issues

If you're seeing errors from `expo-doctor`, run these commands in order:

## 1. Fix React Versions

```bash
npm run fix:react
```

Or manually:
```bash
cd apps/mobile
npx expo install react react-dom
```

## 2. Verify Fix

```bash
cd apps/mobile
npx expo doctor
```

## Expected Results

After running the fix:
- ✅ React version should match (19.1.0)
- ✅ React-DOM version should match (19.1.0)
- ⚠️ Duplicates may still show (often non-critical)

## If Duplicates Persist

Duplicates in nested `node_modules` (like `nativewind/node_modules`) are often:
- **Non-critical**: Don't affect builds
- **Expected**: Normal in monorepo setups
- **Build-time resolved**: EAS Build deduplicates during builds

## What Matters

- ✅ Direct dependencies match Expo SDK requirements
- ✅ Builds succeed
- ⚠️ `expo-doctor` warnings about nested duplicates are informational

## Related

- [React Version Fix](./REACT_VERSION_FIX.md)
- [Build Fixes](./BUILD_FIXES.md)
- [Duplicate Dependencies](./DUPLICATE_DEPS.md)

