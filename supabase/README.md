# ArenaMind AI - Database Foundation

This directory manages the Supabase integration and raw SQL migrations that sit alongside our Prisma schema.

## Architecture Notes

ArenaMind AI uses a **hybrid database management strategy**:

1. **Prisma (`prisma/schema.prisma`)**: Acts as the single source of truth for tables, columns, relations, and enums. It provides the Type-Safe ORM client for Next.js.
2. **Supabase Migrations (`supabase/migrations/`)**: Manage Postgres-native features that Prisma cannot express:
   - Row Level Security (RLS) policies
   - Advanced Indexes (GIN, BRIN, Partial)
   - Triggers and Functions (Audit, Health Score)
   - Realtime logical replication configurations
   - Materialized Views (Analytics)
   - Storage Buckets and Policies

## Connection Strategy

In production (`prisma.config.ts`), we enforce the following configuration to ensure connection pooling and migration stability:

- `DATABASE_URL`: Connection string to the **Transaction Pooler** (e.g. `postgres://[user]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`)
- `DIRECT_URL`: Connection string to the **Session** port (5432) used **only** for migrations (`npx prisma migrate dev`).

> [!WARNING]  
> Never run migrations through the `6543` connection pooler. It will hang due to pgbouncer transaction mode not supporting structural DDL commands safely.

## Migration Guide

When adding new tables or columns:

1. Update `prisma/schema.prisma`.
2. Generate the Prisma migration SQL using `prisma migrate diff`:
   ```bash
   npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > supabase/migrations/<timestamp>_prisma_update.sql
   ```
3. Create a new Supabase migration for any related RLS policies or triggers:
   ```bash
   npx supabase migration new add_rls_for_new_table
   ```

## Rollback and Recovery Instructions

If a deployment fails, use the following procedures to safely recover the database.

### Rolling Back a Migration

Prisma migrations combined with Supabase migrations require manual down-scripts if deployed strictly via Supabase. If you must reverse a migration locally:

```bash
npx supabase migration down
```

For production, create a revert migration script and push it forward:

```bash
npx supabase migration new revert_bad_migration
# Add the revert SQL
npx supabase db push
```

### Point-in-Time Recovery (PITR)

ArenaMind AI production utilizes Supabase PITR. If a catastrophic data loss occurs (e.g. accidental `DROP TABLE`), access the Supabase Dashboard -> Database -> Backups -> Point in Time and restore to the exact minute before the failure. Do not attempt to run `prisma migrate resolve` if doing a PITR.

## Seed Guide

The `supabase/seed.sql` file contains a minimal, realistic snapshot of a FIFA World Cup 2026 match at Lusail Stadium.
To reset the local database with this seed data:

```bash
npx supabase db reset
```
