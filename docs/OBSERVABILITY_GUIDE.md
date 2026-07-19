# ArenaMind AI Observability Guide

This guide covers the core observability pillars built during Phase 2E.3. We enforce zero-dependency abstractions so that local development relies on `console` while production can hot-swap these classes with Datadog, Sentry, or OpenTelemetry SDKs.

## 1. Structured Logging

Use the `logger` exclusively instead of `console.log`.

```typescript
import { logger } from '@/lib/observability/logger';
logger.info('User logged in', { userId: '123', correlationId: 'abc-xyz' });
```

## 2. Performance Tracking

Wrap heavy database queries or external API calls in `performance.trackExecution`. It automatically creates a Trace span, records duration in the Histogram, and logs a warning if the threshold is breached.

```typescript
import { performance } from '@/lib/observability/performance';
const user = await performance.trackExecution(
  'Find User DB Query',
  200, // max allowed ms
  () => prisma.user.findUnique({ where: { id } })
);
```

## 3. Error Tracking

Never throw unhandled errors into the void. Use the `errorTracker` to categorize and alert.

```typescript
import { errorTracker, ErrorSeverity } from '@/lib/observability/error-tracker';

try {
  await doWork();
} catch (err) {
  errorTracker.captureException(err, ErrorSeverity.CRITICAL, { contextId: '456' });
}
```

## 4. Metrics

Expose high-level operational counts via `metrics`.

```typescript
import { metrics } from '@/lib/observability/metrics';
metrics.incrementCounter('api_requests', 1, { route: '/api/v1/incidents' });
metrics.setGauge('active_users', 42);
```

## 5. Audit Logging

For sensitive compliance events (RBAC mutations, security boundaries), use `auditLogger` to write immutably to the database table while simultaneously shipping the JSON payload to our SIEM via the stdout logger.
