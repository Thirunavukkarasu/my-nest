# Fixing minSdkVersion Mismatch Error

## Error

```
[CXX1214] User has minSdkVersion 22 but library was built for 24 [//ReactAndroid/hermestooling]
```

This error occurs during the Gradle build phase when building Android APKs locally.

## Root Cause

Expo SDK 54 requires `minSdkVersion` 24, but if it's not explicitly set in `app.json`, it may default to 22, causing a mismatch with React Native libraries that require SDK 24.

Even when `minSdkVersion: 24` is set in `app.json`, Expo's prebuild might not always apply it correctly, especially during EAS local builds.

## Solution

### Step 1: Install expo-build-properties

The official Expo plugin for setting build properties:

```bash
cd apps/mobile
pnpm dlx expo install expo-build-properties
```

Or manually add to `package.json`:

```json
{
  "dependencies": {
    "expo-build-properties": "~0.12.0"
  }
}
```

Then run `pnpm install`.

### Step 2: Configure in app.json

Add the `expo-build-properties` plugin to your `app.json`:

```json
{
  "expo": {
    "android": {
      "minSdkVersion": 24
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 24
          }
        }
      ]
    ]
  }
}
```

**Note**: Set `minSdkVersion` in both `android` section AND the plugin config for maximum compatibility.

### Alternative: Custom Config Plugin

If `expo-build-properties` doesn't work, you can use a custom plugin (see `plugins/with-min-sdk-version.js`), but the official plugin is recommended.

## Why This Happens

- Expo SDK 54 requires Android API level 24 (Android 7.0) as minimum
- React Native libraries (like `hermestooling`) are built for SDK 24
- Expo's prebuild template may default to SDK 22 if not explicitly set
- The `expo-build-properties` plugin ensures the value is correctly applied during prebuild

## Verification

After installing and configuring `expo-build-properties`, rebuild:

```bash
pnpm run build:apk:preview:local
```

The build should now pass the CMake configuration phase.

## Related

- [Expo SDK 54 Requirements](https://docs.expo.dev/versions/latest/sdk/overview/)
- [expo-build-properties Documentation](https://docs.expo.dev/versions/latest/config-plugins/build-properties/)
- [Android Build Fixes](./BUILD_FIXES.md)
- [NDK Fix](./NDK_FIX.md)
