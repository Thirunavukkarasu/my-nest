# Metro Config Fix

## Issue

EAS Build was warning that `metro.config.js` doesn't extend `@expo/metro-config`, which can cause issues with production builds.

## Fix Applied

Changed the import from:

```js
const { getDefaultConfig } = require("expo/metro-config");
```

To:

```js
const { getDefaultConfig } = require("@expo/metro-config");
```

## Why This Matters

- `expo/metro-config` is a re-export wrapper
- EAS Build checks for the explicit `@expo/metro-config` import
- Using the explicit import ensures proper Metro configuration detection
- This prevents missing assets in production builds

## Verification

The config now properly extends `@expo/metro-config` while still supporting NativeWind:

```js
const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

## Next Steps

You can now run the build again:

```bash
eas build --platform android --profile production --local
```

The warning should no longer appear, and the build should proceed successfully.
