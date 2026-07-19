# Alerting System

ArenaMind utilizes an internal `AlertManager` designed to interface seamlessly with enterprise incident response platforms (PagerDuty, Opsgenie, Datadog Monitors).

## Alert Categories

- `INFO`: Normal operational events of interest (e.g., successful backup).
- `WARNING`: Sub-optimal conditions that do not cause immediate outages (e.g., AI fallback activated, elevated memory).
- `CRITICAL`: Immediate threat to platform stability (e.g., Database disconnected, Redis offline, OOM).

## Mechanism

When a monitor detects a threshold breach, it dispatches an event to the `AlertManager`. The AlertManager aggregates these events and leverages the structured `LoggerService` to output heavily tagged logs, triggering upstream alarms automatically based on severity.
