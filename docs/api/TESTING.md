# API Testing Guide

This document describes how to test the API endpoints in the web app.

## Overview

The project uses **Vitest** for automated testing of API endpoints. Tests are located in `src/__tests__/api/` directory.

## Setup

### Prerequisites

1. **Install dependencies**:

   ```bash
   cd apps/web
   pnpm install
   ```

2. **Start the development server**:

   ```bash
   pnpm dev
   ```

   The API will be available at `http://localhost:3000`

3. **Ensure database is set up**:
   ```bash
   pnpm db:migrate
   pnpm db:seed  # Optional: seed test data
   ```

## Running Tests

### Run all tests

```bash
pnpm test
```

### Run tests once (CI mode)

```bash
pnpm test:run
```

### Run only API tests

```bash
pnpm test:api
```

### Run tests in watch mode

```bash
pnpm test --watch
```

### Run manual API test script

```bash
pnpm test:api:manual
```

This script tests all endpoints and provides a summary report.

## Test Structure

### Test Files

- `src/__tests__/api/flats.test.ts` - Flats API endpoint tests
- `src/__tests__/api/residents.test.ts` - Residents API endpoint tests
- `src/__tests__/api/payments.test.ts` - Payments API endpoint tests
- `src/__tests__/api/auth.test.ts` - Authentication API endpoint tests

### Test Helpers

- `src/__tests__/helpers/api.ts` - API testing utilities
  - `apiRequest()` - Make API requests
  - `createPaginationBody()` - Create pagination request bodies
  - `assertPaginatedResponse()` - Assert paginated response structure
  - `assertErrorResponse()` - Assert error response structure

## Test Cases

### Flats API (`/api/flats`)

✅ **Pagination Tests**

- Default pagination (page 1, limit 10)
- Custom pagination parameters
- Pagination metadata validation

✅ **Sorting Tests**

- Sort by `floorNumber` ascending
- Sort by `createdAt` descending

✅ **Filtering Tests**

- Filter by `flatNumber` contains

✅ **Data Structure Tests**

- Required fields present
- Relations included (residents, payments)

✅ **Error Handling Tests**

- Invalid request body handling
- Empty request body handling

### Residents API (`/api/residents`)

✅ **Pagination Tests**

- Default and custom pagination
- Pagination metadata validation

✅ **Sorting Tests**

- Sort by `createdAt` descending

✅ **Filtering Tests**

- Filter by `firstName` contains

✅ **Data Structure Tests**

- Required fields present
- Flat relation included

### Payments API (`/api/payments`)

✅ **Pagination Tests**

- Default and custom pagination
- Pagination metadata validation

✅ **Sorting Tests**

- Sort by `createdAt` descending

✅ **Filtering Tests**

- Filter by `status` equals

✅ **Data Structure Tests**

- Required fields present
- Amount validation (decimal string)
- Flat and resident relations included

### Authentication API (`/api/register`)

✅ **Registration Tests**

- Valid user registration
- Invalid email rejection
- Short password rejection
- Short name rejection
- Missing fields rejection
- Duplicate email rejection

## Writing New Tests

### Example Test

```typescript
import { describe, it, expect } from "vitest";
import {
  apiRequest,
  createPaginationBody,
  assertPaginatedResponse,
} from "../helpers/api";

describe("My API", () => {
  const endpoint = "/api/my-endpoint";

  it("should return data", async () => {
    const response = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(createPaginationBody()),
    });

    expect(response.status).toBe(200);
    assertPaginatedResponse(response.data);
  });
});
```

### Test Helper Functions

#### `apiRequest<T>(endpoint, options)`

Makes an API request and returns the response.

```typescript
const response = await apiRequest("/api/flats", {
  method: "POST",
  body: JSON.stringify({ page: 1, limit: 10 }),
});
```

#### `createPaginationBody(params)`

Creates a pagination request body.

```typescript
const body = createPaginationBody({
  page: 1,
  limit: 10,
  searchCriterias: [
    {
      columnName: "flatNumber",
      columnOperator: "contains",
      columnValue: "G",
    },
  ],
  sortCriterias: [
    {
      columnName: "createdAt",
      columnOrder: "desc",
    },
  ],
});
```

#### `assertPaginatedResponse(response)`

Asserts that a response has the correct paginated structure.

```typescript
assertPaginatedResponse(response.data);
// Checks for: data, pagination.page, pagination.limit, pagination.total, pagination.totalPages
```

## Environment Variables

Tests use the following environment variables:

- `TEST_API_URL` - Base URL for API tests (default: `http://localhost:3000`)

Set in your `.env` file or environment:

```bash
TEST_API_URL=http://localhost:3000
```

## Continuous Integration

Tests can be run in CI/CD pipelines:

```bash
# Install dependencies
pnpm install

# Run migrations
pnpm db:migrate

# Run tests
pnpm test:run
```

## Troubleshooting

### Tests fail with "ECONNREFUSED"

- Ensure the development server is running (`pnpm dev`)
- Check that the server is running on the correct port (default: 3000)
- Verify `TEST_API_URL` environment variable

### Tests fail with database errors

- Ensure database migrations are run (`pnpm db:migrate`)
- Check database connection string in `.env`
- Verify database is accessible

### Tests fail with timeout

- Increase test timeout in `vitest.config.ts`:
  ```typescript
  test: {
    testTimeout: 10000, // 10 seconds
  }
  ```

### Tests fail with authentication errors

- Some endpoints may require authentication
- Check if test data exists in database
- Run seed script: `pnpm db:seed`

## Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Clean Data**: Use unique test data (e.g., timestamps in emails)
3. **Assert Structure**: Always verify response structure, not just status codes
4. **Test Edge Cases**: Include tests for invalid inputs, empty data, etc.
5. **Use Helpers**: Leverage test helper functions for consistency

## Next Steps

- [ ] Add tests for create endpoints (when implemented)
- [ ] Add tests for update endpoints (when implemented)
- [ ] Add tests for delete endpoints (when implemented)
- [ ] Add integration tests with database
- [ ] Add performance tests for large datasets
- [ ] Add authentication tests with real tokens
