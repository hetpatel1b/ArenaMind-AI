# Platform Monitoring Architecture

ArenaMind's Monitoring Services actively track the health and performance of the enterprise platform in real-time.

## System Monitoring (`MonitoringService`)

Tracks node-level metrics:

- Process Uptime
- CPU and Memory Usage
- V8 Heap Statistics (used, total, limits)
- Garbage Collection events and durations

## Request Analytics (`RequestMetricsService`)

Provides deep insight into incoming traffic:

- Active vs. Total Requests
- Average latency
- p95 and p99 Latency percentiles
- Requests per minute and error rates

## Database & Cache Metrics

- `DatabaseMonitor` tracks active PostgreSQL connection pool usage, slow queries, and overall DB health.
- `RedisMonitor` evaluates cache hit/miss rates, memory footprint, and eviction rates to prevent cache exhaustion.

## Queue Tracking

- `QueueMonitor` provides visibility into background job depth, failures, and Dead Letter Queue buildup.
