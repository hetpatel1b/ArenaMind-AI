# ArenaMind Database Schema

## Overview

ArenaMind leverages PostgreSQL + Prisma. The schema is highly relational, enforcing strict foreign key constraints and `UUID` based primary keys for distributed generation.

## Tenancy

Every operational record is strictly tied to a `Organization` or `Venue` (which itself ties to an Organization). This allows strict multi-tenant isolation via the Prisma Repository generic filtering logic.

## Core Entities

- **Organization**: Top-level tenant container.
- **Venue**: Physical stadium/arena scoped to an Organization.
- **Match**: A specific event instance mapped to a Venue.
- **User**: Scoped to an Organization, linked with Auth.js (NextAuth).
- **Incident**: Tracked occurrences during Matches.
- **MobilitySnapshot, CrowdSnapshot, KpiSnapshot, HealthScore**: Telemetry metrics securely recorded over time.

## Indexing Strategy

- **Primary**: All models use UUIDs.
- **Foreign Keys**: All relations have targeted B-tree indexes.
- **Composite**: `@@index([organizationId, deletedAt])` and `@@index([matchId, deletedAt])` applied universally to speed up soft-delete aware filtering queries.
