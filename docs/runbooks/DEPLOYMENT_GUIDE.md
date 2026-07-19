# ArenaMind AI Deployment Guide

## Pre-Deployment (Startup Validation)

ArenaMind AI natively protects itself from bad deployments. When the server boots, `bootstrapManager.validateStartup()` is executed.
If `DATABASE_URL` is missing, or the database is unreachable, the pod will exit with code 1. **Do not disable this check.** It guarantees we never route traffic to a broken node.

## Deployment Steps

1. **Build**: `npm run build`
2. **Migrate**: `npx prisma migrate deploy`
3. **Start**: `npm run start`

## Rollback Strategy

If a deployment fails:

1. Revert to the previous container image hash.
2. If a database migration caused the issue, follow the explicit Database Downgrade Protocol (Not covered here). Note: ArenaMind AI migrations are mostly non-destructive by design.
3. Verify `/api/ops/version` reflects the rolled-back hash.

## Graceful Shutdown

During Rolling Updates, Kubernetes sends a `SIGTERM` signal.
Our `shutdownManager` catches this and:

- Finishes current queue jobs.
- Disconnects Prisma (`prisma.$disconnect()`).
- Exits cleanly (0).
  This guarantees zero dropped events during deployments.
