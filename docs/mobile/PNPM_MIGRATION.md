# Migrating to pnpm for Better Monorepo Support

## Why pnpm?

pnpm has better support for monorepos and can prevent hoisting specific packages:

- ✅ **`public-hoist-pattern`** - Prevents React from being hoisted
- ✅ **Better dependency isolation** - Each workspace has its own dependencies
- ✅ **Faster installs** - Uses hard links, saves disk space
- ✅ **Stricter dependency resolution** - Catches issues earlier

## Quick Migration

### Option 1: Use Migration Script (Recommended)

```bash
npm run migrate:pnpm
```

This script will:

1. Check if pnpm is installed
2. Create `.npmrc` with hoist patterns
3. Remove npm files
4. Install dependencies with pnpm
5. Install missing dependencies like `@expo/metro-config`
6. Verify React versions

### Option 2: Manual Migration

#### 1. Install pnpm

```bash
npm install -g pnpm
# or
brew install pnpm
```

#### 2. Remove npm files

```bash
rm -rf node_modules apps/*/node_modules package-lock.json apps/*/package-lock.json
```

#### 3. Install with pnpm

```bash
pnpm install
```

#### 4. Install missing dependencies

```bash
cd apps/mobile
pnpm add @expo/metro-config --save-dev
```

#### 5. Verify

```bash
cd apps/mobile
# With pnpm, use pnpm dlx instead of npx
pnpm dlx expo-doctor

# Or use the helper script from root:
pnpm run expo:doctor
```

## Benefits After Migration

- ✅ React 19.1.0 installed locally in `apps/mobile/node_modules`
- ✅ React 19.2.3 installed locally in `apps/web/node_modules`
- ✅ No hoisting conflicts
- ✅ `expo-doctor` should pass React version check
- ✅ Faster installs and less disk space

## Troubleshooting

### npm warnings about `public-hoist-pattern`

If you see:

```
npm warn Unknown project config "public-hoist-pattern"
```

**Cause**: You're using npm instead of pnpm.

**Fix**: Use pnpm for all commands:

```bash
# Check which package manager
which pnpm

# Use pnpm
pnpm install
pnpm run dev:mobile
```

### Missing `@expo/metro-config`

If you see:

```
Cannot find module '@expo/metro-config'
```

**Fix**: Install it:

```bash
cd apps/mobile
pnpm add @expo/metro-config --save-dev
```

### React version still wrong

After migration, if React version is still wrong:

```bash
cd apps/mobile
rm -rf node_modules/react node_modules/react-dom
pnpm install
```

## Update CI/CD

GitHub Actions workflows have been updated to use pnpm. They will:

1. Setup pnpm
2. Use pnpm cache
3. Run `pnpm install --frozen-lockfile`

## Related

- [React Version Fix](./REACT_VERSION_FIX.md)
- [Monorepo React Management](./MONOREPO_REACT.md)
- [pnpm Workspaces](https://pnpm.io/workspaces)
