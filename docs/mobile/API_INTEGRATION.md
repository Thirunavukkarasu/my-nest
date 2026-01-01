# API Integration Guide

This document describes how the mobile app integrates with the web app's API.

## Overview

The mobile app now uses the real API from the web app instead of mock data. All API calls are handled through a centralized API client service.

## Architecture

### API Client (`apps/mobile/lib/api.ts`)

Centralized API client that handles:

- Base URL configuration via environment variables
- Request/response handling
- Error handling
- Authentication token management
- Type-safe API methods

### Type Adapters (`apps/mobile/lib/adapters.ts`)

Converts API response types (matching database schema) to mobile app types:

- `adaptFlat()` - Converts API Flat to Mobile Flat
- `adaptResident()` - Converts API Resident to Mobile Resident
- `adaptPayment()` - Converts API Payment to Mobile Payment

### Updated Screens

All screens now fetch data from the API:

- **Flats Screen** (`app/flats.tsx`) - Fetches flats with pagination
- **Residents Screen** (`app/residents.tsx`) - Fetches residents with pagination
- **Payments Screen** (`app/payments.tsx`) - Fetches payments with pagination
- **Login Screen** (`app/login.tsx`) - Uses API authentication

## Setup

### 1. Environment Variables

Create a `.env` file in `apps/mobile`:

```bash
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# For production, use your deployed API URL
# EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
```

**Note**: Expo requires the `EXPO_PUBLIC_` prefix for environment variables to be accessible in the app.

### 2. Start the Web App

Make sure the web app is running:

```bash
cd apps/web
pnpm dev
```

The API will be available at `http://localhost:3000/api`

### 3. Start the Mobile App

```bash
cd apps/mobile
pnpm start
```

## API Endpoints Used

### Flats

- **GET**: `POST /api/flats` - Get paginated list of flats
  - Request body: `{ page, limit, searchCriterias[], sortCriterias[] }`
  - Response: `{ data: Flat[], pagination: {...} }`

### Residents

- **GET**: `POST /api/residents` - Get paginated list of residents
  - Request body: `{ page, limit, searchCriterias[], sortCriterias[] }`
  - Response: `{ data: Resident[], pagination: {...} }`

### Payments

- **GET**: `POST /api/payments` - Get paginated list of payments
  - Request body: `{ page, limit, searchCriterias[], sortCriterias[] }`
  - Response: `{ data: Payment[], pagination: {...} }`

### Authentication

- **Login**: `POST /api/auth/signin` - Authenticate user
  - Request body: `{ email, password }`
  - Response: Session token/user data

**Note**: NextAuth authentication flow may need adjustment for mobile. See "Authentication" section below.

## Type Mapping

### Flats

| API Field                     | Mobile Field | Notes                            |
| ----------------------------- | ------------ | -------------------------------- |
| `flatId`                      | `id`         | Converted to string              |
| `floorNumber`                 | `floor`      | Direct mapping                   |
| `flatNumber`                  | `flatNumber` | Direct mapping                   |
| `status` / `residents.length` | `isOccupied` | Derived from status or residents |

### Residents

| API Field              | Mobile Field | Notes                       |
| ---------------------- | ------------ | --------------------------- |
| `residentId`           | `id`         | Converted to string         |
| `firstName + lastName` | `name`       | Combined                    |
| `phone`                | `phone`      | Direct mapping              |
| `email`                | `email`      | Direct mapping              |
| `isPrimaryTenant`      | `type`       | Maps to 'owner' or 'tenant' |
| `flatId`               | `flatId`     | Converted to string         |

### Payments

| API Field     | Mobile Field | Notes                                   |
| ------------- | ------------ | --------------------------------------- |
| `paymentId`   | `id`         | Converted to string                     |
| `residentId`  | `residentId` | Converted to string                     |
| `flatId`      | `flatId`     | Converted to string                     |
| `amount`      | `amount`     | Parsed from decimal string              |
| `paymentType` | `type`       | Maps to 'maintenance' or 'payout'       |
| `paymentDate` | `month`      | Extracted as YYYY-MM                    |
| `status`      | `status`     | Maps to 'paid', 'pending', or 'overdue' |

## Authentication

Currently, the login screen calls `apiClient.login()`, which attempts to authenticate via NextAuth. However, NextAuth is designed for web sessions and may need adjustment for mobile apps.

### Current Implementation

- Uses email/password
- Calls `/api/auth/signin` endpoint
- Stores session (TODO: implement token storage)

### Future Improvements

1. **JWT Token Storage**: Store auth tokens securely using `expo-secure-store`
2. **Token Refresh**: Implement token refresh logic
3. **Session Management**: Handle session expiration
4. **Alternative Auth**: Consider creating a dedicated mobile auth endpoint

## Error Handling

All API calls include error handling:

- Network errors are caught and displayed to the user
- API errors are parsed and shown in alerts
- Loading states are managed per screen

## Testing

### Local Development

1. Start web app: `cd apps/web && pnpm dev`
2. Start mobile app: `cd apps/mobile && pnpm start`
3. Ensure `.env` file has correct `EXPO_PUBLIC_API_URL`

### Testing on Device

- For physical device: Use your computer's IP address
  - `EXPO_PUBLIC_API_URL=http://192.168.1.X:3000/api`
- For emulator/simulator:
  - iOS Simulator: `http://localhost:3000/api`
  - Android Emulator: `http://10.0.2.2:3000/api`

## Next Steps

1. **Create Endpoints**: Add create/update/delete endpoints for flats, residents, and payments
2. **Authentication**: Implement proper JWT-based authentication for mobile
3. **Error Handling**: Add retry logic and better error messages
4. **Caching**: Implement response caching for better performance
5. **Offline Support**: Add offline data persistence

## Troubleshooting

### API calls fail with network error

- Check that web app is running
- Verify `EXPO_PUBLIC_API_URL` is set correctly
- Check network connectivity

### Authentication doesn't work

- NextAuth may need mobile-specific configuration
- Consider creating a dedicated mobile auth endpoint
- Check API logs for authentication errors

### Data doesn't match expected format

- Check type adapters in `lib/adapters.ts`
- Verify API response structure matches expectations
- Check console logs for API responses
