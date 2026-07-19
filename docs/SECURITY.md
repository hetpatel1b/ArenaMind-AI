# Enterprise Security Architecture

ArenaMind's Phase 19 Security Hardening introduces a defense-in-depth approach tailored for Fortune 100 environments.

## Edge Security Headers

All incoming traffic is processed by the Next.js Edge `middleware.ts`, which injects:

- **Strict Content Security Policy (CSP)**: Eliminates XSS vectors by tightly restricting script execution origins and entirely disabling untrusted `eval()`.
- **HSTS Preloading**: Mandates strict HTTPS encryption across all client interactions for a minimum of 365 days.
- **X-Frame-Options (DENY)**: Completely neutralizes Clickjacking attempts.

## Rate Limiting & Abuse Prevention

The `RateLimiter` enforces strict sliding-window request budgets backed by Redis.

- If an IP exceeds thresholds, an HTTP 429 is instantly returned containing a `Retry-After` header.
- A Fail-Open strategy is employed: if Redis fails, the system logs a `WARNING` and permits traffic rather than causing a cascading outage.

## Input Validation

The API layer defends against malformed or malicious payloads via `ValidationService`:

- Strict Zod schemas map 1:1 with API contracts.
- **Payload Limits**: Max payload sizes are enforced (e.g., 2MB max JSON).
- The `GlobalErrorHandler` intercepts all Zod validations, strips internal details in production, and standardizes 400 Bad Request responses.
