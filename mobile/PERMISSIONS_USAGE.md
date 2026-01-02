# Permissions System Usage Guide

## Overview

The permissions system uses Zustand for global state management and provides hooks for easy permission checking throughout the app.

## Installation

First, install Zustand:

```bash
cd mobile
pnpm add zustand
```

## Usage Examples

### 1. Check Single Permission

```tsx
import { useHasPermission } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

function MyComponent() {
  const canViewLedger = useHasPermission(PERMISSIONS.LEDGER.VIEW);

  if (!canViewLedger) {
    return <Text>Access Denied</Text>;
  }

  return <LedgerView />;
}
```

### 2. Check Multiple Permissions (Any)

```tsx
import { useHasAnyPermission } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

function MyComponent() {
  const canManageLedger = useHasAnyPermission([
    PERMISSIONS.LEDGER.CREATE,
    PERMISSIONS.LEDGER.UPDATE,
    PERMISSIONS.LEDGER.DELETE,
  ]);

  return <View>{canManageLedger && <Button title="Manage Ledger" />}</View>;
}
```

### 3. Check Multiple Permissions (All)

```tsx
import { useHasAllPermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

function AdminPanel() {
  const isFullAdmin = useHasAllPermissions([
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.ROLES.ASSIGN,
  ]);

  return isFullAdmin ? <AdminView /> : <LimitedView />;
}
```

### 4. Get All Permissions

```tsx
import { usePermissions } from "@/hooks/usePermissions";

function DebugScreen() {
  const permissions = usePermissions();

  return (
    <View>
      <Text>Your Permissions:</Text>
      {permissions.map((perm) => (
        <Text key={perm}>{perm}</Text>
      ))}
    </View>
  );
}
```

### 5. Conditional Rendering Based on Permissions

```tsx
import { useHasPermission } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

function FlatsScreen() {
  const canCreate = useHasPermission(PERMISSIONS.FLATS.CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.FLATS.UPDATE);
  const canDelete = useHasPermission(PERMISSIONS.FLATS.DELETE);

  return (
    <View>
      <FlatList data={flats} />
      {canCreate && <Button title="Add Flat" onPress={handleAdd} />}
      {canUpdate && <Button title="Edit" onPress={handleEdit} />}
      {canDelete && <Button title="Delete" onPress={handleDelete} />}
    </View>
  );
}
```

### 6. Using Store Directly

```tsx
import { useAuthStore } from "@/store/authStore";
import { PERMISSIONS } from "@/lib/permissions";

function MyComponent() {
  const { hasPermission, user, permissions } = useAuthStore();

  const canView = hasPermission(PERMISSIONS.LEDGER.VIEW);

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
      <Text>Role: {user?.roleName || "No role"}</Text>
      {canView && <LedgerView />}
    </View>
  );
}
```

## Backend Permission Middleware Usage

### Example: Protect a Route

```typescript
import { authenticateToken, requirePermission } from "../middleware/auth";
import { PERMISSIONS } from "../lib/permissions";
import { ledgerRouter } from "./ledger";

// Protect route with specific permission
router.post(
  "/create",
  authenticateToken,
  requirePermission(PERMISSIONS.LEDGER.CREATE),
  createLedgerEntry
);

// Protect route with any of multiple permissions
router.put(
  "/update/:id",
  authenticateToken,
  requireAnyPermission([PERMISSIONS.LEDGER.UPDATE, PERMISSIONS.LEDGER.CREATE]),
  updateLedgerEntry
);
```

## Available Permissions

- **LEDGER**: VIEW, CREATE, UPDATE, DELETE
- **FLATS**: VIEW, CREATE, UPDATE, DELETE
- **RESIDENTS**: VIEW, CREATE, UPDATE, DELETE
- **USERS**: VIEW, CREATE, UPDATE, DELETE
- **ROLES**: VIEW, CREATE, UPDATE, DELETE, ASSIGN
- **REPORTS**: VIEW, EXPORT

## Notes

- Permissions are automatically loaded on login
- Permissions are persisted in AsyncStorage via Zustand
- The store initializes automatically when the app starts
- Permissions are included in the login response from the backend
