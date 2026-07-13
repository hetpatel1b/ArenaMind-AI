# ArenaMind AI - Authentication & Authorization

This module provides the security foundation for ArenaMind AI, enforcing both authentication (identity) and authorization (RBAC and multi-tenancy).

## Architecture

We use a hybrid approach:

- **Supabase Auth** handles identity, JWT creation, and session lifecycle.
- **Prisma User Table** handles extended profile data (Roles, Stadium ID, Status).
- **Next.js Middleware** handles edge route protection and JWT refresh.

## 1. Authentication (Identity)

### Client-Side

Use `useAuth()` to access the current session state.

```tsx
'use client';
import { useAuth } from '@/components/providers/auth-provider';

export function UserProfile() {
  const { user, signOut } = useAuth();
  return <button onClick={signOut}>Sign Out</button>;
}
```

### Server-Side

Use `getServerSession()` to securely retrieve the user context in Server Components or Route Handlers.

```tsx
import { getServerSession } from '@/lib/auth/server-session';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return <div>Welcome {session.email}</div>;
}
```

## 2. Authorization (RBAC & Multi-Tenancy)

ArenaMind AI requires strict enforcement of both **what** a user can do (Role) and **where** they can do it (Stadium).

### Enforcing Roles

Use `requireRole()` to restrict entire endpoints or pages to specific roles.

```typescript
import { requireRole } from '@/lib/auth/guards';
import { Roles } from '@/lib/auth/constants';

// In a Route Handler
export async function POST(req: Request) {
  const session = await requireRole([Roles.OPERATIONS_MANAGER, Roles.SYSTEM_ADMIN]);
  // Only Operations Managers and Admins can reach here
}
```

### Enforcing Granular Permissions

Use `requirePermission()` to check explicit capabilities defined in `permissions.ts`.

```typescript
import { requirePermission } from '@/lib/auth/guards';
import { Permissions } from '@/lib/auth/permissions';

export async function PATCH(req: Request) {
  const session = await requirePermission(Permissions.DISPATCH_RESOURCE);
  // Coordinator, Deputy Manager, and Ops Manager can reach here
}
```

### Enforcing Multi-Tenant Isolation

Use `requireStadiumAccess()` to ensure users only mutate data for their assigned stadium. (System Admins bypass this).

```typescript
import { requireStadiumAccess } from '@/lib/auth/guards';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestedStadiumId = searchParams.get('stadiumId');

  // Throws AuthorizationError if user.stadiumId !== requestedStadiumId
  await requireStadiumAccess(requestedStadiumId!);
}
```

## Error Handling

Guards throw specific Error classes (`AuthError`, `AuthorizationError`). Route handlers should catch these and return 401/403 HTTP responses respectively using the API error handler.
