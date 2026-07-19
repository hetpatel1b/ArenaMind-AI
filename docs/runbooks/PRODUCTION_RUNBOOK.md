# ArenaMind AI Production Runbook

This guide covers incident response protocols for ArenaMind AI.

## Quick Diagnostic Checklist

1. **Check System Status**: Hit `/api/ops/status`. If it returns 503, review the `components` JSON to isolate the fault (Database, Cache, Queue, Providers).
2. **Check Runtime Metrics**: Hit `/api/ops/metrics`. Look for `heapUsedMb` approaching `heapTotalMb` which indicates a memory leak.
3. **Verify Build Version**: Hit `/api/ops/version` to ensure the currently deployed hash matches the expected release branch.

## High Load Incidents

If the system is buckling under stadium telemetry:

1. Identify the bottleneck via `/api/ops/metrics` (CPU bounds vs Memory bounds).
2. If the API is failing but the Queue is healthy, consider scaling the web pods.
3. If background tasks are stalling, review the DLQ logs via the `ErrorTracker`.

## Enabling Maintenance Mode

If you need to rapidly halt processing without tearing down the infrastructure:

```javascript
import { maintenanceManager } from '@/lib/infrastructure/ops/maintenance';
maintenanceManager.enable('Emergency DB Upgrade', 'admin-uuid-123');
```

This forces `/api/ops/status` to return 503 Maintenance immediately, causing ingress gateways to display the friendly maintenance page.
