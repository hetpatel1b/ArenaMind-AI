# Multi-Tenancy Architecture

## Tenant Isolation Layer

ArenaMind implements "Logical Isolation" within a shared PostgreSQL database cluster.

## The Core Rule

Every incoming API request is stripped of user-provided tenant identifiers. Instead, the `route-factory.ts` middleware extracts the `organizationId` directly from the verified session JWT and places it into the secure server-side `BusinessContext`.

## Repository Filtering

The generic `PrismaRepository` intercepts all reads and writes, silently appending `{ organizationId: bizContext.venueId }` to every Prisma where clause. This mathematically guarantees that cross-tenant data leakage is impossible at the ORM layer.
