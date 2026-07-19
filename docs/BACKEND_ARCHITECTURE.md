# ArenaMind Backend Architecture

## Overview

The ArenaMind backend is designed as a Fortune 100 enterprise-grade platform. It adheres to strict Multi-Tenancy isolation, Role-Based Access Control (RBAC), and centralized API routing constraints.

## Core Pillars

1. **Next.js API Routes (`src/app/api/`)**: Handlers designed primarily to extract standard HTTP concepts, delegating all domain logic to the service layer.
2. **Factory-Driven API (`createRouteHandler`)**: Wraps all handlers, guaranteeing execution timing, structured logging with correlation IDs, automatic Error boundaries, Rate Limiting, and ETags.
3. **Service Layer (`src/lib/modules/`)**: Fully isolated business logic enforcing standard rules and validation. No request objects enter here.
4. **Data Access Layer (`src/lib/repositories/`)**: Generics-driven Prisma Repositories intercepting all database calls. Enforces soft deletes and limits cross-tenant access seamlessly.
5. **Observability (`src/lib/observability/`)**: Standardized `LoggerService` generating pure JSON structured logs for DataDog/Splunk ingestions.

## Folder Structure

```
src/lib/
  ├── api/             # Middleware, factories, caching, rate limiting
  ├── auth/            # JWT, Sessions, Policies
  ├── errors/          # Common error subclasses
  ├── observability/   # Logger, Metrics, APM Tracer
  ├── repositories/    # Database boundary
  └── modules/         # Core business domains (e.g., Match, Venue)
```
