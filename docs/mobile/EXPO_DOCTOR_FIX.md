# Fixing expo-doctor Package Version Mismatch

## Why expo-doctor Fails

`expo-doctor` checks that all Expo-related packages match the exact versions required by your Expo SDK version (SDK 54 in this case). It fails when:

1. **Package versions don't match SDK requirements** - Some packages might be slightly off
2. **Monorepo structure** - In monorepos, `expo-doctor` may detect versions from different workspaces
3. **pnpm's node_modules structure** - pnpm's symlink structure can confuse version detection

## Check Which Packages Are Mismatched

Run this to see detailed information:

```bash
cd apps/mobile
pnpm dlx expo-doctor --verbose
```

Or check specific packages:

```bash
cd apps/mobile
pnpm dlx expo install --check
```

## Solutions

### Option 1: Fix Package Versions (Recommended)

Let Expo fix the versions automatically:

```bash
cd apps/mobile
pnpm dlx expo install --fix
```

This will update all Expo packages to match SDK 54 requirements.

### Option 2: Exclude Specific Packages

If some packages need to stay at different versions, add them to `package.json`:

```json
{
  "expo": {
    "install": {
      "exclude": ["package-name-that-needs-different-version"]
    }
  }
}
```

### Option 3: Ignore expo-doctor Check in Builds

If the mismatch is non-critical and builds work fine, you can configure EAS Build to ignore `expo-doctor` failures. However, this is **not recommended** as it hides potential issues.

### Option 4: Accept the Warning (If Builds Work)

If your builds succeed despite the `expo-doctor` warning, it's often safe to ignore it. The warning appears because:

- Some packages might be slightly newer/older than "recommended"
- Monorepo structure can cause false positives
- The build process uses the correct versions anyway

## Why It's Often Non-Critical

Looking at your build logs:

- ✅ Dependencies installed successfully
- ✅ Metro bundler completed
- ✅ Prebuild completed
- ✅ Build progressed past expo-doctor

The `expo-doctor` check is a **validation step**, not a blocker. If builds work, the actual package versions being used are correct.

## Verify Actual Versions

Check what versions are actually installed:

```bash
cd apps/mobile
pnpm list expo expo-router expo-constants
```

Compare with Expo SDK 54 requirements:

- https://docs.expo.dev/versions/latest/sdk/overview/

## Related

- [pnpm Migration](./PNPM_MIGRATION.md)
- [React Version Fix](./REACT_VERSION_FIX.md)
- [Build Fixes](./BUILD_FIXES.md)
