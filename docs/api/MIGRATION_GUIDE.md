# Database Migration Guide

This guide explains how to use Drizzle ORM for database migrations.

## Overview

Drizzle ORM uses **drizzle-kit** to generate migrations from your schema files. The workflow is:

1. **Modify schema** - Update schema files in `src/db/schema/`
2. **Generate migration** - Run `pnpm db:generate` to create migration SQL
3. **Apply migration** - Run `pnpm db:migrate` to apply to database

## Commands

### Generate Migrations

```bash
cd apps/web
pnpm db:generate
```

This command:

- Compares your schema files with the current database state
- Generates SQL migration files in `src/db/migrations/`
- Creates migration metadata in `src/db/migrations/meta/`

### Apply Migrations

```bash
pnpm db:migrate
```

This command:

- Reads migration files from `src/db/migrations/`
- Applies them to your database in order
- Tracks which migrations have been applied

### Push Schema Directly (Development Only)

```bash
pnpm db:push
```

**⚠️ Warning**: This directly pushes schema changes to the database without creating migration files. Use only in development.

**Use cases**:

- Quick prototyping
- Development environment
- When you don't need migration history

**Don't use in production** - Always use `db:generate` + `db:migrate` for production.

### View Database Schema

```bash
pnpm db:studio
```

Opens Drizzle Studio - a visual database browser to inspect your schema and data.

## Fixing Missing Columns

If you get errors about missing columns (like `receipt_url`):

### Option 1: Generate and Apply Migration (Recommended)

```bash
# 1. Ensure schema has the column
# (Check src/db/schema/payment.ts)

# 2. Generate migration
pnpm db:generate

# 3. Review the generated migration
# (Check src/db/migrations/XXXX_*.sql)

# 4. Apply migration
pnpm db:migrate
```

### Option 2: Push Schema Directly (Quick Fix for Development)

```bash
pnpm db:push
```

This will sync your schema directly to the database.

## Migration Workflow

### Adding a New Column

1. **Update schema** (`src/db/schema/payment.ts`):

   ```typescript
   receiptUrl: varchar("receipt_url", { length: 255 }),
   ```

2. **Generate migration**:

   ```bash
   pnpm db:generate
   ```

3. **Review generated SQL** (`src/db/migrations/XXXX_*.sql`):

   ```sql
   ALTER TABLE "payments" ADD COLUMN "receipt_url" varchar(255);
   ```

4. **Apply migration**:
   ```bash
   pnpm db:migrate
   ```

### Removing a Column

1. **Remove from schema** (`src/db/schema/payment.ts`):

   ```typescript
   // Remove: receiptUrl: varchar("receipt_url", { length: 255 }),
   ```

2. **Generate migration**:

   ```bash
   pnpm db:generate
   ```

3. **Review and apply**:
   ```bash
   pnpm db:migrate
   ```

## Troubleshooting

### Error: Column already exists

If you get "column already exists" errors:

1. **Check if column exists in database**:

   ```sql
   SELECT column_name
   FROM information_schema.columns
   WHERE table_name = 'payments'
   AND column_name = 'receipt_url';
   ```

2. **If it exists**: Your schema is out of sync. Either:

   - Remove the column from database manually, OR
   - Keep it in schema and regenerate migrations

3. **If it doesn't exist**: Run migrations:
   ```bash
   pnpm db:migrate
   ```

### Error: Migration already applied

Drizzle tracks applied migrations. If you see this error:

- Check `src/db/migrations/meta/_journal.json`
- Ensure migration files match the journal

### Schema and Database Out of Sync

Use `db:push` to sync in development:

```bash
pnpm db:push
```

**Note**: This doesn't create migration files. For production, always use `db:generate` + `db:migrate`.

## Best Practices

1. **Always generate migrations** before applying
2. **Review generated SQL** before running migrations
3. **Test migrations** in development first
4. **Commit migration files** to version control
5. **Use `db:push`** only in development
6. **Never edit** migration files manually after generation

## Current Issue: receipt_url Column

The `receipt_url` column is defined in the schema but may be missing in the database.

**To fix**:

```bash
# Option 1: Generate and apply migration
pnpm db:generate
pnpm db:migrate

# Option 2: Push schema directly (development)
pnpm db:push
```

After running either command, the column will exist and API queries will work.
