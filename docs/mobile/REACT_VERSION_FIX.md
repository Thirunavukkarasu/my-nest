# React Version Mismatch Fix

## Issue

`expo-doctor` reports:
```
package    expected  found   
react      19.1.0    18.3.1  
react-dom  19.1.0    18.3.1  
```

This happens because:
1. Root `node_modules` has React 18.3.1 (from web app or other dependencies)
2. npm workspaces hoist dependencies to root by default
3. The mobile app needs React 19.1.0 but resolves React 18.3.1 from root

**Solution**: React 19.1.0 is installed locally in `apps/mobile/node_modules`. Even though React 18.3.1 exists in root `node_modules`, Node.js module resolution prioritizes local versions, so the mobile app uses React 19.1.0 correctly.

**Note**: `public-hoist-pattern` is a pnpm feature, not available in npm. See [Monorepo React Management](./MONOREPO_REACT.md) for details.

## Solution

### Option 1: Use the Fix Script (Easiest)

Run from project root:

```bash
npm run fix:react
```

This script ensures React 19.1.0 is installed locally in the mobile app.

### Option 2: Manual Fix

```bash
cd apps/mobile
rm -rf node_modules/react node_modules/react-dom
npm install react@19.1.0 react-dom@19.1.0 --save-exact
npx expo install react react-dom
```

This installs React 19.1.0 locally in `apps/mobile/node_modules`.

## Important Note

Even after fixing, `expo-doctor` may still show warnings because:
- React 18.3.1 exists in root `node_modules` (from web app)
- `expo-doctor` checks what's resolved, not what's actually used

**However**, Node.js module resolution prioritizes local `node_modules`, so the mobile app will use React 19.1.0 correctly. See [Monorepo React Management](./MONOREPO_REACT.md) for details.

### Option 2: Clean Reinstall with Overrides

If Option 1 doesn't work:

```bash
# From project root
rm -rf node_modules apps/*/node_modules package-lock.json apps/*/package-lock.json

# Reinstall (overrides will apply)
npm install

# Verify
cd apps/mobile
npx expo doctor
```

### Option 3: Force Install in Mobile App

If the above don't work, force install in the mobile app:

```bash
cd apps/mobile
rm -rf node_modules package-lock.json
npm install react@19.1.0 react-dom@19.1.0 --save-exact
npm install
```

## Verify Fix

After applying the fix:

```bash
cd apps/mobile
npx expo doctor
```

Should show:
- ✅ React version matches (19.1.0)
- ✅ React-DOM version matches (19.1.0)
- ⚠️ Duplicates may still show (often non-critical)

## Why This Happens

In npm workspaces:
- Root `node_modules` can have different versions
- Workspaces resolve dependencies from root first
- Overrides need a clean reinstall to take effect

## Related

- [Build Fixes](./BUILD_FIXES.md)
- [Duplicate Dependencies](./DUPLICATE_DEPS.md)

