# Building Android APK with GitHub Actions

This workflow builds Android APK files using Expo Application Services (EAS) Build.

## Prerequisites

1. **Expo Account**: You need an Expo account (free tier works)
2. **EAS Token**: Generate an access token from [Expo Dashboard](https://expo.dev/accounts/[your-account]/settings/access-tokens)

## Setup

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Add a new secret:
   - **Name**: `EXPO_TOKEN`
   - **Value**: Your Expo access token

## How It Works

### Automatic Builds

The workflow automatically triggers when:

- **Tag push**: When you push a tag starting with `v` (e.g., `v1.0.0`)
- **Release creation**: When you create a new GitHub release

### Manual Builds

You can manually trigger builds:

1. Go to **Actions** tab in GitHub
2. Select **Build Android APK** workflow
3. Click **Run workflow**
4. Choose build profile:
   - **preview**: For testing/internal distribution
   - **production**: For production releases

## Build Profiles

Configured in `apps/mobile/eas.json`:

- **preview**: Builds APK for internal testing
- **production**: Builds APK for production release

## Artifacts

- APK files are uploaded as GitHub Actions artifacts
- Available for 90 days
- Can be downloaded from the workflow run page
- For tagged releases, APK is also attached to the GitHub release

## Alternative: Local Build Workflow

If you prefer building locally in GitHub Actions (without EAS), you can use the `build-android-apk-local.yml` workflow, which:

- Sets up Android SDK
- Builds APK directly in the runner
- No Expo account required
- Takes longer but gives more control

## Troubleshooting

### Build fails with "EXPO_TOKEN not found"

- Make sure you've added the `EXPO_TOKEN` secret in GitHub repository settings

### Build times out

- EAS Build can take 10-30 minutes depending on queue
- The workflow waits up to 30 minutes
- Check build status in [Expo Dashboard](https://expo.dev/accounts/[your-account]/builds)

### APK not found in artifacts

- Check if the build completed successfully
- Verify the build profile matches your configuration
- Check workflow logs for download errors
