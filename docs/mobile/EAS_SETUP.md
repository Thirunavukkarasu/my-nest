# EAS Project Setup Guide

The error "EAS project not configured" means you need to initialize and configure your Expo project with EAS.

## Step-by-Step Setup

### 1. Login to Expo

First, you need to login to your Expo account:

```bash
cd apps/mobile
eas login
```

If you don't have an Expo account:

1. Go to [expo.dev](https://expo.dev) and sign up (free)
2. Then run `eas login`

### 2. Configure EAS Project

After logging in, configure your project:

```bash
cd apps/mobile
eas build:configure
```

This will:

- Link your project to Expo
- Create/update `eas.json` (already exists, but will be validated)
- Set up the project in your Expo account

### 3. Initialize EAS Project (Alternative)

If `eas build:configure` doesn't work, try:

```bash
cd apps/mobile
eas init
```

This will:

- Create an Expo project in your account
- Link your local project to the Expo project
- Configure EAS settings

### 4. Verify Configuration

Check if you're logged in and project is configured:

```bash
# Check login status
eas whoami

# List your projects
eas project:info
```

## For Local Builds

If you're building locally (`--local` flag), you still need:

- ✅ EAS project configured (steps above)
- ✅ Android SDK installed (for local builds)
- ✅ Logged in to Expo account

## Troubleshooting

### "Not logged in" error

```bash
eas login
```

### "EAS project not configured"

```bash
cd apps/mobile
eas build:configure
# or
eas init
```

### Permission errors with EAS CLI

If you get permission errors, try using npx:

```bash
cd apps/mobile
npx eas-cli login
npx eas-cli build:configure
```

### Project already exists

If you see "Project already exists", that's fine - it means your project is already linked. You can proceed with builds.

## Quick Setup Commands

Run these commands in order:

```bash
cd apps/mobile

# 1. Login (if not already logged in)
eas login

# 2. Configure project
eas build:configure

# 3. Try building
eas build --platform android --profile production --local
```

## After Setup

Once configured, you can build:

```bash
# Cloud build
eas build --platform android --profile production

# Local build
eas build --platform android --profile production --local
```

The project will be linked to your Expo account and you can track builds in the [Expo Dashboard](https://expo.dev/accounts/[your-account]/projects).
