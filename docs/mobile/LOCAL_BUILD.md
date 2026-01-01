# Building APK Locally

You can build Android APK files locally on your machine. There are two main approaches:

## Prerequisites

### Option 1: EAS Build Cloud (Easiest - Recommended)

- Node.js 18+
- Expo account
- EAS CLI (via npx)

**No Android SDK needed!** Builds run on Expo's servers.

### Option 2: EAS Build Local

- Node.js 18+
- **Android SDK (Android Studio) - REQUIRED**
- **ANDROID_HOME environment variable - REQUIRED**
- Java JDK 11 or higher
- EAS CLI (via npx)

⚠️ **Note**: Local builds require Android SDK setup. See [ANDROID_SDK_SETUP.md](./ANDROID_SDK_SETUP.md) for detailed instructions.

### Option 2: Expo Build (Legacy)

- Node.js 18+
- Android SDK
- Java JDK
- Expo CLI

## Method 1: EAS Build Cloud (Easiest)

**Recommended for most users** - No Android SDK installation needed!

```bash
cd apps/mobile

# Cloud build
npm run build:android:production
```

The APK will be built on Expo's servers and available for download when complete.

## Method 2: EAS Build Local (Requires Android SDK)

### Setup

1. **Install EAS CLI globally**:

   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:

   ```bash
   eas login
   ```

3. **Configure EAS Project** (required before first build):

   ```bash
   cd apps/mobile
   eas build:configure
   ```

   Or if that doesn't work:

   ```bash
   eas init
   ```

   This links your local project to your Expo account. See [EAS_SETUP.md](./EAS_SETUP.md) for detailed setup instructions.

### Build APK Locally

⚠️ **IMPORTANT**: Before building locally, you must:

1. Install Android Studio
2. Set `ANDROID_HOME` environment variable
3. Install Android SDK components

See [ANDROID_SDK_SETUP.md](./ANDROID_SDK_SETUP.md) for complete setup instructions.

1. **Preview build** (for testing):

   ```bash
   cd apps/mobile
   eas build --platform android --profile preview --local
   ```

2. **Production build**:
   ```bash
   cd apps/mobile
   eas build --platform android --profile production --local
   ```

The APK will be saved in the `apps/mobile/build` directory.

### Using npm scripts

From the root directory:

```bash
# Preview build
npm run build:android:preview:local --workspace=@my-nest/mobile

# Production build
npm run build:android:production:local --workspace=@my-nest/mobile
```

## Method 2: Using Expo Build (Legacy)

If you prefer the older Expo CLI approach:

```bash
cd apps/mobile
npx expo build:android -t apk
```

**Note**: This method is deprecated and may not work with newer Expo SDK versions.

## Android SDK Setup

If you don't have Android SDK installed:

1. **Install Android Studio**:

   - Download from [developer.android.com/studio](https://developer.android.com/studio)
   - Install Android SDK (API level 33+ recommended)

2. **Set environment variables**:

   ```bash
   # macOS/Linux
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin

   # Add to ~/.zshrc or ~/.bashrc for persistence
   ```

3. **Verify installation**:
   ```bash
   adb version
   java -version
   ```

## Troubleshooting

### "Android SDK not found"

- Make sure `ANDROID_HOME` is set correctly
- Verify Android SDK is installed via Android Studio

### "Java not found"

- Install Java JDK 11 or higher
- Set `JAVA_HOME` environment variable

### Build fails with "Gradle error"

- Make sure you have the latest Android SDK tools
- Try cleaning: `cd apps/mobile/android && ./gradlew clean` (if android folder exists)

### "EAS CLI not found"

- Install globally: `npm install -g eas-cli`
- Or use npx: `npx eas-cli build --platform android --local`

## Build Output

After a successful local build:

- APK file location: `apps/mobile/build/app-*.apk`
- You can install it directly on Android devices using `adb install`

## Installing APK on Device

1. **Enable USB debugging** on your Android device
2. **Connect device** via USB
3. **Install APK**:
   ```bash
   adb install apps/mobile/build/app-*.apk
   ```

Or transfer the APK file to your device and install manually.
