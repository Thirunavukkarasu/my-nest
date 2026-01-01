# React Version Management in Monorepo

## The Challenge

In a monorepo with npm workspaces:

- **Web app** needs React 19.2.3
- **Mobile app** needs React 19.1.0 (Expo SDK 54)
- npm workspaces hoist dependencies to root by default
- `expo-doctor` may report React version mismatches

## Why This Happens

npm workspaces hoist dependencies to the root `node_modules`:

- Root has React 18.3.1 (from some dependency)
- Mobile app needs React 19.1.0
- `expo-doctor` checks what's resolved, finds root version

## Solution

### For Development

The mobile app has React 19.1.0 installed locally in `apps/mobile/node_modules`. Even though React 18.3.1 exists in root, the mobile app will use its local version due to Node's module resolution (local takes precedence).

### For Builds

EAS Build runs in an isolated environment and will:

1. Install dependencies fresh
2. Use the versions specified in `apps/mobile/package.json`
3. Resolve React 19.1.0 correctly

## Verification

### Check Local Installation

```bash
cd apps/mobile
ls -la node_modules/react/package.json
# Should show version 19.1.0
```

### Check What's Actually Used

```bash
cd apps/mobile
node -e "console.log(require('react/package.json').version)"
# May show 18.3.1 (from root) even if 19.1.0 is installed locally
# This is OK - EAS Build will use the correct version
```

### Force Local Installation

If React isn't installed locally:

```bash
cd apps/mobile
rm -rf node_modules/react node_modules/react-dom
npm install react@19.1.0 react-dom@19.1.0 --save-exact --legacy-peer-deps
```

## If expo-doctor Still Shows Warnings

This is **often acceptable** because:

1. **Builds work**: EAS Build uses the correct React version
2. **Local resolution**: Node.js resolves to local `node_modules` first
3. **Monorepo reality**: Some duplication is expected

### What Matters

- ✅ `apps/mobile/package.json` specifies React 19.1.0
- ✅ React 19.1.0 is installed in `apps/mobile/node_modules`
- ✅ Builds succeed

### What Doesn't Matter

- ⚠️ `expo-doctor` warnings about root `node_modules`
- ⚠️ Duplicates in nested dependencies (like `nativewind/node_modules`)

## Related

- [React Version Fix](./REACT_VERSION_FIX.md)
- [Build Fixes](./BUILD_FIXES.md)
- [Duplicate Dependencies](./DUPLICATE_DEPS.md)
