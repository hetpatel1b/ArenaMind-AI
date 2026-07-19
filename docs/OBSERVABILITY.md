# Observability & Log Aggregation

ArenaMind utilizes a modernized logging infrastructure prepared for seamless ingestion by Datadog, ELK, and Cloud Logging.

## LoggerService

The `LoggerService` outputs structured JSON logs. Every log entry automatically contains:

- Accurate UTC timestamps
- Log severity levels
- Surrounding execution context

## Tracing and Correlation

`RequestCorrelation` dynamically injects:

- `requestId`: Unique identifier for the specific HTTP request.
- `correlationId`: Identifier passed from downstream microservices or clients to trace full lifecycles.
- `userId` & `organizationId`: Tenant isolation context to quickly debug tenant-specific regressions.

## AI Provider Monitoring

The `AIProviderMonitor` ensures transparency over external language models:

- Evaluates primary (Grok) and fallback (Gemini) reliability.
- Tracks exact token usage for cost estimation.
- Monitors failover frequency to detect upstream degradation.
