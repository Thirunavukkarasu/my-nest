# Updating EAS CLI

If you encounter version mismatch errors, update EAS CLI:

## Update EAS CLI

Run this command in your terminal:

```bash
npm install -g eas-cli@latest
```

If you get permission errors, try:

```bash
sudo npm install -g eas-cli@latest
```

Or use a Node version manager (recommended):

### Using nvm (Node Version Manager)

```bash
# If using nvm, global installs go to nvm's directory
npm install -g eas-cli@latest
```

### Verify Installation

After updating, verify the version:

```bash
eas --version
```

You should see version 13.2.0 or higher.

## Alternative: Use npx (No Global Install)

You can also use EAS CLI without global installation:

```bash
# From apps/mobile directory
npx eas-cli build --platform android --profile production --local
```

Or update package.json scripts to use npx:

```json
{
  "scripts": {
    "build:android:preview:local": "npx eas-cli build --platform android --profile preview --local",
    "build:android:production:local": "npx eas-cli build --platform android --profile production --local"
  }
}
```

## Current Issue

Your current EAS CLI version is **11.0.2**, but `eas.json` requires **>= 13.2.0**.

**Quick fix**: Update EAS CLI as shown above, or temporarily lower the version constraint in `eas.json` (not recommended for production).
