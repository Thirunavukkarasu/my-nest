# Turborepo Setup

This monorepo uses [Turborepo](https://turbo.build/) for build orchestration, caching, and task management.

## Overview

Turborepo provides:

- **Build caching** - Speeds up builds by caching task outputs
- **Parallel execution** - Runs tasks in parallel when possible
- **Task dependencies** - Ensures correct build order
- **Remote caching** - Share cache across team and CI/CD

## Configuration

The Turborepo configuration is in `turbo.json` at the root of the monorepo.

### Pipeline Tasks

- **`build`** - Builds all apps (web, mobile, api)
- **`dev`** - Runs development servers (persistent, no cache)
- **`lint`** - Lints code across all apps
- **`test`** - Runs tests with caching
- **`start`** - Starts production servers
- **`db:generate`** - Generates database migrations
- **`db:migrate`** - Runs database migrations (depends on `db:generate`)
- **`db:seed`** - Seeds database (depends on `db:migrate`)

## Usage

### Run tasks for all apps:

```bash
# Build all apps
pnpm build

# Run dev servers for all apps
pnpm dev

# Lint all apps
pnpm lint

# Run tests for all apps
pnpm test
```

### Run tasks for specific apps:

```bash
# Build only web app
pnpm build:web

# Run dev server for web app
pnpm dev:web

# Run dev server for mobile app
pnpm dev:mobile

# Run dev server for API
pnpm dev:api
```

### Database operations:

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

## Benefits

1. **Faster builds** - Cached outputs mean unchanged apps don't rebuild
2. **Parallel execution** - Multiple apps build simultaneously
3. **Dependency management** - Ensures correct build order automatically
4. **Consistent commands** - Same commands work across all apps

## Cache

Turborepo caches build outputs in `.turbo` directory (gitignored). On subsequent builds, unchanged apps will use cached outputs, significantly speeding up builds.

## Remote Caching (Optional)

For team collaboration and CI/CD, you can enable remote caching with Vercel:

```bash
npx turbo login
npx turbo link
```

This allows sharing build cache across team members and CI/CD pipelines.

## App-Specific Scripts

Each app can have its own scripts that Turborepo will recognize:

- `apps/web/package.json` - Next.js scripts
- `apps/mobile/package.json` - Expo scripts
- `apps/api/package.json` - Express/Vercel scripts

Turborepo automatically discovers and runs these scripts based on the pipeline configuration.
