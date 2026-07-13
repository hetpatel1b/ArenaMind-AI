# ArenaMind AI - Backend Core Architecture

This directory (`src/lib`) contains the enterprise backend foundation based on Domain-Driven Design (DDD) and Clean Architecture.

## Architecture Layers

The backend strictly enforces the following dependency flow:
**Route Handlers** → **Services** → **Repositories** → **Database (Prisma)**

Reverse dependencies are cryptographically blocked by ESLint.

### 1. Domain (`/domain`)

Contains the purest business logic, constants, `ValueObjects`, and `DomainEvents`.
**Rule:** The Domain layer cannot import anything outside of `/domain`. No Prisma. No external libraries.

### 2. Repositories (`/repositories`)

Abstracts database access.

- Always extend `PrismaRepository<TEntity, TCreate, TUpdate>`.
- Do not place business logic in the repository. It only executes queries.

### 3. Services (`/services`)

Orchestrates business logic and transactions.

- Always extend `BaseService` to inherit automated observability, logging, and security context wrapping.
- All service methods must accept a `BusinessContext` to track `stadiumId`, user roles, and `correlationId`s for tracing.

### 4. Validation (`/validation`)

Use `validateDto(schema, data)` at the absolute edge (Route Handlers) to parse input.

- Services should assume data entering them is already 100% valid and correctly typed.

### 5. Errors (`/errors`)

Do not throw raw `Error` or return HTTP responses directly from services.

- Always `throw new ApplicationError` (e.g., `NotFoundError`, `ConflictError`).
- Route Handlers will catch these and use `mapErrorToResponse()` to securely map them to `NextResponse`.

### 6. Observability (`/observability`)

Use the structured `logger`. Do not use `console.log`.

```typescript
import { logger } from '@/lib/observability/logger';
logger.info('Action performed', { correlationId: context.correlationId, someData: 123 });
```
