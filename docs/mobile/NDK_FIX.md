# Fixing Android NDK Missing source.properties Error

## Error

```
[CXX1101] NDK at /Users/thiru-ma/Library/Android/sdk/ndk/27.1.12297006 did not have a source.properties file
```

## Cause

The Android NDK installation is incomplete or corrupted. The `source.properties` file is missing from the NDK directory.

## Solution

### Option 1: Reinstall NDK via Android Studio (Recommended)

1. Open Android Studio
2. Go to **Tools → SDK Manager**
3. Click on the **SDK Tools** tab
4. Check **Show Package Details**
5. Find **NDK (Side by side)** and expand it
6. Uncheck the current NDK version (27.1.12297006)
7. Click **Apply** to uninstall
8. Check the NDK version again
9. Click **Apply** to reinstall
10. Verify: Check that `source.properties` exists:
    ```bash
    ls -la $ANDROID_HOME/ndk/27.1.12297006/source.properties
    ```

### Option 2: Create source.properties Manually

If you can't reinstall, create the file manually:

```bash
# Create the source.properties file
cat > $ANDROID_HOME/ndk/27.1.12297006/source.properties << 'EOF'
Pkg.Desc = Android NDK
Pkg.Revision = 27.1.12297006
EOF
```

### Option 3: Use a Different NDK Version

If the current NDK version is problematic, you can:

1. Install a different NDK version via Android Studio SDK Manager
2. Or specify a different NDK version in your project's `gradle.properties`:
   ```properties
   android.ndkVersion=26.1.10909125
   ```

### Option 4: Disable NDK (If Not Needed)

If your app doesn't use native code, you can disable NDK checks:

1. Set `ANDROID_NDK_HOME` to empty or a dummy path
2. Or configure Gradle to skip NDK validation (not recommended)

## Verification

After fixing, verify the NDK:

```bash
# Check if source.properties exists
ls -la $ANDROID_HOME/ndk/*/source.properties

# Check NDK version
cat $ANDROID_HOME/ndk/27.1.12297006/source.properties
```

## Related

- [Android SDK Setup](./ANDROID_SDK_SETUP.md)
- [Local Build Guide](./LOCAL_BUILD.md)

