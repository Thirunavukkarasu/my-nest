# Shell Configuration for Android SDK

## Issue

If you're using **zsh** but the setup script wrote to `.bashrc`, you need to add the Android SDK configuration to `.zshrc` instead.

## Quick Fix

### Option 1: Run the setup script again (Recommended)

The script has been updated to detect zsh correctly:

```bash
./scripts/setup-android-home.sh
```

### Option 2: Manual Setup

Add these lines to your `~/.zshrc`:

```bash
# Android SDK
export ANDROID_HOME="$HOME/Library/Android/sdk"  # macOS
# or
export ANDROID_HOME="$HOME/Android/Sdk"          # Linux

export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export PATH="$PATH:$ANDROID_HOME/tools"
export PATH="$PATH:$ANDROID_HOME/tools/bin"
```

Then reload your shell:

```bash
source ~/.zshrc
```

## Verify Setup

Check if `ANDROID_HOME` is set:

```bash
echo $ANDROID_HOME
```

Should output something like:
```
/Users/your-username/Library/Android/sdk
```

Check if `adb` is available:

```bash
adb version
```

## Common Issues

### "parse error near `|'" when sourcing .bashrc

**Problem**: You're using zsh but trying to source `.bashrc` which has bash-specific syntax.

**Solution**: 
- Don't source `.bashrc` in zsh
- Use `.zshrc` instead
- Run `source ~/.zshrc` after adding Android SDK config

### ANDROID_HOME not found after reloading shell

**Problem**: Configuration was added to wrong file or shell wasn't reloaded.

**Solution**:
1. Check which shell you're using: `echo $SHELL`
2. Make sure config is in the right file:
   - zsh → `~/.zshrc`
   - bash → `~/.bashrc`
3. Reload: `source ~/.zshrc` (or `source ~/.bashrc`)

## Related Documentation

- [Android SDK Setup](./ANDROID_SDK_SETUP.md)
- [Local Build Guide](./LOCAL_BUILD.md)

