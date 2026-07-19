# ArenaMind AI Infrastructure Guide

This guide covers the shared infrastructure abstractions developed in Phase 2E.1. These abstractions must be used by all subsequent domain and operational modules.

## Principles

1. **Never import external client libraries directly into business logic**. Use these abstractions.
2. **Fail Fast**: Use circuit breakers and readiness probes to prevent catastrophic failure loops.

## Core Modules

### 1. Configuration (`src/lib/infrastructure/config/env.ts`)

We use Zod to parse `process.env`. This provides strict typing across the app.

```typescript
import { config } from '@/lib/infrastructure/config/env';
console.log(config.NODE_ENV); // strictly typed
```

### 2. Events (`src/lib/infrastructure/events/event-dispatcher.ts`)

In-memory Pub/Sub for decoupling domain events.

```typescript
import { eventDispatcher } from '@/lib/infrastructure/events/event-dispatcher';

eventDispatcher.subscribe('INCIDENT_CREATED', async (payload) => { ... });
eventDispatcher.publish('INCIDENT_CREATED', { id: '123' });
```

### 3. Caching (`src/lib/infrastructure/cache/`)

Provides a unified `ICache` interface, currently backed by an in-memory TTL map.

### 4. Utilities

- **Retry**: `withRetry(async () => {}, { maxRetries: 3 })` for robust external calls.
- **Circuit Breaker**: `new CircuitBreaker()` for failing external services rapidly when they are down.

### 5. Health Probes

We adhere to standard Kubernetes health probes:

- `/api/live`: Lightweight process check.
- `/api/ready`: Dependency check (Database connection).
- `/api/health`: Deep diagnostic check (All dependencies and internal state).
