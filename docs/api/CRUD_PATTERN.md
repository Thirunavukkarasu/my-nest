# Unified CRUD API Pattern

This document describes the unified CRUD (Create, Read, Update, Delete) pattern used across all API endpoints in the application.

## Overview

Instead of having separate endpoints for create, update, and delete operations, we use proper HTTP verbs following REST conventions:

- **POST** `/api/{resource}/mutate` - Create operations
- **PUT** `/api/{resource}/mutate` - Update operations
- **DELETE** `/api/{resource}/mutate/{id}` - Delete operations

## Endpoint Structure

All CRUD endpoints follow this RESTful pattern:

- **POST** `/api/{resource}/mutate` - Create operations
- **PUT** `/api/{resource}/mutate` - Update operations
- **DELETE** `/api/{resource}/mutate/{id}` - Delete operations (ID passed as path parameter)

## Request Format

All requests send the resource data directly in the request body. The HTTP verb determines the operation type.

**For POST requests (create):**

```json
{
  // ... resource-specific fields (without ID)
}
```

**For PUT requests (update):**

```json
{
  "{resource}Id": <number>,
  // ... fields to update
}
```

**For DELETE requests:**

The ID is passed as a path parameter:

```
DELETE /api/{resource}/mutate/{id}
```

The HTTP verb determines the operation type, eliminating the need for an `action` field or `data` wrapper. All delete operations use a path parameter for the ID, making the API more RESTful.

## Operations

### 1. Create (POST)

Creates a new record. Does not require an ID.

**Request:**

```http
POST /api/{resource}/mutate HTTP/1.1
Content-Type: application/json

{
  // ... resource-specific fields (without ID)
}
```

**Response:**

- Status: `201 Created`
- Body: `{ success: true, data: {...} }`

**Example (Flat):**

```http
POST /api/flats/mutate HTTP/1.1
Content-Type: application/json

{
  "floorNumber": 1,
  "flatNumber": "G003",
  "status": "vacant"
}
```

### 2. Update (PUT)

Updates an existing record. Requires the resource ID.

**Request:**

```http
PUT /api/{resource}/mutate HTTP/1.1
Content-Type: application/json

{
  "{resource}Id": <number>,
  // ... fields to update
}
```

**Response:**

- Status: `200 OK`
- Body: `{ success: true, data: {...} }`

**Example (Flat):**

```http
PUT /api/flats/mutate HTTP/1.1
Content-Type: application/json

{
  "flatId": 1,
  "floorNumber": 2,
  "status": "occupied"
}
```

**Note:** Only include fields you want to update. The ID field is required to identify the record.

### 3. Delete (DELETE)

Deletes an existing record. Uses the DELETE HTTP verb. Requires only the resource ID.

**Request:**

```http
DELETE /api/{resource}/mutate/{id} HTTP/1.1
```

**Response:**

- Status: `200 OK`
- Body: `{ success: true, message: "... deleted successfully" }`

**Example (Flat):**

```http
DELETE /api/flats/mutate/1 HTTP/1.1
```

**Note:** All delete operations use a path parameter for the ID, making the API more RESTful and eliminating the need for a request body.

## Resource-Specific IDs

Each resource uses its own ID field name:

| Resource  | ID Field Name |
| --------- | ------------- |
| Flats     | `flatId`      |
| Residents | `residentId`  |
| Payments  | `paymentId`   |

## Error Handling

All endpoints return consistent error responses:

### Validation Errors (400)

```json
{
  "message": "Validation error",
  "error": [
    {
      "path": ["fieldName"],
      "message": "Validation error message"
    }
  ]
}
```

### Not Found (404)

```json
{
  "message": "Not found",
  "error": "{Resource} not found"
}
```

### Conflict (409)

```json
{
  "message": "Resource already exists",
  "error": "A {resource} with this {field} already exists"
}
```

### Server Error (500)

```json
{
  "message": "Error while processing {resource} action",
  "error": "Error message"
}
```

## Examples

### Flats API

#### Create

```http
POST /api/flats/mutate HTTP/1.1
Content-Type: application/json

{
  "floorNumber": 1,
  "flatNumber": "G003",
  "bedrooms": 2,
  "bathrooms": 1,
  "status": "vacant"
}
```

#### Update

```http
PUT /api/flats/mutate HTTP/1.1
Content-Type: application/json

{
  "flatId": 1,
  "status": "occupied",
  "monthlyRent": "15000"
}
```

#### Delete

```http
DELETE /api/flats/mutate/1 HTTP/1.1
```

### Residents API

#### Create

```http
POST /api/residents/mutate HTTP/1.1
Content-Type: application/json

{
  "flatId": 2,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "leaseStartDate": "2024-01-01",
  "isPrimaryTenant": true
}
```

#### Update

```http
PUT /api/residents/mutate HTTP/1.1
Content-Type: application/json

{
  "residentId": 1,
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567891"
}
```

#### Delete

```http
DELETE /api/residents/mutate/1 HTTP/1.1
```

### Payments API

#### Create

```http
POST /api/payments/mutate HTTP/1.1
Content-Type: application/json

{
  "flatId": 2,
  "residentId": 1,
  "amount": "2000.00",
  "paymentDate": "2024-01-15",
  "status": "paid",
  "paymentMethod": "UPI",
  "paymentType": "maintenance"
}
```

#### Update

```http
PUT /api/payments/mutate HTTP/1.1
Content-Type: application/json

{
  "paymentId": 1,
  "status": "paid",
  "paymentMethod": "Bank Transfer",
  "receiptUrl": "https://example.com/receipt.pdf"
}
```

#### Delete

```http
DELETE /api/payments/mutate/1 HTTP/1.1
```

## Benefits of This Pattern

1. **RESTful**: Uses proper HTTP verbs (POST for create, PUT for update, DELETE for delete)
2. **Simplicity**: No action field or data wrapper needed - HTTP verb indicates the operation
3. **Consistency**: All resources follow the same pattern
4. **Standards-compliant**: Follows REST conventions and HTTP standards
5. **Type Safety**: TypeScript types ensure correct usage
6. **Validation**: Unified validation and error handling
7. **Clean API**: Direct resource data in request body, no unnecessary nesting

## Implementation Notes

- All endpoints validate input using Zod schemas
- Foreign key constraints are checked before operations
- Cascade deletes are handled automatically by the database
- Unique constraint violations return 409 status codes
- All operations are transactional

## Future Enhancements

Potential additions to this pattern:

- `action: "bulk_create"` - Create multiple records at once
- `action: "bulk_update"` - Update multiple records at once
- `action: "bulk_delete"` - Delete multiple records at once
- `action: "upsert"` - Create or update based on existence
