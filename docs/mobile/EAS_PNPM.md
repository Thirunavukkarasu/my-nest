# EAS Build with pnpm

## Issue

When using pnpm in a monorepo, EAS Build may incorrectly detect the project as a yarn workspace and try to use yarn instead of pnpm.

## Solution

### 1. Add `packageManager` to package.json

Add the `packageManager` field to `apps/mobile/package.json`:

```json
{
  "name": "@my-nest/mobile",
  "packageManager": "pnpm@10.11.1",
  ...
}
```

This tells EAS Build (and other tools) which package manager to use.

### 2. Configure pnpm in eas.json

Add `pnpm` and `corepack` to each build profile in `apps/mobile/eas.json`:

```json
{
  "build": {
    "preview": {
      "node": "20.18.0",
      "pnpm": "10.11.1",
      "corepack": true
    }
  }
}
```

- `"pnpm": "10.11.1"` - Specifies the pnpm version
- `"corepack": true` - Enables Corepack, which is required for pnpm support

### 3. Ensure pnpm-lock.yaml exists

Make sure `pnpm-lock.yaml` exists at the root of your monorepo. EAS Build uses this to detect pnpm.

### 4. Verify Configuration

After making these changes, try building again:

```bash
cd apps/mobile
pnpm run build:android:preview:local
```

## Troubleshooting

### EAS Build still uses yarn

If EAS Build still tries to use yarn:

1. **Check for yarn.lock**: Remove any `yarn.lock` files that might exist:

   ```bash
   find . -name "yarn.lock" -delete
   ```

2. **Verify packageManager field**: Ensure `packageManager` is set correctly in `apps/mobile/package.json`

3. **Check pnpm-lock.yaml**: Ensure `pnpm-lock.yaml` exists at the root

### Build fails with "No lockfile found"

This happens when EAS Build can't find `pnpm-lock.yaml`. Ensure:

- `pnpm-lock.yaml` exists at the monorepo root
- **The file is NOT in `.gitignore`** - EAS Build needs it in the archive
- The file is committed to git
- The build is running from the correct directory

**Important**: If `pnpm-lock.yaml` is in `.gitignore`, EAS Build won't be able to detect pnpm and will fall back to yarn/npm, causing build failures.

## Node.js Version

If you specify a Node.js version in `eas.json`, use a specific version, not a wildcard:

```json
{
  "build": {
    "preview": {
      "node": "20.18.0" // ✅ Correct - specific version
      // "node": "20.x.x"  // ❌ Wrong - wildcard not supported
    }
  }
}
```

## Related

- [pnpm Migration Guide](./PNPM_MIGRATION.md)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
