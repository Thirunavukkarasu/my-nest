# Android SDK Setup for Local Builds

## Error
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable
```

This error occurs because local builds require Android SDK to be installed and configured.

## Solution Options

### Option 1: Use Cloud Build (Easiest - Recommended)

Skip local builds entirely and use EAS cloud builds:

```bash
cd apps/mobile

# Cloud build (no Android SDK needed)
npm run build:android:production
# or
npx eas-cli build --platform android --profile production
```

**Advantages:**
- ✅ No Android SDK installation needed
- ✅ Faster setup
- ✅ Consistent build environment
- ✅ Free tier available

### Option 2: Install Android SDK for Local Builds

If you want to build locally, you need Android SDK:

#### Step 1: Install Android Studio

1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Install Android Studio
3. Open Android Studio and go through the setup wizard
4. Install Android SDK (API level 33+ recommended)

#### Step 2: Set Environment Variables

Add to your `~/.zshrc` (or `~/.bashrc`):

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then reload:
```bash
source ~/.zshrc
```

#### Step 3: Verify Installation

```bash
# Check ANDROID_HOME
echo $ANDROID_HOME
# Should output: /Users/your-username/Library/Android/sdk

# Check adb
adb version

# Check Java
java -version
```

#### Step 4: Install Required SDK Components

Open Android Studio → SDK Manager and install:
- Android SDK Platform 33 or higher
- Android SDK Build-Tools
- Android SDK Platform-Tools

Or use command line:
```bash
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

## Current Status

Your build got past the dependency installation phase but failed at the Gradle build phase because Android SDK wasn't found.

## Recommendation

**Use cloud builds** (`npm run build:android:production`) - they're easier, faster to set up, and don't require local Android SDK installation. Local builds are mainly useful if you need to:
- Test builds before pushing
- Build without internet
- Customize the build environment extensively

## Quick Fix

For now, use cloud builds:

```bash
cd apps/mobile
npm run build:android:production
```

This will build on Expo's servers and you can download the APK when it's done.

## Troubleshooting

### NDK Missing source.properties

If you see:
```
[CXX1101] NDK at ... did not have a source.properties file
```

See [NDK Fix Guide](./NDK_FIX.md) for solutions.

