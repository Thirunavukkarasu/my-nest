# Installation Guide for My Nest App

## Problem

Your app uses React Native's New Architecture and custom native plugins, so it **cannot run in Expo Go**. You need to build a development build.

## Solution Options

### Option 1: Local Development Build (Recommended for Development)

1. **Prebuild native code:**

   ```bash
   cd mobile
   npx expo prebuild --clean
   ```

2. **Start Metro bundler:**

   ```bash
   npx expo start --dev-client
   ```

3. **Build and install on Android emulator:**

   ```bash
   # Make sure your Android emulator is running first
   npx expo run:android
   ```

   Or if you prefer to build manually:

   ```bash
   cd android
   ./gradlew installDebug
   ```

4. **For physical device:**
   ```bash
   # Connect device via USB with USB debugging enabled
   npx expo run:android --device
   ```

### Option 2: EAS Development Build (Easier, but requires EAS account)

1. **Build development client:**

   ```bash
   cd mobile
   eas build --profile development --platform android
   ```

2. **Install the APK** on your device/emulator from the EAS build page

3. **Start Metro bundler:**

   ```bash
   npx expo start --dev-client
   ```

4. **Open the app** on your device - it will connect to Metro automatically

### Option 3: Temporarily Use Expo Go (Quick Test, May Have Issues)

⚠️ **Warning:** This may not work properly due to New Architecture and custom plugins.

1. **Temporarily disable New Architecture** in `app.json`:

   ```json
   {
     "expo": {
       "newArchEnabled": false
     }
   }
   ```

2. **Remove custom plugins** temporarily (comment out in `app.json`):

   ```json
   "plugins": [
     "expo-router",
     // "./plugins/with-min-sdk-version.js",  // Comment this out
     // ... other plugins
   ]
   ```

3. **Start Expo:**

   ```bash
   npx expo start --clear
   ```

4. **Scan QR code** with Expo Go app

## Troubleshooting

### If `expo prebuild` fails:

- Make sure you have Android SDK installed
- Check that `ANDROID_HOME` is set correctly
- Try: `npx expo prebuild --clean --platform android`

### If build fails:

- Clear Gradle cache: `cd android && ./gradlew clean`
- Clear Expo cache: `npx expo start --clear`
- Check Android SDK version (should be API 24+)

### If app doesn't connect to Metro:

- Make sure Metro bundler is running: `npx expo start --dev-client`
- Check network connectivity between device and computer
- For emulator: `adb reverse tcp:8081 tcp:8081`
- For physical device: Ensure same WiFi network or use tunnel: `npx expo start --tunnel`

### If "No apps connected" error:

- Make sure development build is installed (not Expo Go)
- Restart Metro bundler
- Restart the app on device
- Check that you're using `--dev-client` flag

## Recommended Workflow

For daily development, use **Option 1** (Local Development Build):

```bash
# First time setup
cd mobile
npx expo prebuild --clean
npx expo run:android

# Daily development
# Terminal 1: Start Metro
npx expo start --dev-client

# Terminal 2: Rebuild if native code changes
npx expo run:android

# Or just reload in the app (shake device → Reload)
```
