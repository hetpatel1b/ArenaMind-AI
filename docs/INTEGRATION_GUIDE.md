# ArenaMind AI Integration Guide

This guide details the integration architecture introduced in Phase 2E.4.

## Core Principle: The Adapter Pattern

ArenaMind AI must **never** directly couple to third-party SDKs (e.g., `@googlemaps/google-maps-services-js` or `@sendgrid/mail`) within the business logic layer (`src/lib/modules`).

Instead, business logic must rely purely on abstract interfaces located in `src/lib/integrations/`.

### Available Providers

- `IMapsProvider`: Route estimation and Geocoding.
- `IWeatherProvider`: Real-time weather and forecasting.
- `INotificationProvider`: Unified SMS and Email delivery.
- `IAiProvider`: Text generation foundation for Phase 3.

## HTTP Client

If you need to build a new concrete implementation (e.g., a real Google Maps provider), you must use our internal `HttpClient` (`src/lib/integrations/client/http-client.ts`).
Do not use raw `fetch` or `axios`. The `HttpClient` automatically wraps your calls in the Phase 2E.1 `withRetry` logic and `CircuitBreaker`, guaranteeing that external outages do not take down ArenaMind AI.

## Webhooks

Use the `webhookService` to verify incoming vendor payloads via HMAC `sha256` signatures, and to safely dispatch outbound webhooks to stadium legacy systems.
