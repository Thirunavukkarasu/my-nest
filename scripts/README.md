# Scripts

This directory contains utility scripts for project setup and builds.

## Available Scripts

### `setup-android-home.sh`

Sets up the `ANDROID_HOME` environment variable for local Android builds.

**Usage:**
```bash
./scripts/setup-android-home.sh
```

**What it does:**
- Detects Android SDK location (macOS/Linux)
- Adds `ANDROID_HOME` to your shell configuration file (`~/.zshrc` or `~/.bashrc`)
- Adds Android SDK tools to your PATH
- Verifies the setup

**After running:**
```bash
source ~/.zshrc  # or ~/.bashrc
```

### `build-android-apk.sh`

Builds Android APK using EAS Build with proper checks and validation.

**Usage:**
```bash
# Build production APK on cloud (default)
./scripts/build-android-apk.sh

# Build preview APK on cloud
./scripts/build-android-apk.sh --preview

# Build production APK locally
./scripts/build-android-apk.sh --local

# Build preview APK locally
./scripts/build-android-apk.sh --preview --local

# Show help
./scripts/build-android-apk.sh --help
```

**What it does:**
- Validates EAS configuration
- Checks if logged in to EAS (for cloud builds)
- Verifies Android SDK setup (for local builds)
- Installs dependencies if needed
- Executes the build with proper error handling

## Using via npm scripts

You can also use these scripts via npm:

```bash
# Setup Android SDK
npm run setup:android

# Build APK (production, cloud)
npm run build:apk

# Build preview APK (cloud)
npm run build:apk:preview

# Build production APK (local)
npm run build:apk:local

# Build preview APK (local)
npm run build:apk:preview:local
```

## Prerequisites

### For Local Builds

1. **Android SDK** - Install Android Studio and Android SDK
2. **ANDROID_HOME** - Run `./scripts/setup-android-home.sh` to configure
3. **Java JDK** - JDK 11 or higher

### For Cloud Builds

1. **Expo Account** - Sign up at [expo.dev](https://expo.dev)
2. **EAS Login** - Run `npx eas-cli login` in `apps/mobile`
3. **EAS Configuration** - Run `npx eas-cli build:configure` in `apps/mobile`

## Related Documentation

- [Android SDK Setup](../docs/mobile/ANDROID_SDK_SETUP.md)
- [Local Build Guide](../docs/mobile/LOCAL_BUILD.md)
- [EAS Setup Guide](../docs/mobile/EAS_SETUP.md)
- [CI/CD Documentation](../docs/ci-cd/)

