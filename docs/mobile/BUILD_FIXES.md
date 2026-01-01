# Build Fixes

This document addresses common build issues and their solutions.

## Issues Fixed

### 1. `.expo` Directory Not Ignored

**Problem**: The `.expo` directory contains machine-specific files and should not be committed.

**Solution**: Added to root `.gitignore`:

```
.expo/
.expo-shared/
```

### 2. EAS CLI in Project Dependencies

**Problem**: `eas-cli` should not be installed as a project dependency. Use `npx` instead.

**Solution**: Removed `eas-cli` from `apps/mobile/package.json` devDependencies. All build scripts already use `npx eas-cli`.

### 3. Missing `react-native-css-interop`

**Problem**: NativeWind v4 requires `react-native-css-interop` to be explicitly installed.

**Error**:

```
Unable to resolve module react-native-css-interop/jsx-runtime
```

**Solution**: Added `react-native-css-interop` to dependencies:

```json
"react-native-css-interop": "^0.2.1"
```

### 4. Version Mismatch: react-native-reanimated

**Problem**: Expo SDK 54 requires `react-native-reanimated ~4.1.1`, but project had `~3.17.4`.

**Solution**: Updated to match Expo SDK:

```json
"react-native-reanimated": "~4.1.1"
```

### 5. Duplicate Dependencies

**Problem**: Monorepo structure causes duplicate dependencies at different levels, especially from:

- Root workspace `node_modules` (React 18.3.1 from web app)
- NativeWind's nested `node_modules` (React 19.2.3)

**Solution**: Added `overrides` at the **root** `package.json` level to force consistent versions across the entire monorepo:

```json
"overrides": {
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

This ensures that:

- React Native packages are consistent across all workspaces
- NativeWind's nested dependencies match the mobile app's versions
- No version conflicts during builds

## Next Steps

After making these changes:

1. **Clean install from root** (important for monorepo):

   ```bash
   # From project root
   rm -rf node_modules apps/*/node_modules package-lock.json apps/*/package-lock.json
   npm install
   ```

2. **Verify with expo doctor**:

   ```bash
   cd apps/mobile
   npx expo doctor
   ```

3. **If duplicates persist, try npm dedupe**:

   ```bash
   # From project root
   npm dedupe
   ```

4. **Try building again**:
   ```bash
   npm run build:apk:preview:local
   ```

## Note on Duplicate Dependencies

If `expo-doctor` still shows duplicates after these fixes, they may be:

- **Non-critical**: If they're in nested dependencies (like `nativewind/node_modules`), they might not affect builds
- **Expected in monorepos**: Some duplication is normal in workspace setups
- **Build-time resolved**: EAS Build will deduplicate during the build process

The important thing is that your direct dependencies match Expo SDK requirements.

## React Version Mismatch

If you see:

```
react      19.1.0    18.3.1
react-dom  19.1.0    18.3.1
```

**Fix**: Run `npx expo install react react-dom` in `apps/mobile` directory. See [React Version Fix](./REACT_VERSION_FIX.md) for details.

## Related Documentation

- [EAS Setup](./EAS_SETUP.md)
- [Local Build Guide](./LOCAL_BUILD.md)
- [Dependency Issues](https://expo.fyi/resolving-dependency-issues)
