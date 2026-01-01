# API Troubleshooting Guide

Common issues and solutions when working with the API.

## Database Column Errors

### Error: `column flatsTable_payments.receipt_url does not exist`

**Cause**: This error occurs when querying relations (e.g., flats with payments) and Drizzle tries to access columns that don't match the database schema.

**Solution**:
1. Ensure database migrations are up to date:
   ```bash
   pnpm db:migrate
   ```

2. Verify the schema matches the database:
   ```bash
   pnpm db:generate
   ```

3. If the error persists, check that the column name in the schema matches the database:
   - Schema uses camelCase: `receiptUrl`
   - Database uses snake_case: `receipt_url`
   - Drizzle should handle this mapping automatically

## Native Module Errors (bcrypt, pg-native)

### Error: `Cannot find module 'bcrypt/lib/binding/napi-v3/bcrypt_lib.node'`

**Cause**: Native modules like `bcrypt` need to be rebuilt or hoisted properly in pnpm monorepos.

**Solutions**:

1. **Rebuild bcrypt**:
   ```bash
   cd apps/web
   pnpm rebuild bcrypt
   ```

2. **Reinstall dependencies**:
   ```bash
   pnpm install --force
   ```

3. **Clear Next.js cache and rebuild**:
   ```bash
   rm -rf apps/web/.next
   pnpm dev
   ```

4. **Ensure bcrypt is hoisted** (check `.npmrc`):
   ```ini
   public-hoist-pattern[]=*bcrypt*
   ```

## Environment Variables

### Error: `Required POSTGRES_URL` or `Required NEXTAUTH_SECRET`

**Cause**: Missing environment variables.

**Solution**:

1. Create `.env.local` in `apps/web/`:
   ```bash
   cd apps/web
   cp .env.example .env.local
   ```

2. Fill in the required variables:
   ```env
   POSTGRES_URL=postgresql://user:password@localhost:5432/dbname
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

## Response Structure Mismatch

### Error: Tests expect `data` but API returns `docs`

**Cause**: The `customPaginate` function returns `docs` but the API should return `data`.

**Solution**: Already fixed in `src/lib/customPaginate.ts`. The function now returns:
```typescript
{
  data: docs,  // Changed from 'docs'
  pagination: { ... }
}
```

## Relation Query Errors

### Error: Issues when querying with relations (e.g., flats with payments)

**Cause**: When using Drizzle's relational query API (`db.query.tableName.findMany()`), where conditions built for the base table may not work correctly.

**Solution**: The `customPaginate` function now properly handles relations by:
1. Only applying where conditions if they exist
2. Using Drizzle's relational query API correctly
3. Not applying base table where conditions to relation queries

## Next Steps After Fixing

1. **Restart the dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   pnpm dev
   ```

2. **Test the API**:
   ```bash
   pnpm test:api
   ```

3. **Check server logs** for any remaining errors

