# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD.

## Available Workflows

### 1. `pr-build-check.yml`

- **Trigger**: Pull requests to `main` branch
- **Purpose**: Builds and validates the Next.js web app
- **Runs**: Linting and build checks

### 2. `build-android-apk.yml`

- **Trigger**:
  - Tag pushes (e.g., `v1.0.0`)
  - GitHub releases
  - Manual workflow dispatch
- **Purpose**: Builds Android APK using EAS Build
- **Output**: APK artifact and GitHub release attachment

## Setup for APK Builds

### Required Secrets

Add the following secret to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - **Name**: `EXPO_TOKEN`
   - **Value**: Your Expo access token (get from [Expo Dashboard](https://expo.dev/accounts/[your-account]/settings/access-tokens))

### Getting Expo Token

1. Sign in to [Expo Dashboard](https://expo.dev)
2. Go to **Account Settings** → **Access Tokens**
3. Click **Create Token**
4. Copy the token and add it to GitHub secrets

### Testing the Workflow

1. **Manual trigger**:

   - Go to **Actions** tab
   - Select **Build Android APK**
   - Click **Run workflow**
   - Choose build profile and run

2. **Tag trigger**:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Release trigger**:
   - Go to **Releases** → **Draft a new release**
   - Create a new tag (e.g., `v1.0.0`)
   - Publish release

## Workflow Details

See [BUILD_APK.md](./BUILD_APK.md) for detailed documentation on the APK build workflow.

## Related Documentation

- [Architecture Documentation](../architecture/) - Project structure
- [Mobile Documentation](../mobile/) - Mobile app build guides
