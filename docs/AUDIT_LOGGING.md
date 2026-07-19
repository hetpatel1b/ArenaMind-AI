# Audit Logging

## Philosophy

Every state mutation within ArenaMind is treated as a critical operational event. We cannot rely solely on standard application logs to understand user intent.

## Database Audit Trail

All mutations triggered via `useGenericMutation` dispatch to backend controllers which, upon successful execution, automatically invoke the `AuditService`.
A record is placed in the `AuditLog` table containing:

- `action`: The exact atomic permission or action name.
- `userId`: The operator who performed the action.
- `organizationId`: Tenant mapping.
- `targetType` & `targetId`: The entity modified (e.g., Incident, WorkforceUnit).
- `oldState` & `newState`: A JSON diff payload for point-in-time recovery and accountability.

## Standard Logger

The `LoggerService` writes all JSON outputs to `stdout`. These are ingested by cloud providers (AWS CloudWatch / Datadog) to create the immutable correlation-id linked operational trace.
