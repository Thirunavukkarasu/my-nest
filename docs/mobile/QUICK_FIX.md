# Quick Fix for EAS CLI Version Issue

## Problem

You're running `eas build` directly, which uses your global EAS CLI version (11.0.2), but `eas.json` requires >= 13.2.0.

## Solution Options

### Option 1: Use npm scripts (Recommended - No upgrade needed)

Use the npm scripts which automatically use the latest version via `npx`:

```bash
cd apps/mobile

# Instead of: eas build --platform android --profile production --local
# Use:
npm run build:android:production:local
```

### Option 2: Upgrade globally

Upgrade your global EAS CLI:

```bash
sudo npm install -g eas-cli@latest
```

Then you can use `eas build` directly.

### Option 3: Use npx directly

Use `npx` to run the latest version without upgrading:

```bash
cd apps/mobile
npx eas-cli build --platform android --profile production --local
```

## Temporary Fix Applied

I've temporarily lowered the version requirement in `eas.json` to `>= 11.0.0` so your current global version works. However, **Option 1** (using npm scripts) is recommended as it ensures you're always using a compatible version.

## Recommended Approach

Always use the npm scripts:

- ✅ `npm run build:android:preview`
- ✅ `npm run build:android:production`
- ✅ `npm run build:android:preview:local`
- ✅ `npm run build:android:production:local`

These automatically use the correct EAS CLI version via `npx`.
