# Role-Based Access Control (RBAC)

## Roles

- `system_admin`: Full global access across all tenants.
- `org_admin`: Full administrative access scoped to a single `organizationId`.
- `command_center_chief`: Full operational access to manipulate and dispatch resources, scoped to a specific Match/Venue.
- `read_only_analyst`: Can view metrics and dashboards, but cannot perform actionable mutations.

## Enforcement

Roles are strictly enforced via the `createRouteHandler` factory:

```typescript
export const POST = createRouteHandler(handler, {
  requireAuth: true,
  allowedRoles: ['org_admin', 'command_center_chief'],
});
```

## Permissions

Beyond generic roles, specific atomic permissions (e.g., `DEPLOY_WORKFORCE`, `TRIGGER_EVACUATION`) are verified. The `BusinessContext` extracts the current role, and the system verifies if the role grants the required atomic permission.
