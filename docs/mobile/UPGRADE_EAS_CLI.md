# Upgrade EAS CLI

Your current EAS CLI version is **11.0.2**, but the latest is **16.28.0**.

## Option 1: Upgrade with sudo (Recommended)

Run this command in your terminal:

```bash
sudo npm install -g eas-cli@latest
```

Enter your password when prompted.

## Option 2: Use npx (No Global Install Needed)

I've updated your `package.json` scripts to use `npx`, which will automatically use the latest version from npm without needing a global install.

You can now run:

```bash
# From apps/mobile directory
npm run build:android:production:local

# Or from root
npm run build:android:production:local --workspace=@my-nest/mobile
```

## Option 3: Fix npm Permissions (Long-term Solution)

If you want to avoid using `sudo`, you can fix npm permissions:

```bash
# Create a directory for global packages
mkdir ~/.npm-global

# Configure npm to use the new directory
npm config set prefix '~/.npm-global'

# Add to your shell profile (~/.zshrc or ~/.bashrc)
export PATH=~/.npm-global/bin:$PATH

# Reload your shell
source ~/.zshrc  # or source ~/.bashrc

# Now install without sudo
npm install -g eas-cli@latest
```

## Verify Installation

After upgrading, verify the version:

```bash
eas --version
# or
npx eas-cli --version
```

You should see version 16.28.0 or higher.

## Current Status

- ✅ Scripts updated to use `npx` (works with any version)
- ✅ `eas.json` updated to require >= 13.2.0
- ⚠️ Global EAS CLI still at 11.0.2 (needs manual upgrade)

## Recommendation

Use **Option 2** (npx) - it's the easiest and doesn't require permissions. The scripts are already updated to use `npx eas-cli`, so you can build immediately without upgrading globally.
