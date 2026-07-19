# ArenaMind AI Background Jobs & Scheduler

This framework establishes our generic batch and async processing system, built natively onto the Phase 2E.1 foundation.

## Core Concepts

### `MemoryQueue`

We use an `IQueue` abstraction. Currently backed by a `MemoryQueue`, this allows for safe non-blocking async execution off the main request thread. It will be swapped to Redis/BullMQ seamlessly in production by just providing a different class that implements `IQueue`.

### `Worker`

The `Worker` consumes items from the queue. It leverages our Phase 2E.1 `withRetry` infrastructure to handle transient failures safely, tracking attempts, backoff, and ultimately routing terminal failures to a Dead-Letter Queue metric state.

### `Scheduler`

The `Scheduler` allows us to dispatch tasks based on intervals (or mock cron intervals).

## How to Build a Job

1. Define a runnable job:

```typescript
import { IRunnableJob } from '@/lib/infrastructure/jobs/job.interface';

export const MyJob: IRunnableJob = {
  name: 'domain:my-job',
  async execute(data) {
    // do work
  },
};
```

2. Register it in the registry (typically in the module's index file or startup script):

```typescript
import { jobRegistry } from '@/lib/infrastructure/jobs/job-registry';
jobRegistry.register(MyJob);
```

3. Add it to the queue anywhere in the app:

```typescript
queue.add(
  'domain:my-job',
  { id: 123 },
  { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
);
```
