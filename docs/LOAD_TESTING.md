# Load Testing Strategy

Load tests are configured via `k6` in the `load-tests/` directory to simulate realistic traffic.

## Objective

The load tests ramp virtual users (VUs) dynamically from 100 to 5000 concurrent sessions, ensuring that:

1. P95 API latencies remain strictly beneath 500ms.
2. Error rates across the entire application remain less than 1%.

## Running the Tests

To execute load tests locally:

```bash
# Start your local environment
pnpm run dev

# Run k6
k6 run load-tests/k6-load-test.js
```
