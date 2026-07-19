# ArenaMind AI — API Specification Document

> **Product:** ArenaMind AI — The Intelligent Stadium Operations Copilot  
> **Document Type:** API Specification Document (ASD) — API Contract  
> **Version:** 1.0.0  
> **Status:** APPROVED — API Authority  
> **Last Updated:** July 12, 2026  
> **Document Owner:** Principal API Architecture, Staff Backend Engineering  
> **References:** [PRD v1.0.0](./ArenaMind_AI_PRD.md) · [TRD v1.0.0](./ArenaMind_AI_TRD.md) · [SAD v1.0.0](./ArenaMind_AI_SAD.md) · [Design Brief v1.0.0](./ArenaMind_AI_Design_Brief.md) · [DDD v1.0.0](./ArenaMind_AI_DDD.md)  
> **Runtime:** Next.js 15 (App Router) API Routes · TypeScript · Node.js  
> **Protocol:** REST (HTTP/1.1 + HTTP/2) + WebSocket (Supabase Realtime)  
> **Classification:** Internal — Engineering

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [API Design Principles](#2-api-design-principles)
3. [API Architecture](#3-api-architecture)
4. [Standard Response Format](#4-standard-response-format)
5. [Error Catalog](#5-error-catalog)
6. [Authentication](#6-authentication)
7. [Authorization — RBAC Matrix](#7-authorization--rbac-matrix)
8. [Rate Limiting](#8-rate-limiting)
9. [Request Validation](#9-request-validation)
10. [API Module: Authentication](#10-api-module-authentication)
11. [API Module: Users](#11-api-module-users)
12. [API Module: Stadiums](#12-api-module-stadiums)
13. [API Module: Matches](#13-api-module-matches)
14. [API Module: Zones](#14-api-module-zones)
15. [API Module: Crowd Intelligence](#15-api-module-crowd-intelligence)
16. [API Module: Incidents](#16-api-module-incidents)
17. [API Module: Resources](#17-api-module-resources)
18. [API Module: Accessibility](#18-api-module-accessibility)
19. [API Module: Alerts & Notifications](#19-api-module-alerts--notifications)
20. [API Module: Weather](#20-api-module-weather)
21. [API Module: AI](#21-api-module-ai)
22. [API Module: Analytics & KPIs](#22-api-module-analytics--kpis)
23. [API Module: Reports](#23-api-module-reports)
24. [API Module: Files](#24-api-module-files)
25. [API Module: Search](#25-api-module-search)
26. [API Module: Settings & Feature Flags](#26-api-module-settings--feature-flags)
27. [API Module: Admin](#27-api-module-admin)
28. [API Module: System Health](#28-api-module-system-health)
29. [WebSocket & Realtime API](#29-websocket--realtime-api)
30. [OpenAPI 3.1 Specification](#30-openapi-31-specification)
31. [Caching Strategy](#31-caching-strategy)
32. [Security Design](#32-security-design)
33. [Performance Targets](#33-performance-targets)
34. [Observability](#34-observability)
35. [API Versioning](#35-api-versioning)
36. [Testing Strategy](#36-testing-strategy)

---

## 1. Executive Summary

The ArenaMind AI API is a **resource-oriented REST API** built on Next.js 15 Route Handlers, serving the FIFA World Cup 2026 stadium operations platform across 16 simultaneous venues.

### API Key Numbers

| Metric                    | Value                                         |
| ------------------------- | --------------------------------------------- |
| Total REST endpoints      | 75+                                           |
| API version               | v1                                            |
| Base URL (production)     | `https://arenamind.ai/api/v1`                 |
| Base URL (staging)        | `https://staging.arenamind.ai/api/v1`         |
| Authentication            | Supabase JWT (Bearer token)                   |
| Authorization             | Database-level RLS + middleware RBAC          |
| Realtime protocol         | Supabase Realtime (WebSocket)                 |
| AI backend                | Google Gemini 2.0 Flash via server-side proxy |
| Max request body          | 10MB (files), 1MB (JSON)                      |
| Default rate limit        | 200 requests/minute/user                      |
| AI rate limit             | 10 requests/minute/stadium                    |
| Target P99 latency (CRUD) | < 200ms                                       |
| Target P99 latency (AI)   | < 8,000ms                                     |

### API Module Index

| Module                 | Base Path                           | Endpoints | Description                            |
| ---------------------- | ----------------------------------- | --------- | -------------------------------------- |
| Authentication         | `/api/v1/auth`                      | 5         | Login, logout, token refresh           |
| Users                  | `/api/v1/users`                     | 5         | User management and profiles           |
| Stadiums               | `/api/v1/stadiums`                  | 3         | Stadium configuration                  |
| Matches                | `/api/v1/matches`                   | 5         | Match lifecycle and phase management   |
| Zones                  | `/api/v1/zones`                     | 3         | Stadium zone configuration             |
| Crowd Intelligence     | `/api/v1/matches/:id/crowd`         | 6         | Live crowd density and prediction      |
| Incidents              | `/api/v1/matches/:id/incidents`     | 9         | Incident management and classification |
| Resources              | `/api/v1/matches/:id/resources`     | 7         | Resource deployment and tracking       |
| Accessibility          | `/api/v1/matches/:id/accessibility` | 3         | Accessibility request management       |
| Alerts & Notifications | `/api/v1/matches/:id/alerts`        | 5         | Alert management and notifications     |
| Weather                | `/api/v1/matches/:id/weather`       | 2         | Weather data management                |
| AI                     | `/api/v1/ai`                        | 10        | AI recommendations and analysis        |
| Analytics & KPIs       | `/api/v1/matches/:id/analytics`     | 4         | Performance metrics and KPIs           |
| Reports                | `/api/v1/matches/:id/reports`       | 5         | Report generation and export           |
| Files                  | `/api/v1/files`                     | 4         | File upload, download, management      |
| Search                 | `/api/v1/search`                    | 1         | Cross-entity global search             |
| Settings               | `/api/v1/settings`                  | 4         | Stadium settings and feature flags     |
| Admin                  | `/api/v1/admin`                     | 3         | Administrative operations              |
| System Health          | `/api/v1/health`                    | 3         | System status and health checks        |

---

## 2. API Design Principles

### P01 — Resource-Oriented Design

Every URL identifies a **resource**, not an action. Resources are nouns; HTTP methods are the verbs.

```
✅ CORRECT: POST /matches/{matchId}/incidents
❌ WRONG:   POST /createIncident

✅ CORRECT: PATCH /incidents/{id}
❌ WRONG:   POST /updateIncident/{id}

✅ CORRECT: DELETE /files/{id}
❌ WRONG:   POST /deleteFile
```

Exception: AI operations are actions that produce resources. They use POST to an action path (`/ai/operational-summary`). This is an intentional deviation from pure REST where the resource semantics don't fit the request model.

### P02 — URI Versioning

All API routes are versioned at the URI level: `/api/v1/`. This provides:

- Explicit version control in every request (no header parsing needed)
- Simple CDN and load balancer routing rules
- Immediate visibility in server logs

### P03 — HTTP Method Semantics

| Method | Semantics                      | Idempotent | Safe |
| ------ | ------------------------------ | ---------- | ---- |
| GET    | Retrieve resource(s)           | Yes        | Yes  |
| POST   | Create a new resource          | No         | No   |
| PUT    | Full replacement of a resource | Yes        | No   |
| PATCH  | Partial update of a resource   | Yes        | No   |
| DELETE | Soft delete a resource         | Yes        | No   |

**Note:** DELETE in ArenaMind AI always performs a **soft delete** (`deleted_at = NOW()`). No hard deletes are exposed via the API.

### P04 — Consistent Naming Conventions

```
Resource naming:    kebab-case plural nouns (/incidents, /crowd-data)
Path parameters:    camelCase suffixed with type hint (:matchId, :incidentId)
Query parameters:   camelCase (?pageSize=20, ?sortBy=createdAt)
Response fields:    camelCase (createdAt, matchId, severityTier)
Enum values:        snake_case ("match_live", "tier_1", "available")
```

### P05 — Pagination Standard

All list endpoints support cursor-based pagination for realtime data and offset-based for analytics:

**Operational lists (incidents, resources):** Cursor-based pagination

```
?cursor={encodedCursor}&limit=25
```

Returns: `{ data: [...], pagination: { nextCursor, hasMore, total } }`

**Analytics lists (reports, audit logs):** Offset-based pagination

```
?page=1&limit=50
```

Returns: `{ data: [...], pagination: { page, limit, total, totalPages } }`

**Why cursor-based for operational data:** Match-day incident lists change frequently. Offset-based pagination would skip or duplicate records when new items are inserted between page fetches.

### P06 — Filtering and Sorting

Standard query parameters for all list endpoints:

```
?status=active,monitoring       — Multi-value filter (comma-separated)
?severityTier=1,2               — Numeric filter
?zone=Zone+A                    — String filter (URL-encoded)
?from=2026-07-12T20:00:00Z     — Date range start (ISO 8601)
?to=2026-07-12T22:00:00Z       — Date range end
?sortBy=createdAt               — Field to sort by
?sortOrder=desc                 — Sort direction (asc/desc, default: desc for timestamps)
?search=medical                 — Full-text search within the endpoint's scope
```

### P07 — Idempotency Keys

POST endpoints that create resources accept an optional `Idempotency-Key` header:

```
Idempotency-Key: {uuidv4}
```

If a request with the same key was processed within 24 hours, the original response is returned without re-executing the operation. This is critical for incident creation during connectivity issues.

### P08 — Response Envelope

All responses use a consistent envelope structure. See Section 4 for the complete specification.

### P09 — HTTP Status Code Semantics

| Code | Meaning in ArenaMind AI Context                       |
| ---- | ----------------------------------------------------- |
| 200  | Successful GET, PATCH, DELETE (with body)             |
| 201  | Successful POST (resource created)                    |
| 204  | Successful DELETE (no body returned)                  |
| 304  | Not Modified (conditional GET with ETag)              |
| 400  | Validation failure or bad request                     |
| 401  | Missing or invalid authentication                     |
| 403  | Authenticated but lacks permission                    |
| 404  | Resource not found (or soft-deleted and inaccessible) |
| 409  | Conflict (concurrent modification, duplicate)         |
| 422  | Business rule violation (invalid state transition)    |
| 429  | Rate limit exceeded                                   |
| 500  | Unexpected server error                               |
| 503  | Service temporarily unavailable (AI, DB)              |

### P10 — Null vs Omission

**Rule:** Optional fields that are not set are returned as `null` in response bodies, never omitted. This prevents client code from crashing on missing keys.

```json
// ✅ Correct
{ "resolvedAt": null, "resolvedBy": null, "resolutionNotes": null }

// ❌ Wrong
{ }  // Optional fields omitted
```

### P11 — Consistent Error Response

All errors return an `error` object in the response envelope. Never return plain strings or HTML for errors. See Section 5.

### P12 — CORS Configuration

```typescript
// next.config.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || 'https://arenamind.ai',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID, Idempotency-Key',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours preflight cache
};
```

### P13 — AI Response Streaming

AI endpoints that generate long-form content (operational summary, executive summary, shift handover) support **Server-Sent Events (SSE)** for streaming responses.

```
Accept: text/event-stream  →  Streaming response
Accept: application/json   →  Buffered response (waits for full generation)
```

### P14 — Soft Deletes and Visibility

Resources with `deletedAt` set are invisible to standard API calls. The GET /incidents endpoint automatically filters `WHERE deleted_at IS NULL`. Admin endpoints (with the `?includeDeleted=true` parameter) can return soft-deleted records.

### P15 — Nested vs Flat Resources

**Rule:** Nest resources that only make sense in the context of a parent:

```
/matches/:matchId/incidents    ✅ Incidents are match-scoped
/matches/:matchId/crowd        ✅ Crowd data is match-scoped
/ai/recommendations/:id        ✅ AI recommendations exist at the API level (not nested)
```

**Rule:** Do not nest more than 2 levels deep:

```
/matches/:matchId/incidents/:id/actions    ✅ 2 levels deep
/matches/:matchId/incidents/:id/actions/:actionId/attachments  ❌ Too deep
```

### P16 — Caching with ETags

Read endpoints for semi-static data (stadiums, zones, incident types) support conditional requests:

```
First request:     GET /stadiums/1        → 200 + ETag: "abc123"
Subsequent:        GET /stadiums/1 + If-None-Match: "abc123" → 304 Not Modified
```

### P17 — Content Negotiation

All JSON request bodies must include `Content-Type: application/json`. File uploads use `multipart/form-data`.

### P18 — Developer Experience

Every endpoint produces predictable responses. The response shape never changes based on the query — the structure is always the same, only the data differs.

---

## 3. API Architecture

### 3.1 Request Processing Pipeline

```mermaid
sequenceDiagram
    participant Client as Browser/Mobile
    participant Middleware as Next.js Middleware
    participant Handler as Route Handler
    participant Validator as Zod Validator
    participant DB as Supabase/Postgres
    participant AI as Gemini API

    Client->>Middleware: HTTP Request + Bearer JWT
    Middleware->>Middleware: Verify JWT signature
    Middleware->>Middleware: Extract user_id, stadium_id, role
    Middleware->>Middleware: Check rate limit (rate_limits table)
    Middleware->>Middleware: Inject X-Request-ID (Correlation ID)
    Middleware-->>Client: 401 (if JWT invalid)
    Middleware-->>Client: 429 (if rate limited)
    Middleware->>Handler: Forward request + auth context

    Handler->>Validator: Validate path params, query, body
    Validator-->>Handler: 400 (if validation fails)
    Validator->>Handler: Validated & typed request

    Handler->>DB: Query via Supabase SDK (RLS applied)
    DB-->>Handler: Result (RLS blocks cross-stadium data)

    alt AI Feature Requested
        Handler->>AI: Gemini API call (server-side only)
        AI-->>Handler: Structured response
        Handler->>DB: INSERT ai_recommendations + ai_call_logs
    end

    Handler->>Handler: Format response envelope
    Handler-->>Client: HTTP Response + X-Request-ID
```

### 3.2 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthAPI as /api/v1/auth/login
    participant Supabase as Supabase Auth

    Client->>AuthAPI: POST {email, password}
    AuthAPI->>Supabase: supabase.auth.signInWithPassword()
    Supabase-->>AuthAPI: {session: {access_token, refresh_token, expires_in}}
    AuthAPI->>AuthAPI: Verify user exists in public.users
    AuthAPI-->>Client: 200 {accessToken, refreshToken, expiresIn, user}

    Note over Client: Store tokens securely (httpOnly cookie preferred)

    Client->>Client: On subsequent requests: Authorization: Bearer {accessToken}
    Client->>Middleware: Request + Bearer token
    Middleware->>Middleware: jwt.verify() — Supabase public key
    Middleware->>Middleware: Extract sub (user_id), role from custom claims
```

### 3.3 AI Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant AIHandler as /api/v1/ai/*
    participant RateLimit as Rate Limiter
    participant ContextBuilder as Context Builder
    participant Gemini as Gemini 2.0 Flash
    participant ZodValidator as Zod Schema Validator
    participant DB as Supabase DB

    Client->>AIHandler: POST {matchId, feature params}
    AIHandler->>RateLimit: Check AI rate limit (10/min/stadium)
    RateLimit-->>AIHandler: 429 (if exceeded)
    AIHandler->>ContextBuilder: Build operational context
    ContextBuilder->>DB: 6 parallel queries (incidents, crowd, resources, weather, phase, accessibility)
    DB-->>ContextBuilder: Operational state snapshot
    ContextBuilder-->>AIHandler: Context assembled
    AIHandler->>Gemini: POST with system prompt + user context (service-side)
    Gemini-->>AIHandler: Structured JSON response (streaming or buffered)
    AIHandler->>ZodValidator: Validate Gemini output schema
    ZodValidator-->>AIHandler: 500 (if schema invalid — hallucination detected)
    AIHandler->>DB: INSERT ai_recommendations + ai_call_logs (service role)
    AIHandler-->>Client: 200 {recommendation, confidence, reasoning}
```

### 3.4 Middleware Architecture

```typescript
// middleware.ts — Applied to all /api/v1/* routes

export async function middleware(request: NextRequest) {
  // 1. Skip public endpoints
  const isPublic = PUBLIC_PATHS.includes(request.nextUrl.pathname);

  // 2. Extract and verify JWT
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const { user, error } = await verifyJWT(token);
  if (!isPublic && error) return unauthorizedResponse(error);

  // 3. Inject request ID
  const requestId = request.headers.get('X-Request-ID') || crypto.randomUUID();

  // 4. Rate limiting
  const limited = await checkRateLimit(user?.id, request.nextUrl.pathname);
  if (limited) return rateLimitResponse(limited);

  // 5. Forward augmented headers
  const headers = new Headers(request.headers);
  headers.set('X-User-ID', user?.id ?? '');
  headers.set('X-Stadium-ID', user?.stadiumId ?? '');
  headers.set('X-User-Role', user?.role ?? '');
  headers.set('X-Request-ID', requestId);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set('X-Request-ID', requestId);
  return response;
}
```

---

## 4. Standard Response Format

### 4.1 Success Response Envelope

```typescript
type SuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    timestamp: string; // ISO 8601 UTC
    requestId: string; // X-Request-ID correlation
    version: string; // "1.0.0"
  };
};
```

**Example:**

```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "Fan collapsed in Zone C",
    "severityTier": 1,
    "status": "active",
    "createdAt": "2026-07-12T20:14:32Z"
  },
  "meta": {
    "timestamp": "2026-07-12T20:14:32.841Z",
    "requestId": "req_01HABCD1234EFGH",
    "version": "1.0.0"
  }
}
```

### 4.2 Paginated Response Envelope

```typescript
type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    // Cursor-based (operational lists)
    nextCursor?: string | null;
    hasMore: boolean;
    total?: number; // Approximate — only returned if ?includeTotal=true

    // Offset-based (analytics/admin)
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  meta: ResponseMeta;
};
```

**Example (cursor-based):**

```json
{
  "success": true,
  "data": [
    { "id": "...", "title": "Fan collapsed", "severityTier": 1, "status": "active" },
    { "id": "...", "title": "Gate congestion", "severityTier": 3, "status": "open" }
  ],
  "pagination": {
    "nextCursor": "eyJjcmVhdGVkQXQiOiIyMDI2LTA3LTEyVDIwOjE0OjMyWiJ9",
    "hasMore": true,
    "total": 47
  },
  "meta": { "timestamp": "...", "requestId": "...", "version": "1.0.0" }
}
```

### 4.3 Error Response Envelope

```typescript
type ErrorResponse = {
  success: false;
  error: {
    code: string; // Machine-readable error code (e.g., "INCIDENT_NOT_FOUND")
    message: string; // Human-readable error message
    details?: string; // Additional context (safe to display)
    fieldErrors?: {
      // Per-field validation errors
      field: string;
      message: string;
    }[];
    retryAfter?: number; // Seconds (only for 429 responses)
  };
  meta: ResponseMeta;
};
```

**Example (validation error):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body validation failed",
    "fieldErrors": [
      { "field": "title", "message": "Title is required" },
      { "field": "severityTier", "message": "Must be one of: 1, 2, 3, 4" }
    ]
  },
  "meta": { "timestamp": "...", "requestId": "...", "version": "1.0.0" }
}
```

**Example (rate limit):**

```json
{
  "success": false,
  "error": {
    "code": "AI_RATE_LIMITED",
    "message": "AI request limit exceeded for this stadium",
    "details": "Maximum 10 AI requests per minute per stadium",
    "retryAfter": 47
  },
  "meta": { "timestamp": "...", "requestId": "...", "version": "1.0.0" }
}
```

### 4.4 Streaming Response (SSE)

For AI endpoints with `Accept: text/event-stream`:

```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
X-Request-ID: req_01HABCD1234EFGH

event: start
data: {"recommendationId":"uuid","feature":"operational_summary","timestamp":"2026-07-12T20:14:32Z"}

event: chunk
data: {"text":"Zone C has reached 91% capacity. Based on current ingress rates..."}

event: chunk
data: {"text":" I recommend deploying additional stewards to Gate 3 immediately."}

event: complete
data: {"recommendationId":"uuid","confidence":0.87,"tokensUsed":1247,"latencyMs":2341}

event: end
data: {}
```

---

## 5. Error Catalog

### 5.1 4xx Client Errors

| HTTP | Code                        | Description                                              | Recovery                                           |
| ---- | --------------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| 400  | `VALIDATION_ERROR`          | Request body or query params failed validation           | Check `fieldErrors` array for specific fields      |
| 400  | `INVALID_UUID`              | Path parameter is not a valid UUID v4                    | Use a valid UUID format                            |
| 400  | `INVALID_DATE_RANGE`        | `from` date is after `to` date, or range exceeds 30 days | Correct the date range                             |
| 400  | `MISSING_REQUIRED_FIELD`    | A required field is absent from the request body         | Include all required fields                        |
| 400  | `INVALID_ENUM_VALUE`        | A field contains a value not in the allowed set          | Use one of the documented enum values              |
| 400  | `FILE_TOO_LARGE`            | Uploaded file exceeds size limit                         | Compress or resize the file                        |
| 400  | `UNSUPPORTED_MIME_TYPE`     | File type not allowed for this endpoint                  | Use an allowed file type                           |
| 401  | `UNAUTHORIZED`              | No Authorization header provided                         | Include `Authorization: Bearer {token}`            |
| 401  | `TOKEN_EXPIRED`             | JWT has passed its expiry time                           | Use refresh token to get a new access token        |
| 401  | `TOKEN_INVALID`             | JWT signature verification failed                        | Re-authenticate to get a valid token               |
| 401  | `TOKEN_REVOKED`             | JWT session has been explicitly revoked                  | Re-authenticate                                    |
| 403  | `FORBIDDEN`                 | User lacks permission for this operation                 | Check role permissions; contact admin              |
| 403  | `CROSS_STADIUM_ACCESS`      | Attempting to access another stadium's data              | Only access resources for your assigned stadium    |
| 403  | `INSUFFICIENT_ROLE`         | Operation requires a higher role level                   | Contact Operations Manager for access              |
| 403  | `IMMUTABLE_RECORD`          | Attempting to modify an immutable record                 | Audit logs and closed incidents cannot be modified |
| 403  | `PHASE_ALREADY_SET`         | Attempting to set match to its current phase             | Phase is already in the requested state            |
| 404  | `NOT_FOUND`                 | Generic resource not found                               | Verify the resource ID and try again               |
| 404  | `MATCH_NOT_FOUND`           | Match with given ID does not exist                       | Verify matchId and stadium assignment              |
| 404  | `INCIDENT_NOT_FOUND`        | Incident does not exist or is deleted                    | Verify incidentId                                  |
| 404  | `RESOURCE_NOT_FOUND`        | Resource does not exist or is deleted                    | Verify resourceId                                  |
| 404  | `RECOMMENDATION_NOT_FOUND`  | AI recommendation does not exist                         | Verify recommendationId                            |
| 409  | `CONFLICT`                  | Generic conflict (duplicate key, version mismatch)       | Re-fetch the resource and retry                    |
| 409  | `PHASE_TRANSITION_CONFLICT` | Concurrent phase change detected                         | Re-fetch match and retry                           |
| 409  | `OPTIMISTIC_LOCK_CONFLICT`  | Resource was modified by another user                    | Re-fetch and re-apply changes                      |
| 409  | `DUPLICATE_IDEMPOTENCY_KEY` | Idempotency key already processed                        | Use a new key or retrieve the original response    |
| 422  | `UNPROCESSABLE`             | Business rule prevents this operation                    | See `details` for the specific business rule       |
| 422  | `INCIDENT_ALREADY_CLOSED`   | Cannot modify a closed incident                          | Incident must be reopened first                    |
| 422  | `INVALID_PHASE_TRANSITION`  | Target phase is not reachable from current phase         | Check valid phase transitions                      |
| 422  | `RESOURCE_ALREADY_ASSIGNED` | Resource is currently assigned to another incident       | Release from current incident first                |
| 422  | `AI_RECOMMENDATION_EXPIRED` | Recommendation has passed its 15-minute validity window  | Request a new recommendation                       |
| 422  | `AI_DECISION_ALREADY_MADE`  | Cannot change accept/dismiss decision                    | Decision is final once made                        |
| 429  | `RATE_LIMITED`              | General rate limit exceeded                              | Wait and retry after `retryAfter` seconds          |
| 429  | `AI_RATE_LIMITED`           | AI-specific rate limit exceeded (10/min/stadium)         | Wait and retry after `retryAfter` seconds          |

### 5.2 5xx Server Errors

| HTTP | Code                        | Description                                 | Recovery                                    |
| ---- | --------------------------- | ------------------------------------------- | ------------------------------------------- |
| 500  | `INTERNAL_ERROR`            | Unexpected server error                     | Report with `requestId`; retry after delay  |
| 500  | `DATABASE_ERROR`            | Database query failed                       | Report with `requestId`; retry              |
| 500  | `AI_SERVICE_ERROR`          | Gemini API call failed                      | Operational data unaffected; retry AI call  |
| 500  | `AI_OUTPUT_INVALID`         | AI response failed schema validation        | AI output was malformed; retry              |
| 500  | `AI_HALLUCINATION_DETECTED` | AI output flagged as potentially inaccurate | Retry; if persistent, report with requestId |
| 503  | `SERVICE_UNAVAILABLE`       | Service is temporarily unavailable          | Retry after 30 seconds                      |
| 503  | `AI_UNAVAILABLE`            | Gemini API is unavailable                   | All non-AI features remain operational      |
| 503  | `DATABASE_UNAVAILABLE`      | Database connection pool exhausted          | Retry after 10 seconds                      |

---

## 6. Authentication

### 6.1 JWT Structure

Supabase issues JWTs with the following claims:

```json
{
  "sub": "3fa85f64-5717-4562-b3fc-2c963f66afa6", // User ID (maps to users.id)
  "email": "het@arenamind.ai", // From auth.users
  "role": "authenticated", // Supabase role
  "aud": "authenticated",
  "iss": "https://project.supabase.co/auth/v1",
  "exp": 1752432672, // 1 hour default
  "iat": 1752429072,
  "app_metadata": {
    "stadium_id": "uuid", // Custom claim (set on user creation)
    "user_role": "operations_manager" // Custom claim (set on user creation)
  }
}
```

**Custom claims** (`stadium_id`, `user_role`) are set via a Supabase Auth Hook (PostgreSQL function) when a user's `users` record is created. These claims are embedded in the JWT and trusted by middleware without a database lookup on every request.

### 6.2 Token Storage Recommendations

```
Server-side rendering (Next.js default): httpOnly cookie
Recommendation: Use Supabase Auth SSR package (@supabase/ssr)
  - Access token: httpOnly cookie (CSRF protected by SameSite=Lax)
  - Refresh token: httpOnly cookie (httpOnly + Secure)
  - NEVER store in localStorage (XSS vulnerability)
```

### 6.3 Authentication Header Format

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6.4 Service-to-Service Authentication

Internal API calls from Next.js Route Handlers to Supabase use the **Service Role Key**:

```typescript
// Server-side Supabase client (bypasses RLS)
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-only env var
);

// Usage: AI inserts, system operations, cron job triggers
```

---

## 7. Authorization — RBAC Matrix

### 7.1 Role Definitions

| Role                   | Code                 | Description                                                         |
| ---------------------- | -------------------- | ------------------------------------------------------------------- |
| **Operations Manager** | `operations_manager` | Full access; phase changes; AI features; reports                    |
| **Deputy Manager**     | `deputy_manager`     | Operational access; AI features; cannot change phase                |
| **Coordinator**        | `coordinator`        | Create/update incidents and resources; no AI generation; no reports |
| **Read Only**          | `read_only`          | Read all operational data; no write operations                      |
| **Service Role**       | `service_role`       | Internal server-side; bypasses RLS; AI inserts, crowd data          |

### 7.2 Endpoint Authorization Matrix

| Endpoint                       | OM  | DM  | Coord | RO  | Service |
| ------------------------------ | --- | --- | ----- | --- | ------- |
| **Authentication**             |     |     |       |     |         |
| POST /auth/login               | ✅  | ✅  | ✅    | ✅  | —       |
| POST /auth/logout              | ✅  | ✅  | ✅    | ✅  | —       |
| **Matches**                    |     |     |       |     |         |
| GET /matches                   | ✅  | ✅  | ✅    | ✅  | ✅      |
| PATCH /matches/:id/phase       | ✅  | ❌  | ❌    | ❌  | ❌      |
| **Incidents**                  |     |     |       |     |         |
| GET /incidents (all)           | ✅  | ✅  | ✅    | ✅  | ✅      |
| POST /incidents                | ✅  | ✅  | ✅    | ❌  | ✅      |
| PATCH /incidents/:id           | ✅  | ✅  | ✅    | ❌  | ❌      |
| DELETE /incidents/:id          | ✅  | ✅  | ❌    | ❌  | ❌      |
| **Resources**                  |     |     |       |     |         |
| GET /resources                 | ✅  | ✅  | ✅    | ✅  | ✅      |
| POST /resources                | ✅  | ✅  | ✅    | ❌  | ✅      |
| PATCH /resources/:id           | ✅  | ✅  | ✅    | ❌  | ❌      |
| POST /resources/:id/assign     | ✅  | ✅  | ✅    | ❌  | ❌      |
| **Crowd Data**                 |     |     |       |     |         |
| GET /crowd/current             | ✅  | ✅  | ✅    | ✅  | ✅      |
| POST /crowd/data               | ❌  | ❌  | ❌    | ❌  | ✅      |
| **AI Features**                |     |     |       |     |         |
| POST /ai/operational-summary   | ✅  | ✅  | ❌    | ❌  | ✅      |
| POST /ai/incident-classify     | ✅  | ✅  | ❌    | ❌  | ✅      |
| POST /ai/incident-recommend    | ✅  | ✅  | ❌    | ❌  | ✅      |
| POST /ai/crowd-recommendations | ✅  | ✅  | ❌    | ❌  | ✅      |
| POST /ai/executive-summary     | ✅  | ❌  | ❌    | ❌  | ✅      |
| PATCH /ai/recommendations/:id  | ✅  | ✅  | ❌    | ❌  | ❌      |
| **Reports**                    |     |     |       |     |         |
| GET /reports                   | ✅  | ✅  | ✅    | ✅  | ✅      |
| POST /reports/generate         | ✅  | ✅  | ❌    | ❌  | ✅      |
| POST /reports/:id/export       | ✅  | ✅  | ❌    | ❌  | ✅      |
| **Admin**                      |     |     |       |     |         |
| GET /admin/audit-logs          | ✅  | ❌  | ❌    | ❌  | ✅      |
| GET /admin/ai-metrics          | ✅  | ❌  | ❌    | ❌  | ✅      |
| PATCH /admin/users/:id         | ✅  | ❌  | ❌    | ❌  | ✅      |
| **Settings**                   |     |     |       |     |         |
| GET /settings                  | ✅  | ✅  | ✅    | ✅  | ✅      |
| PATCH /settings/:key           | ✅  | ❌  | ❌    | ❌  | ✅      |
| **System Health**              |     |     |       |     |         |
| GET /health                    | ✅  | ✅  | ✅    | ✅  | ✅      |

---

## 8. Rate Limiting

### 8.1 Rate Limit Tiers

| Tier                  | Applies To                 | Limit   | Window    | Scope       |
| --------------------- | -------------------------- | ------- | --------- | ----------- |
| **Unauthenticated**   | `/health`, `/auth/login`   | 20 req  | 1 minute  | Per IP      |
| **Authenticated**     | All standard endpoints     | 200 req | 1 minute  | Per user    |
| **AI Operations**     | All `/ai/*` POST endpoints | 10 req  | 1 minute  | Per stadium |
| **File Upload**       | `POST /files/upload`       | 5 req   | 1 minute  | Per user    |
| **Report Generation** | `POST /reports/generate`   | 3 req   | 5 minutes | Per match   |
| **Admin**             | All `/admin/*` endpoints   | 60 req  | 1 minute  | Per user    |
| **Service Role**      | All endpoints              | Exempt  | —         | —           |

### 8.2 Implementation

```typescript
// Rate limiting using sliding window in rate_limits table
async function checkRateLimit(
  userId: string,
  pathname: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const tier = getRateLimitTier(pathname);
  const key = `${userId}:${tier.name}:${getWindowKey(tier.windowMs)}`;

  const result = await supabase.rpc('check_and_increment_rate_limit', {
    p_key: key,
    p_limit: tier.limit,
    p_window_ms: tier.windowMs,
  });

  return result.data;
}
```

### 8.3 Rate Limit Response Headers

All responses include rate limit headers:

```http
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 147
X-RateLimit-Reset: 1752429132
X-RateLimit-Policy: "200;w=60"
```

429 responses additionally include:

```http
Retry-After: 23
```

### 8.4 AI Rate Limit Rationale

The 10/minute/stadium AI limit is derived from:

- Gemini 2.0 Flash: 1,000 requests/minute (project quota)
- 16 simultaneous stadiums × 10 = 160 requests/minute peak
- Buffer: 840 requests/minute headroom for burst capacity

---

## 9. Request Validation

### 9.1 Validation Architecture

All endpoint request bodies are validated using **Zod schemas** at the Route Handler level, before any business logic executes.

```typescript
// Example: Incident creation validation
const createIncidentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description required').max(2000),
  zoneId: z.string().uuid('zoneId must be a valid UUID').nullable().optional(),
  incidentTypeId: z.string().uuid().nullable().optional(),
  severityTier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  locationDetail: z.string().max(300).nullable().optional(),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
});

// In route handler:
const body = await request.json();
const parsed = createIncidentSchema.safeParse(body);
if (!parsed.success) {
  return validationErrorResponse(parsed.error.flatten());
}
```

### 9.2 Path Parameter Validation

All UUID path parameters are validated before DB queries:

```typescript
const uuidSchema = z.string().uuid('Must be a valid UUID v4');

// Validation helper:
function validateUUID(value: string, name: string) {
  const result = uuidSchema.safeParse(value);
  if (!result.success) {
    throw new APIError('INVALID_UUID', `${name} must be a valid UUID v4`, 400);
  }
  return value;
}
```

### 9.3 Query Parameter Validation

```typescript
const listIncidentsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  status: z
    .string()
    .optional()
    .transform((val) => val?.split(',')), // "active,open" → ["active","open"]
  severityTier: z
    .string()
    .optional()
    .transform((val) =>
      val
        ?.split(',')
        .map(Number)
        .filter((n) => [1, 2, 3, 4].includes(n))
    ),
  zoneId: z.string().uuid().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'severityTier']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().max(100).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
```

---

## 10. API Module: Authentication

### POST `/api/v1/auth/login`

**Purpose:** Authenticate a user with email and password. Returns JWT access token and refresh token.

```
Method:   POST
Auth:     None required
Rate:     20/minute/IP (unauthenticated tier)
```

**Request Body:**

```json
{
  "email": "het@arenamind.ai",
  "password": "SecureP@ssw0rd!"
}
```

**Validation:**

- `email`: required, valid email format
- `password`: required, 8-128 characters

**Response 200:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "v1.MRjGEjBSrh4Pz...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "fullName": "Het Patel",
      "role": "operations_manager",
      "stadiumId": "uuid-stadium-001",
      "stadiumName": "Al Bayt Stadium",
      "email": "het@arenamind.ai"
    }
  }
}
```

**Error Responses:**

- `401 UNAUTHORIZED`: Invalid email or password
- `403 FORBIDDEN`: Account is disabled (`is_active = false`)
- `429 RATE_LIMITED`: Too many login attempts

---

### POST `/api/v1/auth/logout`

**Purpose:** Invalidate the current session.

```
Method:   POST
Auth:     Bearer token required
```

**Response 200:**

```json
{ "success": true, "data": { "message": "Logged out successfully" } }
```

---

### POST `/api/v1/auth/refresh`

**Purpose:** Exchange a refresh token for a new access token without re-authenticating.

```
Method:   POST
Auth:     None (refresh token is the credential)
Rate:     20/minute/IP
```

**Request Body:**

```json
{ "refreshToken": "v1.MRjGEjBSrh4Pz..." }
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "v1.NewRefreshToken...",
    "expiresIn": 3600
  }
}
```

---

### POST `/api/v1/auth/forgot-password`

**Purpose:** Trigger a password reset email via Supabase Auth.

**Request Body:** `{ "email": "het@arenamind.ai" }`

**Response 200:** Always returns 200 (security: doesn't reveal if email exists)

---

### POST `/api/v1/auth/reset-password`

**Purpose:** Set a new password using the reset token from the email link.

**Request Body:**

```json
{ "accessToken": "reset_token_from_email", "newPassword": "NewSecureP@ss!" }
```

**Validation:** `newPassword` min 8 chars, must contain uppercase, lowercase, number.

---

## 11. API Module: Users

### GET `/api/v1/users/me`

**Purpose:** Get the authenticated user's profile and preferences.

```
Method:   GET
Auth:     Required (all roles)
Cache:    private, max-age=60
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Het Patel",
    "role": "operations_manager",
    "department": "Operations",
    "phoneNumber": "+1-555-0101",
    "employeeId": "FIFA-2026-OP-001",
    "stadiumId": "uuid-stadium",
    "stadiumName": "Al Bayt Stadium",
    "isActive": true,
    "lastSeenAt": "2026-07-12T20:00:00Z",
    "preferences": {
      "densityMode": "comfortable",
      "theme": "dark",
      "notifications": { "tier1": true, "crowdAlerts": true }
    },
    "createdAt": "2026-01-15T09:00:00Z"
  }
}
```

---

### PATCH `/api/v1/users/me`

**Purpose:** Update own profile preferences and operational contact info.

**Allowed fields (user can update own):** `fullName`, `phoneNumber`, `preferences`

**Request Body:**

```json
{
  "phoneNumber": "+1-555-0102",
  "preferences": { "densityMode": "compact", "theme": "dark" }
}
```

---

### GET `/api/v1/users`

**Purpose:** List all users in the authenticated user's stadium.

```
Method:   GET
Auth:     Required (OM, DM)
Query:    ?role=coordinator&isActive=true
```

**Response 200:** Paginated list of user objects.

---

### GET `/api/v1/users/:userId`

**Purpose:** Get a specific user's profile.

```
Auth:     Required (OM — any user; all roles — own profile only)
```

---

### PATCH `/api/v1/users/:userId`

**Purpose:** Update a user's role or active status. OM only.

**Allowed fields:** `role`, `isActive`, `department`, `fullName`

**Business rules:**

- Cannot demote yourself (prevents lockout)
- Cannot assign a user to a different stadium
- Role changes trigger re-issuance of custom JWT claims on next login

---

## 12. API Module: Stadiums

### GET `/api/v1/stadiums`

**Purpose:** List all stadiums accessible to the authenticated user (typically only their assigned stadium).

```
Method:   GET
Auth:     Required (all roles)
Cache:    private, max-age=3600 (stadiums are effectively static)
```

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-stadium-001",
      "name": "Al Bayt Stadium",
      "shortName": "Al Bayt",
      "city": "Al Khor",
      "country": "Qatar",
      "capacity": 60000,
      "timezone": "Asia/Qatar",
      "zoneCount": 24,
      "isActive": true
    }
  ]
}
```

---

### GET `/api/v1/stadiums/:stadiumId`

**Purpose:** Get full stadium details including configuration.

**Path params:** `stadiumId` — UUID

**Response:** Stadium object with zone summary, active match reference.

---

### GET `/api/v1/stadiums/:stadiumId/zones`

**Purpose:** Get all zones for a stadium.

**Response:** Array of zone objects with capacity, thresholds, SVG path IDs.

---

## 13. API Module: Matches

### GET `/api/v1/matches`

**Purpose:** List matches for the authenticated user's stadium.

```
Query: ?status=active,scheduled&from=2026-07-01&to=2026-07-31
```

**Response:** Paginated list with `id`, `homeTeam`, `awayTeam`, `scheduledAt`, `currentPhase`, `matchStatus`.

---

### GET `/api/v1/matches/active`

**Purpose:** Get the currently active match for this stadium. Returns null if no match is active.

**Performance:** This is called on every app load. Cached for 30 seconds.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid-match-032",
    "homeTeam": "Brazil",
    "awayTeam": "Argentina",
    "scheduledAt": "2026-07-12T20:00:00Z",
    "kickoffAt": "2026-07-12T20:02:00Z",
    "currentPhase": "match_live",
    "matchStatus": "active",
    "stadium": { "id": "uuid", "name": "Al Bayt Stadium" }
  }
}
```

---

### GET `/api/v1/matches/:matchId`

**Purpose:** Get full match details including current health score and phase history.

**Response:** Match object with embedded `healthScore`, `currentPhase`, `phaseHistory` (last 5 transitions).

---

### PATCH `/api/v1/matches/:matchId/phase`

**Purpose:** Transition the match to a new operational phase.

```
Method:   PATCH
Auth:     Required (operations_manager only)
Idempotent: YES (same phase transition from same phase produces same result)
```

**Request Body:**

```json
{
  "toPhase": "halftime",
  "notes": "Whistle blown at minute 45+2"
}
```

**Validation:**

- `toPhase` must be a valid phase enum value
- Cannot transition to the current phase (422 PHASE_ALREADY_SET)
- Valid transitions enforced server-side:

```
pre_event → gate_opening → fan_arrival → pre_kickoff → match_live
match_live → halftime → second_half → full_time → crowd_exit → post_event
```

**Business Logic:**

1. Validate phase transition is legal
2. UPDATE matches.current_phase (SERIALIZABLE transaction)
3. INSERT phase_transitions record
4. Trigger AI summary regeneration (async job)
5. Broadcast Realtime event to `phase-{matchId}` channel

**Response 200:** Updated match object

**Errors:**

- `403 INSUFFICIENT_ROLE`: Only OM can change phases
- `409 PHASE_TRANSITION_CONFLICT`: Concurrent modification detected
- `422 INVALID_PHASE_TRANSITION`: Target phase not reachable from current

---

### GET `/api/v1/matches/:matchId/summary`

**Purpose:** Get a complete operational summary for a match (used for reports).

**Response:** Match with embedded aggregate statistics (incident counts, crowd peaks, resource utilization, AI metrics).

---

## 14. API Module: Zones

### GET `/api/v1/stadiums/:stadiumId/zones`

Already documented in Section 12.

### GET `/api/v1/zones/:zoneId`

**Purpose:** Get a single zone with its current crowd density, assigned resources, and alert threshold configuration.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid-zone-c",
    "name": "Zone C — North Stand",
    "shortCode": "ZC-N",
    "zoneType": "seating",
    "safeCapacity": 5000,
    "alertThresholdPct": 85,
    "criticalThresholdPct": 95,
    "positionX": 45.2,
    "positionY": 22.8,
    "svgPathId": "zone-c-north",
    "isActive": true,
    "currentDensity": {
      "fanCount": 4550,
      "densityPct": 91.0,
      "level": "critical",
      "recordedAt": "2026-07-12T20:14:00Z"
    },
    "assignedResources": 3
  }
}
```

---

### PATCH `/api/v1/zones/:zoneId`

**Purpose:** Update zone alert thresholds. OM only.

**Allowed fields:** `alertThresholdPct`, `criticalThresholdPct`, `isActive`

---

## 15. API Module: Crowd Intelligence

### GET `/api/v1/matches/:matchId/crowd/current`

**Purpose:** Get the latest crowd density reading for every zone in the match stadium. The primary data source for the heatmap.

```
Method:   GET
Auth:     Required (all roles)
Cache:    Cache-Control: no-cache (real-time data)
Performance target: P99 < 50ms
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "matchId": "uuid-match-032",
    "stadiumId": "uuid-stadium-001",
    "recordedAt": "2026-07-12T20:14:30Z",
    "zones": [
      {
        "zoneId": "uuid-zone-a",
        "zoneName": "Zone A — South Stand",
        "zoneCode": "ZA-S",
        "fanCount": 2100,
        "safeCapacity": 5000,
        "densityPct": 42.0,
        "densityLevel": "normal",
        "ingressRate": 15,
        "egressRate": 3,
        "recordedAt": "2026-07-12T20:14:30Z"
      },
      {
        "zoneId": "uuid-zone-c",
        "zoneName": "Zone C — North Stand",
        "zoneCode": "ZC-N",
        "fanCount": 4550,
        "safeCapacity": 5000,
        "densityPct": 91.0,
        "densityLevel": "critical",
        "ingressRate": 45,
        "egressRate": 2,
        "recordedAt": "2026-07-12T20:14:30Z"
      }
    ],
    "summary": {
      "totalFans": 42150,
      "stadiumCapacity": 60000,
      "overallDensityPct": 70.25,
      "zonesAtAlert": 2,
      "zonesAtCritical": 1,
      "peakZoneId": "uuid-zone-c",
      "peakDensityPct": 91.0
    }
  }
}
```

---

### GET `/api/v1/matches/:matchId/crowd/trends`

**Purpose:** Get crowd density trend data for the last N minutes, for chart rendering.

```
Query:  ?windowMinutes=60&zoneId={uuid}&interval=5
        windowMinutes: 15, 30, 60, 120, 180 (default: 60)
        zoneId: filter to specific zone (optional — all zones if omitted)
        interval: data point interval in minutes (1, 5, 15, default: 5)
Cache:  max-age=60
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "matchId": "uuid",
    "windowMinutes": 60,
    "interval": 5,
    "dataPoints": [
      {
        "timestamp": "2026-07-12T19:30:00Z",
        "overallDensityPct": 32.5,
        "peakZoneDensityPct": 58.2,
        "totalFans": 19500
      },
      {
        "timestamp": "2026-07-12T19:35:00Z",
        "overallDensityPct": 48.1,
        "peakZoneDensityPct": 72.1,
        "totalFans": 28860
      }
    ],
    "zones": [
      {
        "zoneId": "uuid-zone-c",
        "zoneName": "Zone C",
        "dataPoints": [
          { "timestamp": "2026-07-12T19:30:00Z", "densityPct": 58.2 },
          { "timestamp": "2026-07-12T19:35:00Z", "densityPct": 72.1 }
        ]
      }
    ]
  }
}
```

---

### GET `/api/v1/matches/:matchId/crowd/zones/:zoneId`

**Purpose:** Get detailed crowd data for a single zone, including recent history and predictions.

**Response:** Zone detail with 30-point history array + prediction for next 15 minutes.

---

### GET `/api/v1/matches/:matchId/crowd/predictions`

**Purpose:** Get AI-generated crowd density predictions per zone for the next 15-60 minutes.

```
Query: ?horizonMinutes=30
```

**Response:** Array of zone prediction objects with `predictedDensityPct`, `confidence`, `riskLevel`.

---

### POST `/api/v1/matches/:matchId/crowd/data`

**Purpose:** Insert crowd density measurements. Called by the simulation service or future hardware sensor adapter.

```
Method:   POST
Auth:     Service role only (403 for all user roles)
Rate:     Exempt (service role)
```

**Request Body:**

```json
{
  "measurements": [
    {
      "zoneId": "uuid-zone-a",
      "fanCount": 2150,
      "safeCapacity": 5000,
      "ingressRate": 18,
      "egressRate": 4,
      "source": "simulation",
      "recordedAt": "2026-07-12T20:14:30Z"
    }
  ]
}
```

**Business Logic:**

1. Validate each measurement (zoneId, positive fanCount)
2. Bulk INSERT into crowd_data
3. Check alert thresholds — if any zone crosses threshold, INSERT alert + notifications

**Response 201:** `{ "inserted": 24, "alertsTriggered": 1 }`

---

### GET `/api/v1/matches/:matchId/queue`

**Purpose:** Get queue length data for gates, concessions, and restrooms.

**Query:** `?type=gate_entry,concession&zoneId={uuid}`

---

## 16. API Module: Incidents

### GET `/api/v1/matches/:matchId/incidents`

**Purpose:** List all incidents for a match. The primary data source for the incident management module.

```
Method:   GET
Auth:     Required (all roles)
Cache:    Cache-Control: no-cache (realtime data)
Performance: P99 < 100ms
```

**Query Parameters:**

| Param          | Type     | Default     | Description                               |
| -------------- | -------- | ----------- | ----------------------------------------- |
| `cursor`       | string   | —           | Pagination cursor                         |
| `limit`        | integer  | 25          | Items per page (max 100)                  |
| `status`       | string   | —           | Filter by status (comma-separated)        |
| `severityTier` | string   | —           | Filter by tier (comma-separated integers) |
| `zoneId`       | UUID     | —           | Filter by zone                            |
| `sortBy`       | enum     | `createdAt` | Sort field                                |
| `sortOrder`    | enum     | `desc`      | Sort direction                            |
| `search`       | string   | —           | Full-text search in title/description     |
| `from`         | datetime | —           | Created after                             |
| `to`           | datetime | —           | Created before                            |

**Example Request:**

```
GET /api/v1/matches/uuid-032/incidents?status=active,open&severityTier=1,2&limit=25
Authorization: Bearer eyJ...
```

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-inc-001",
      "matchId": "uuid-match-032",
      "zoneId": "uuid-zone-c",
      "zoneName": "Zone C — North Stand",
      "title": "Fan collapsed in Zone C",
      "severityTier": 1,
      "status": "active",
      "aiType": "Medical Emergency",
      "aiTier": 1,
      "aiConfidence": 0.94,
      "reportedByName": "J. Rodriguez",
      "assignedToName": "K. Sharma",
      "actionCount": 3,
      "createdAt": "2026-07-12T20:14:32Z",
      "updatedAt": "2026-07-12T20:17:45Z"
    }
  ],
  "pagination": { "nextCursor": "eyJ...", "hasMore": true, "total": 47 }
}
```

---

### POST `/api/v1/matches/:matchId/incidents`

**Purpose:** Create a new incident. Triggers automatic AI classification (async).

```
Method:       POST
Auth:         Required (OM, DM, Coordinator)
Idempotency:  Idempotency-Key header supported
```

**Request Body:**

```json
{
  "title": "Fan collapsed in Zone C gate area",
  "description": "Adult male, approximately 50 years old, collapsed near Gate 3 concourse. Bystanders reported loss of consciousness.",
  "zoneId": "uuid-zone-c",
  "incidentTypeId": "uuid-type-medical",
  "severityTier": 1,
  "locationDetail": "Near Gate 3, Row G area",
  "tags": ["medical", "unconscious", "gate-3"]
}
```

**Validation Rules:**

- `title`: 3-200 characters
- `description`: 10-2000 characters
- `severityTier`: must be 1, 2, 3, or 4
- `zoneId`: must belong to the match's stadium
- `tags`: max 10 tags, each max 50 characters

**Business Logic:**

1. Validate match is active (status = 'active')
2. INSERT incident with `reportedBy = auth.uid()`
3. Enqueue AI classification job (async) → fires `POST /api/v1/ai/incident-classify`
4. If `severityTier = 1`: trigger immediate notifications to OM and DM
5. INSERT `incident_actions` record with `action_type = 'created'`

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "uuid-inc-new",
    "title": "Fan collapsed in Zone C gate area",
    "severityTier": 1,
    "status": "open",
    "aiClassificationStatus": "pending",
    "createdAt": "2026-07-12T20:14:32Z"
  }
}
```

---

### GET `/api/v1/matches/:matchId/incidents/:incidentId`

**Purpose:** Get full incident detail including timeline of actions and AI classification.

**Response:** Full incident object with embedded `actions`, `attachments` count, `aiRecommendation` (latest).

---

### PATCH `/api/v1/matches/:matchId/incidents/:incidentId`

**Purpose:** Update an incident's status, tier, assignment, or resolution.

```
Auth:   Required (OM, DM, Coordinator)
```

**Allowed fields per role:**

- All operational roles: `status`, `assignedTo`, `locationDetail`, `tags`
- OM/DM only: `severityTier`, `humanOverrideType`, `resolutionNotes`

**Business Rules:**

- `closed` incidents cannot be updated (422 INCIDENT_ALREADY_CLOSED)
- Setting `status = 'resolved'` requires `resolutionNotes` (min 10 chars)
- Status changes trigger INSERT into `incident_actions`
- If `humanOverrideType` is set: record `human_override_by` and `human_override_at`

**Request Body:**

```json
{
  "status": "resolved",
  "resolutionNotes": "Medical team responded within 4 minutes. Fan was conscious and transported to medical bay. No life-threatening condition confirmed.",
  "resolvedAt": "2026-07-12T20:22:15Z"
}
```

---

### DELETE `/api/v1/matches/:matchId/incidents/:incidentId`

**Purpose:** Soft delete an incident. OM/DM only.

**Business Rules:**

- Sets `deleted_at = NOW()`
- Only `open` incidents can be deleted (cannot delete active/resolved)
- Inserts audit log record

---

### GET `/api/v1/matches/:matchId/incidents/:incidentId/actions`

**Purpose:** Get the complete timeline of actions for an incident.

**Response:** Array of action objects sorted by `createdAt ASC` (chronological timeline).

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "actionType": "created",
      "performedByName": "J. Rodriguez",
      "performedByRole": "coordinator",
      "notes": null,
      "createdAt": "2026-07-12T20:14:32Z"
    },
    {
      "id": "uuid",
      "actionType": "ai_classification_received",
      "previousValue": null,
      "newValue": "Medical Emergency (Tier 1, 94% confidence)",
      "notes": "Automatic AI classification",
      "createdAt": "2026-07-12T20:14:35Z"
    },
    {
      "id": "uuid",
      "actionType": "status_changed",
      "previousValue": "open",
      "newValue": "active",
      "performedByName": "Het Patel",
      "createdAt": "2026-07-12T20:15:10Z"
    }
  ]
}
```

---

### POST `/api/v1/matches/:matchId/incidents/:incidentId/actions`

**Purpose:** Append a manual note or action to an incident's timeline.

**Request Body:**

```json
{
  "actionType": "note_added",
  "notes": "Paramedic team arrived on scene. Patient is stable."
}
```

---

### GET `/api/v1/matches/:matchId/incidents/:incidentId/attachments`

**Purpose:** List file attachments for an incident.

---

### POST `/api/v1/matches/:matchId/incidents/:incidentId/attachments`

**Purpose:** Upload a file attachment (photo, document) to an incident.

```
Content-Type: multipart/form-data
Body:         file (image/jpeg, image/png, image/webp, application/pdf — max 10MB)
              caption (string, optional, max 200 chars)
```

**Business Logic:** Upload file to Supabase Storage → INSERT `files` record → INSERT `incident_attachments` record.

---

## 17. API Module: Resources

### GET `/api/v1/matches/:matchId/resources`

**Purpose:** List all deployed resources for a match.

**Query:** `?status=available,deployed&zoneId={uuid}&type=medical,security`

**Response:** Paginated resource list with `status`, `zone`, `resourceType`, `staffCount`.

---

### POST `/api/v1/matches/:matchId/resources`

**Purpose:** Create a new resource deployment for this match.

**Request Body:**

```json
{
  "resourceTypeId": "uuid-type-medical",
  "name": "EMT Unit 4",
  "identifier": "EMT-004",
  "staffCount": 2,
  "zoneId": "uuid-zone-d",
  "status": "available",
  "deploymentNotes": "Primary medical response unit, Zone D coverage"
}
```

---

### PATCH `/api/v1/matches/:matchId/resources/:resourceId`

**Purpose:** Update resource status, zone, or deployment details.

**Business Rules:**

- Zone change → INSERT `resource_movements` record
- If `status` changes from `available` to `deployed`: set `deployed_at = NOW()`
- Cannot set `status = 'incident_assigned'` directly — use the `/assign` endpoint

---

### POST `/api/v1/matches/:matchId/resources/:resourceId/assign`

**Purpose:** Assign a resource to an incident.

**Request Body:** `{ "incidentId": "uuid", "notes": "Dispatched per Tier 1 protocol" }`

**Business Logic:**

1. Verify resource `status = 'available'` or `'deployed'`
2. UPDATE resource `status = 'incident_assigned'`
3. INSERT `resource_assignments` record (`released_at = NULL`)
4. INSERT `incident_actions` record (`action_type = 'resource_dispatched'`)

---

### POST `/api/v1/matches/:matchId/resources/:resourceId/release`

**Purpose:** Release a resource from its current incident assignment.

**Request Body:** `{ "incidentId": "uuid", "releaseNotes": "Incident resolved, returning to Zone D" }`

**Business Logic:**

1. Find active `resource_assignments` record
2. UPDATE `resource_assignments.released_at = NOW()`
3. UPDATE resource `status = 'available'`

---

## 18. API Module: Accessibility

### GET `/api/v1/matches/:matchId/accessibility`

**Purpose:** List accessibility service requests for a match.

**Query:** `?status=pending,assigned&type=wheelchair&priority=1,2`

---

### POST `/api/v1/matches/:matchId/accessibility`

**Purpose:** Create a new accessibility assistance request.

**Request Body:**

```json
{
  "requestType": "wheelchair",
  "requesterName": "Maria Santos",
  "requesterLocation": "Gate 3 Entry, near information booth",
  "requesterNotes": "Electric wheelchair, needs assistance to accessible seating in Section AA",
  "zoneId": "uuid-zone-gate3",
  "priority": 1
}
```

---

### PATCH `/api/v1/matches/:matchId/accessibility/:requestId`

**Purpose:** Update request status, assignment, or completion.

**Business Rules:** Setting `status = 'completed'` requires `completionNotes`.

---

## 19. API Module: Alerts & Notifications

### GET `/api/v1/matches/:matchId/alerts`

**Purpose:** List active alerts for a match.

```
Query: ?status=active&severity=critical,emergency
```

**Response:** Alerts sorted by severity DESC, createdAt DESC.

---

### PATCH `/api/v1/matches/:matchId/alerts/:alertId`

**Purpose:** Acknowledge or manually resolve an alert.

**Request Body:**

```json
{ "action": "acknowledge" }
// or
{ "action": "resolve" }
```

---

### GET `/api/v1/notifications`

**Purpose:** Get the authenticated user's notifications.

```
Query: ?isRead=false&limit=20
```

**Response:** Notifications sorted by `createdAt DESC`.

---

### PATCH `/api/v1/notifications/:notificationId`

**Purpose:** Mark a notification as read.

**Request Body:** `{ "isRead": true }`

---

### POST `/api/v1/notifications/read-all`

**Purpose:** Mark all notifications as read for the authenticated user.

---

## 20. API Module: Weather

### GET `/api/v1/matches/:matchId/weather`

**Purpose:** Get the latest weather data for the match location.

**Response:**

```json
{
  "success": true,
  "data": {
    "matchId": "uuid",
    "temperatureC": 36.5,
    "feelsLikeC": 41.2,
    "humidityPct": 68,
    "windSpeedKmh": 12.5,
    "weatherCondition": "Partly Cloudy",
    "uvIndex": 9,
    "recordedAt": "2026-07-12T20:00:00Z",
    "operationalNote": "Heat index elevated. Monitor fan hydration in exposed seating zones."
  }
}
```

---

### POST `/api/v1/matches/:matchId/weather`

**Purpose:** Insert a weather reading. Service role or OM only.

---

## 21. API Module: AI

### POST `/api/v1/ai/operational-summary`

**Purpose:** Generate an AI operational briefing summarizing the current state of the match from an operations perspective.

```
Method:   POST
Auth:     Required (OM, DM)
Rate:     AI tier — 10/min/stadium
Latency:  P99 < 6,000ms
Streaming: Supported (Accept: text/event-stream)
```

**Request Body:**

```json
{
  "matchId": "uuid-match-032",
  "contextWindowMinutes": 15
}
```

**Business Logic:**

1. Check AI rate limit
2. Fetch context: match, incidents (last 15 min), crowd (current), resources, weather, phase
3. Load prompt template `operational_summary` (active version)
4. Call Gemini 2.0 Flash with context + prompt
5. Validate response with Zod schema
6. INSERT `ai_recommendations` (service role)
7. INSERT `ai_call_logs` (service role)
8. Return recommendation

**Response 200:**

```json
{
  "success": true,
  "data": {
    "recommendationId": "uuid-rec-001",
    "featureName": "operational_summary",
    "confidence": 0.88,
    "generatedAt": "2026-07-12T20:14:35Z",
    "expiresAt": "2026-07-12T20:29:35Z",
    "content": {
      "summary": "Match is in the 73rd minute with above-normal crowd pressure in Zone C (91% capacity). Two Tier-2 medical incidents are being managed in Zones B and D. Overall operational health is 82/100. Primary concern: Zone C crowd density approaching critical threshold with sustained high ingress rate.",
      "keyConcerns": [
        "Zone C at 91% capacity — approaching critical threshold",
        "Two simultaneous Tier-2 medical incidents reducing medical resource availability"
      ],
      "positiveIndicators": [
        "Security response time averaging 3.2 minutes",
        "Gate ingress rates normalizing in Zones A and E"
      ],
      "recommendedFocus": "Prioritize Zone C crowd management in next 10 minutes",
      "phaseAssessment": "Match proceeding normally. Anticipate crowd surge at final whistle.",
      "overallHealthScore": 82
    },
    "dataContext": {
      "activeIncidents": 4,
      "tier1Incidents": 0,
      "peakZoneDensityPct": 91.0,
      "resourcesAvailable": 12,
      "phase": "second_half"
    }
  }
}
```

---

### POST `/api/v1/ai/incident-classify`

**Purpose:** AI classification of an incident into type and severity tier. Called automatically after incident creation.

```
Method:   POST
Auth:     Service role (auto-called) or OM/DM (manual re-classify)
Rate:     AI tier — 10/min/stadium
```

**Request Body:**

```json
{
  "incidentId": "uuid-inc-001",
  "matchId": "uuid-match-032"
}
```

**Business Logic:**

1. Fetch incident details
2. Build classification prompt (title, description, location, zone density at time of report)
3. Call Gemini — output must match `IncidentClassifySchema`
4. UPDATE incidents with `ai_type`, `ai_tier`, `ai_confidence`, `ai_classification_at`
5. INSERT `incident_actions` with `action_type = 'ai_classification_received'`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "incidentId": "uuid-inc-001",
    "classification": {
      "type": "Medical Emergency",
      "tier": 1,
      "confidence": 0.94,
      "rationale": "Description indicates loss of consciousness with age-related cardiac risk factors. High-density crowd zone complicates access.",
      "recommendedResponse": "Dispatch nearest medical unit immediately. Clear crowd access path to incident location.",
      "urgent": true
    }
  }
}
```

---

### POST `/api/v1/ai/incident-recommend`

**Purpose:** Generate AI-powered response recommendations for a specific incident.

**Request Body:**

```json
{
  "incidentId": "uuid-inc-001",
  "matchId": "uuid-match-032"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "recommendationId": "uuid-rec-002",
    "incidentId": "uuid-inc-001",
    "confidence": 0.91,
    "content": {
      "immediateActions": [
        "Dispatch EMT Unit 4 from Zone D to Zone C Gate 3 immediately",
        "Clear pedestrian access corridor from concourse to incident location",
        "Notify Gate 3 stewards to manage crowd flow"
      ],
      "resourceDispatch": [
        {
          "resourceType": "Medical",
          "quantity": 1,
          "destinationZone": "Zone C — Gate 3 Area",
          "priority": "high",
          "suggestedResourceId": "uuid-resource-emt4"
        }
      ],
      "crowdManagement": ["Request Zone C stewards to create 3-meter clearance around incident"],
      "communicationSteps": [
        "Radio medical dispatch: 'Medical response required Zone C Gate 3'",
        "Inform Deputy Manager of Tier 1 activation"
      ],
      "estimatedResolutionTime": "8-12 minutes",
      "rationale": "Zone C is at 91% capacity which complicates medical access. EMT Unit 4 in Zone D is closest available unit (estimated 3-minute travel time)."
    }
  }
}
```

---

### POST `/api/v1/ai/crowd-recommendations`

**Purpose:** Generate crowd management recommendations based on current density patterns.

**Request Body:** `{ "matchId": "uuid" }`

**Response:** Prioritized list of crowd management actions with zone-specific recommendations.

---

### POST `/api/v1/ai/executive-summary`

**Purpose:** Generate a full post-match executive summary for senior FIFA officials.

```
Auth:   Required (OM only)
Rate:   AI tier
Note:   Typically called once at post_event phase
Streaming: Strongly recommended (long-form content, ~500 tokens)
```

**Request Body:** `{ "matchId": "uuid" }`

**Response:** Long-form structured summary with incident analysis, crowd patterns, resource utilization, AI performance, and recommendations for next match.

---

### POST `/api/v1/ai/shift-handover`

**Purpose:** Generate a structured shift handover document for outgoing operations managers.

**Request Body:**

```json
{
  "matchId": "uuid",
  "handoverNotes": "Zone C situation being monitored by incoming team. EMT Unit 4 is deployed."
}
```

---

### GET `/api/v1/matches/:matchId/ai/recommendations`

**Purpose:** List AI recommendations for a match.

```
Query: ?feature=incident_recommend&action=&limit=20&activeOnly=true
```

**Response:** Recommendations sorted by `createdAt DESC`, with action status.

---

### PATCH `/api/v1/ai/recommendations/:recommendationId`

**Purpose:** Record a human decision on an AI recommendation (accept or dismiss).

```
Method:   PATCH
Auth:     Required (OM, DM)
```

**Request Body:**

```json
{
  "action": "accepted"
}
// or
{
  "action": "dismissed",
  "dismissReason": "Resources already deployed from a previous recommendation"
}
```

**Business Logic:**

1. Verify recommendation exists and belongs to user's stadium
2. Verify `action_taken IS NULL` (422 AI_DECISION_ALREADY_MADE if already set)
3. Verify `expires_at > NOW()` (422 AI_RECOMMENDATION_EXPIRED if expired)
4. UPDATE `action_taken`, `acted_by = auth.uid()`, `acted_at = NOW()`
5. INSERT `activity_logs` record

**Response 200:** Updated recommendation object with decision recorded.

---

### POST `/api/v1/ai/recommendations/:recommendationId/feedback`

**Purpose:** Submit user feedback on an AI recommendation's quality.

**Request Body:**

```json
{ "rating": 1, "feedbackText": "Recommendation was accurate and actionable." }
// rating: 1 (helpful) or -1 (not helpful)
```

---

### GET `/api/v1/ai/metrics`

**Purpose:** AI performance dashboard data. Admin/OM only.

```
Query: ?from=2026-07-12T00:00:00Z&to=2026-07-13T00:00:00Z&feature=incident_recommend
```

**Response:** Aggregate AI metrics (call count, success rate, avg latency, token usage, acceptance rate, hallucination rate).

---

## 22. API Module: Analytics & KPIs

### GET `/api/v1/matches/:matchId/analytics`

**Purpose:** Full match analytics snapshot for the reports module.

```
Auth:   Required (OM, DM, Coordinator, RO)
Cache:  max-age=300 (5 minutes — KPIs refreshed by cron)
```

**Response:**

```json
{
  "success": true,
  "data": {
    "matchId": "uuid",
    "generatedAt": "2026-07-12T20:14:30Z",
    "incidents": {
      "total": 24,
      "byTier": { "tier1": 1, "tier2": 3, "tier3": 11, "tier4": 9 },
      "byStatus": { "active": 4, "resolved": 18, "closed": 2 },
      "avgResolutionMinutes": 7.4,
      "fastestResolutionMinutes": 1.2
    },
    "crowd": {
      "peakDensityPct": 91.0,
      "peakDensityAt": "2026-07-12T20:14:00Z",
      "avgDensityPct": 68.2,
      "zonesExceededAlert": 3,
      "totalFanCount": 54820
    },
    "resources": {
      "totalDeployed": 48,
      "peakIncidentAssigned": 6,
      "avgZoneCoverage": 3.2
    },
    "ai": {
      "recommendationsGenerated": 31,
      "recommendationsAccepted": 26,
      "acceptanceRatePct": 83.9,
      "avgConfidence": 0.87
    },
    "accessibility": {
      "totalRequests": 12,
      "completedRequests": 11,
      "avgResponseMinutes": 4.2
    },
    "healthScoreTrend": [
      { "capturedAt": "2026-07-12T18:00:00Z", "score": 95 },
      { "capturedAt": "2026-07-12T18:05:00Z", "score": 93 }
    ]
  }
}
```

---

### GET `/api/v1/matches/:matchId/kpis`

**Purpose:** Current KPI snapshot for the KPI strip on the Command Center.

```
Cache: max-age=30 (near-realtime via poll fallback if Realtime unavailable)
```

**Response:** Latest `kpi_snapshots` row as a flat object.

---

### GET `/api/v1/matches/:matchId/health-score`

**Purpose:** Current and historical health score data for the health score gauge and sparkline.

**Response:**

```json
{
  "success": true,
  "data": {
    "current": {
      "score": 82,
      "incidentScore": 78,
      "crowdScore": 75,
      "resourceScore": 88,
      "accessibilityScore": 100,
      "capturedAt": "2026-07-12T20:10:00Z"
    },
    "sparkline": [
      { "capturedAt": "2026-07-12T19:10:00Z", "score": 95 },
      { "capturedAt": "2026-07-12T19:15:00Z", "score": 94 },
      { "capturedAt": "2026-07-12T20:10:00Z", "score": 82 }
    ]
  }
}
```

---

### GET `/api/v1/matches/:matchId/phase-timeline`

**Purpose:** Get the complete phase transition history for a match.

**Response:** Array of phase transitions with `fromPhase`, `toPhase`, `initiatedBy`, `createdAt`.

---

## 23. API Module: Reports

### GET `/api/v1/matches/:matchId/reports`

**Purpose:** List generated reports for a match.

---

### POST `/api/v1/matches/:matchId/reports/generate`

**Purpose:** Generate a new match report using AI.

```
Method:   POST
Auth:     Required (OM, DM)
```

**Request Body:**

```json
{
  "reportType": "executive_summary",
  "title": "Match 32 — Brazil vs Argentina — Operations Executive Summary"
}
```

**Business Logic:**

1. INSERT `reports` record with `status = 'generating'`
2. Enqueue `generate_report` background job
3. Job calls AI executive summary endpoint
4. Job UPDATE `reports.status = 'complete'`

**Response 202 (Accepted):**

```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "status": "generating",
    "estimatedSeconds": 15,
    "pollUrl": "/api/v1/matches/uuid/reports/uuid"
  }
}
```

---

### GET `/api/v1/matches/:matchId/reports/:reportId`

**Purpose:** Get a specific report including its generated content.

---

### POST `/api/v1/matches/:matchId/reports/:reportId/export`

**Purpose:** Trigger PDF export of a report.

**Request Body:** `{ "format": "pdf" }`

**Response 202:** `{ "exportId": "uuid", "status": "generating" }`

---

### GET `/api/v1/matches/:matchId/reports/:reportId/exports/:exportId/download`

**Purpose:** Get a signed download URL for a completed report export.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://project.supabase.co/storage/v1/object/sign/reports/...",
    "expiresAt": "2026-07-12T21:14:32Z",
    "fileName": "Match32_Executive_Summary_20260712.pdf",
    "fileSizeBytes": 245120
  }
}
```

---

## 24. API Module: Files

### POST `/api/v1/files/upload`

**Purpose:** Upload a file to Supabase Storage.

```
Method:        POST
Content-Type:  multipart/form-data
Auth:          Required (all operational roles)
Rate:          5/minute/user
Max Size:      10MB
```

**Form Fields:**

```
file      (required) — The binary file
bucket    (required) — Target bucket: "incident-attachments" | "reports" | "avatars"
caption   (optional) — Text caption
```

**Business Logic:**

1. Validate file type is allowed for the specified bucket
2. Validate file size ≤ bucket limit
3. Generate storage path: `{bucket}/{stadiumId}/{entityId}/{uuid}.{ext}`
4. Upload to Supabase Storage
5. INSERT `files` record
6. Return file metadata + storage path

**Response 201:**

```json
{
  "success": true,
  "data": {
    "fileId": "uuid",
    "originalName": "scene_photo.jpg",
    "mimeType": "image/jpeg",
    "sizeBytes": 1847293,
    "storagePath": "incident-attachments/uuid-stadium/uuid-incident/uuid.jpg",
    "status": "ready",
    "createdAt": "2026-07-12T20:14:32Z"
  }
}
```

---

### GET `/api/v1/files/:fileId`

**Purpose:** Get file metadata (not the binary file content).

---

### DELETE `/api/v1/files/:fileId`

**Purpose:** Soft delete a file record. Actual storage deletion is async.

---

### POST `/api/v1/files/:fileId/signed-url`

**Purpose:** Generate a temporary signed download URL for a private file.

**Request Body:** `{ "expiresInSeconds": 3600 }` (max 86400 = 24 hours)

**Response 200:** `{ "signedUrl": "https://...", "expiresAt": "..." }`

---

## 25. API Module: Search

### GET `/api/v1/search`

**Purpose:** Cross-entity full-text search across incidents, resources, and accessibility requests.

```
Method:   GET
Auth:     Required (all roles)
Rate:     Standard authenticated tier
Cache:    Cache-Control: no-cache
```

**Query Parameters:**

| Param     | Type    | Required | Description                                                             |
| --------- | ------- | -------- | ----------------------------------------------------------------------- |
| `q`       | string  | Yes      | Search query (min 2 chars, max 100 chars)                               |
| `matchId` | UUID    | Yes      | Scope search to a specific match                                        |
| `types`   | string  | No       | Entity types to search (comma-sep): `incidents,resources,accessibility` |
| `limit`   | integer | No       | Results per type (default 5, max 20)                                    |

**Example Request:**

```
GET /api/v1/search?q=medical+zone+c&matchId=uuid-032&types=incidents,resources
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "query": "medical zone c",
    "totalResults": 8,
    "results": {
      "incidents": {
        "count": 5,
        "items": [
          {
            "id": "uuid",
            "type": "incident",
            "title": "Medical Emergency — Zone C",
            "severityTier": 1,
            "status": "active",
            "highlight": "Fan collapsed in <em>Zone C</em> gate area. <em>Medical</em> team dispatched.",
            "createdAt": "2026-07-12T20:14:32Z"
          }
        ]
      },
      "resources": {
        "count": 3,
        "items": [
          {
            "id": "uuid",
            "type": "resource",
            "name": "EMT Unit 4 (Medical)",
            "status": "incident_assigned",
            "zoneName": "Zone C",
            "highlight": "<em>Medical</em> unit — currently in <em>Zone C</em>"
          }
        ]
      }
    }
  }
}
```

**Implementation:**

```sql
-- Full-text search using pre-built tsvector index
SELECT id, 'incident' AS type, title, severity_tier, status,
  ts_headline('english', title || ' ' || description, query) AS highlight
FROM incidents, to_tsquery('english', $1) query
WHERE match_id = $2
  AND to_tsvector('english', title || ' ' || description) @@ query
  AND deleted_at IS NULL
ORDER BY ts_rank(to_tsvector('english', title || ' ' || description), query) DESC
LIMIT 20;
```

---

## 26. API Module: Settings & Feature Flags

### GET `/api/v1/settings`

**Purpose:** Get all settings for the authenticated user's stadium.

**Response:** Object with all `system_settings` key-value pairs (sensitive values masked for non-OM roles).

---

### PATCH `/api/v1/settings/:key`

**Purpose:** Update a specific stadium setting. OM only.

**Request Body:** `{ "value": { "crowdAlertThresholdPct": 80 } }`

---

### GET `/api/v1/feature-flags`

**Purpose:** Get all feature flags applicable to the authenticated user's stadium.

**Response:**

```json
{
  "success": true,
  "data": {
    "aiCrowdRecommendations": true,
    "executiveSummary": true,
    "predictiveCrowd": false,
    "transportationModule": true
  }
}
```

---

### PATCH `/api/v1/feature-flags/:flagName`

**Purpose:** Toggle a feature flag. OM only.

---

## 27. API Module: Admin

### GET `/api/v1/admin/audit-logs`

**Purpose:** Query the immutable audit log. OM only.

```
Query: ?tableName=incidents&recordId={uuid}&operation=UPDATE&from=...&to=...&limit=50&page=1
```

**Response:** Paginated audit log entries with `old_data`, `new_data`, `performed_by`, `created_at`.

---

### GET `/api/v1/admin/ai-metrics`

**Purpose:** Full AI performance metrics dashboard.

**Response:** Aggregate stats by feature, by prompt version, by model — with latency percentiles, token usage, acceptance rates, hallucination rates.

---

### GET `/api/v1/admin/users`

**Purpose:** List all users in the stadium with management capabilities. OM only.

---

## 28. API Module: System Health

### GET `/api/v1/health`

**Purpose:** System health check. No authentication required. Used by load balancers and uptime monitors.

```
Method:    GET
Auth:      None
Cache:     Cache-Control: no-cache, no-store
Rate:      20/minute/IP (unauthenticated)
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-07-12T20:14:32Z",
    "uptime": 86400,
    "environment": "production",
    "services": {
      "database": "healthy",
      "realtime": "healthy",
      "storage": "healthy",
      "ai": "healthy"
    }
  }
}
```

**Response 503 (partial degradation):**

```json
{
  "success": true,
  "data": {
    "status": "degraded",
    "services": {
      "database": "healthy",
      "realtime": "healthy",
      "storage": "healthy",
      "ai": "unavailable"
    },
    "message": "AI service is experiencing issues. All operational features remain available."
  }
}
```

---

### GET `/api/v1/health/ai`

**Purpose:** AI subsystem health check including recent call stats.

**Response:** AI service status, last 5-minute call success rate, average latency, current rate limit usage per stadium.

---

### GET `/api/v1/health/db`

**Purpose:** Database health check. Includes connection pool status and query performance.

**Auth:** Required (OM only — contains sensitive DB metrics)

---

## 29. WebSocket & Realtime API

### 29.1 Supabase Realtime Architecture

ArenaMind AI uses **Supabase Realtime** for all live data delivery. The Supabase Realtime service uses **PostgreSQL Logical Replication (WAL)** to capture row-level changes and broadcast them to subscribed WebSocket clients.

```mermaid
sequenceDiagram
    participant Client as Browser Client
    participant RT as Supabase Realtime Server
    participant WAL as PostgreSQL WAL
    participant DB as PostgreSQL Primary

    Client->>RT: WebSocket handshake + JWT
    RT->>RT: Verify JWT + Extract stadium_id
    Client->>RT: Subscribe {table: 'incidents', filter: 'match_id=eq.{id}'}
    RT->>RT: Validate subscription against JWT claims
    RT-->>Client: Subscription confirmed

    DB->>WAL: INSERT/UPDATE generates WAL event
    WAL->>RT: CDC event received
    RT->>RT: Apply filter (match_id matches subscriber's filter)
    RT->>RT: Apply RLS check (row belongs to subscriber's stadium)
    RT-->>Client: Real-time event payload

    Client->>RT: Heartbeat ping (every 30s)
    RT-->>Client: Heartbeat pong
```

### 29.2 Client Connection Setup

```typescript
// supabase/realtime-client.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    realtime: {
      params: { eventsPerSecond: 10 }, // Client-side throttle
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
```

### 29.3 Channel Specifications

#### Channel 1: Crowd Data

```typescript
// Purpose: Live crowd density updates (every 30 seconds per zone)
// Frequency: ~48 events per 30 seconds per match
// Filter: match-scoped (avoids cross-match data)

const crowdChannel = supabase
  .channel(`crowd-${matchId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'crowd_data',
      filter: `match_id=eq.${matchId}`,
    },
    (payload) => {
      handleCrowdUpdate(payload.new as CrowdDataRow);
    }
  )
  .subscribe();

// Event payload shape:
type CrowdDataEvent = {
  type: 'INSERT';
  table: 'crowd_data';
  schema: 'public';
  new: {
    id: string;
    match_id: string;
    zone_id: string;
    fan_count: number;
    safe_capacity: number;
    density_pct: number; // Generated column — included in payload
    ingress_rate: number;
    egress_rate: number;
    recorded_at: string;
  };
  old: null;
};
```

#### Channel 2: Incidents

```typescript
// Purpose: Live incident feed updates (creates, status changes, AI classification)
// Events: INSERT (new incident) + UPDATE (status, AI classification, tier)
// Priority: Highest (Tier 1 incidents trigger UI alerts)

const incidentChannel = supabase
  .channel(`incidents-${matchId}`)
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT and UPDATE
      schema: 'public',
      table: 'incidents',
      filter: `match_id=eq.${matchId}`,
    },
    (payload) => {
      if (payload.eventType === 'INSERT') handleNewIncident(payload.new);
      if (payload.eventType === 'UPDATE') handleIncidentUpdate(payload.new, payload.old);
    }
  )
  .subscribe();
```

#### Channel 3: Resources

```typescript
// Purpose: Resource status change tracking
// Events: INSERT (new resource) + UPDATE (status, zone, deployment)

const resourceChannel = supabase
  .channel(`resources-${matchId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'resources',
      filter: `match_id=eq.${matchId}`,
    },
    handleResourceChange
  )
  .subscribe();
```

#### Channel 4: Match Phase

```typescript
// Purpose: Critical — phase change broadcast to all clients in the match
// Events: UPDATE on matches table (current_phase field)
// Client response: UI phase indicator update, module reordering

const phaseChannel = supabase
  .channel(`phase-${matchId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'matches',
      filter: `id=eq.${matchId}`,
    },
    (payload) => {
      if (payload.new.current_phase !== payload.old.current_phase) {
        handlePhaseChange(payload.new.current_phase);
      }
    }
  )
  .subscribe();
```

#### Channel 5: Notifications

```typescript
// Purpose: User-targeted notification delivery
// Events: INSERT on notifications (filtered by user_id)

const notifChannel = supabase
  .channel(`notifications-${userId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      displayNotification(payload.new as NotificationRow);
    }
  )
  .subscribe();
```

#### Channel 6: Accessibility Requests

```typescript
const accessibilityChannel = supabase
  .channel(`accessibility-${matchId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'accessibility_requests',
      filter: `match_id=eq.${matchId}`,
    },
    handleAccessibilityChange
  )
  .subscribe();
```

### 29.4 Presence Protocol

For the multi-user operations dashboard, presence shows which users are currently online in the same match:

```typescript
// Broadcast presence on channel join
const presenceChannel = supabase.channel(`presence-${matchId}`, {
  config: { presence: { key: userId } },
});

presenceChannel
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    updateOnlineUsers(state);
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    addOnlineUser(newPresences[0]);
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    removeOnlineUser(key);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({
        userId,
        fullName: user.fullName,
        role: user.role,
        joinedAt: new Date().toISOString(),
      });
    }
  });
```

### 29.5 Connection Lifecycle Management

```typescript
// hooks/useRealtimeConnection.ts
export function useRealtimeConnection(matchId: string) {
  const [status, setStatus] = useState<
    'connecting' | 'connected' | 'reconnecting' | 'disconnected'
  >('connecting');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;
  const BASE_RETRY_DELAY = 1000; // 1 second

  useEffect(() => {
    const channel = subscribeToMatchChannels(matchId);

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setStatus('connected');
        setRetryCount(0);
      }
      if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setStatus('reconnecting');
        const delay = Math.min(BASE_RETRY_DELAY * Math.pow(2, retryCount), 30000);
        setTimeout(() => {
          if (retryCount < MAX_RETRIES) {
            setRetryCount((r) => r + 1);
            channel.subscribe(); // Re-subscribe
          } else {
            setStatus('disconnected');
            // Fall back to polling every 5 seconds
            startPollingFallback(matchId);
          }
        }, delay);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  return { status, retryCount };
}
```

### 29.6 Polling Fallback

When Realtime is unavailable (network issues, Supabase degradation):

```typescript
// Polling fallback — activates when Realtime disconnects
const POLL_INTERVAL = 5000; // 5 seconds during fallback

function startPollingFallback(matchId: string) {
  const interval = setInterval(async () => {
    const [crowd, incidents, resources] = await Promise.all([
      fetchCrowdCurrent(matchId),
      fetchIncidents(matchId, { limit: 5, sortBy: 'updatedAt' }),
      fetchResources(matchId, { status: 'incident_assigned' }),
    ]);
    updateDashboardState({ crowd, incidents, resources });
  }, POLL_INTERVAL);

  return () => clearInterval(interval);
}
```

### 29.7 Heartbeat Configuration

```typescript
// Supabase Realtime auto-sends heartbeats every 30 seconds
// If 3 consecutive heartbeats are missed, the connection is considered dead
// Client-side: Supabase SDK handles reconnection automatically

// Additional application-level heartbeat (optional):
const heartbeatInterval = setInterval(() => {
  if (channel.state !== 'joined') {
    console.warn('[Realtime] Heartbeat detected stale connection — reconnecting');
    channel.subscribe();
  }
}, 90_000); // 90 seconds
```

---

## 30. OpenAPI 3.1 Specification

```yaml
openapi: '3.1.0'

info:
  title: ArenaMind AI API
  description: |
    The ArenaMind AI API provides real-time stadium operations intelligence
    for FIFA World Cup 2026 venues. This API serves the ArenaMind AI platform
    including the operations dashboard, mobile applications, and AI services.
  version: '1.0.0'
  contact:
    name: ArenaMind AI Engineering
    email: engineering@arenamind.ai
  license:
    name: Proprietary
    identifier: proprietary

servers:
  - url: https://arenamind.ai/api/v1
    description: Production
  - url: https://staging.arenamind.ai/api/v1
    description: Staging
  - url: http://localhost:3000/api/v1
    description: Local Development

tags:
  - name: Authentication
    description: Login, logout, token management
  - name: Users
    description: User profiles and management
  - name: Stadiums
    description: Stadium configuration and zones
  - name: Matches
    description: Match lifecycle and phase management
  - name: Crowd Intelligence
    description: Real-time crowd density and predictions
  - name: Incidents
    description: Incident management and classification
  - name: Resources
    description: Resource deployment and tracking
  - name: AI
    description: AI recommendations, summaries, and analysis
  - name: Analytics
    description: KPIs, health scores, and match analytics
  - name: Reports
    description: Report generation and export
  - name: Files
    description: File upload and management
  - name: System
    description: Health checks and system status

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Supabase-issued JWT. Obtain via POST /auth/login.

  parameters:
    MatchId:
      name: matchId
      in: path
      required: true
      description: UUID of the match
      schema:
        type: string
        format: uuid
    IncidentId:
      name: incidentId
      in: path
      required: true
      description: UUID of the incident
      schema:
        type: string
        format: uuid
    Cursor:
      name: cursor
      in: query
      required: false
      description: Pagination cursor from previous response
      schema:
        type: string
    Limit:
      name: limit
      in: query
      required: false
      description: Maximum items to return (1-100)
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 25

  schemas:
    # ─── CORE ENTITIES ───

    Stadium:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string, example: 'Al Bayt Stadium' }
        shortName: { type: string, example: 'Al Bayt' }
        city: { type: string }
        country: { type: string }
        capacity: { type: integer, minimum: 1 }
        timezone: { type: string, example: 'Asia/Qatar' }
        zoneCount: { type: integer }
        isActive: { type: boolean }
        createdAt: { type: string, format: date-time }

    Match:
      type: object
      properties:
        id: { type: string, format: uuid }
        stadiumId: { type: string, format: uuid }
        matchNumber: { type: integer }
        homeTeam: { type: string }
        awayTeam: { type: string }
        scheduledAt: { type: string, format: date-time }
        kickoffAt: { type: string, format: date-time, nullable: true }
        currentPhase:
          type: string
          enum:
            [
              pre_event,
              gate_opening,
              fan_arrival,
              pre_kickoff,
              match_live,
              halftime,
              second_half,
              full_time,
              crowd_exit,
              post_event,
            ]
        matchStatus:
          type: string
          enum: [scheduled, active, completed, cancelled]
        expectedAttendance: { type: integer, nullable: true }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }

    Zone:
      type: object
      properties:
        id: { type: string, format: uuid }
        stadiumId: { type: string, format: uuid }
        name: { type: string, example: 'Zone C — North Stand' }
        shortCode: { type: string, example: 'ZC-N' }
        zoneType:
          type: string
          enum: [seating, concourse, gate, concession, medical, parking, service]
        safeCapacity: { type: integer }
        alertThresholdPct: { type: integer }
        criticalThresholdPct: { type: integer }
        isActive: { type: boolean }

    Incident:
      type: object
      properties:
        id: { type: string, format: uuid }
        matchId: { type: string, format: uuid }
        stadiumId: { type: string, format: uuid }
        zoneId: { type: string, format: uuid, nullable: true }
        zoneName: { type: string, nullable: true }
        incidentTypeId: { type: string, format: uuid, nullable: true }
        reportedBy: { type: string, format: uuid }
        reportedByName: { type: string }
        assignedTo: { type: string, format: uuid, nullable: true }
        assignedToName: { type: string, nullable: true }
        title: { type: string, maxLength: 200 }
        description: { type: string, maxLength: 2000 }
        locationDetail: { type: string, nullable: true }
        severityTier:
          type: integer
          enum: [1, 2, 3, 4]
          description: '1=Life Safety, 2=Serious, 3=Moderate, 4=Minor'
        status:
          type: string
          enum: [open, active, monitoring, resolved, closed]
        aiType: { type: string, nullable: true }
        aiTier: { type: integer, nullable: true }
        aiConfidence: { type: number, minimum: 0, maximum: 1, nullable: true }
        tags: { type: array, items: { type: string } }
        resolvedAt: { type: string, format: date-time, nullable: true }
        resolutionNotes: { type: string, nullable: true }
        deletedAt: { type: string, format: date-time, nullable: true }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }

    Resource:
      type: object
      properties:
        id: { type: string, format: uuid }
        matchId: { type: string, format: uuid }
        stadiumId: { type: string, format: uuid }
        resourceTypeId: { type: string, format: uuid }
        resourceTypeName: { type: string }
        zoneId: { type: string, format: uuid, nullable: true }
        zoneName: { type: string, nullable: true }
        name: { type: string, example: 'EMT Unit 4' }
        identifier: { type: string, nullable: true }
        staffCount: { type: integer, minimum: 0 }
        status:
          type: string
          enum: [available, deployed, incident_assigned, off_duty, unavailable]
        currentLocation: { type: string, nullable: true }
        deployedAt: { type: string, format: date-time, nullable: true }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }

    AIRecommendation:
      type: object
      properties:
        id: { type: string, format: uuid }
        matchId: { type: string, format: uuid }
        featureName:
          type: string
          enum:
            [
              operational_summary,
              incident_classify,
              incident_recommend,
              crowd_recommendations,
              executive_summary,
              shift_handover,
            ]
        modelName: { type: string, example: 'gemini-2.0-flash' }
        promptVersion: { type: string, example: 'incident-recommend-v1.2' }
        data:
          type: object
          description: 'Feature-specific structured AI output'
          additionalProperties: true
        confidenceScore: { type: number, minimum: 0, maximum: 1, nullable: true }
        hallucinationDetected: { type: boolean }
        actionTaken:
          type: string
          enum: [accepted, dismissed, expired, superseded]
          nullable: true
        actedBy: { type: string, format: uuid, nullable: true }
        actedAt: { type: string, format: date-time, nullable: true }
        dismissReason: { type: string, nullable: true }
        expiresAt: { type: string, format: date-time }
        createdAt: { type: string, format: date-time }

    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        fullName: { type: string }
        role:
          type: string
          enum: [operations_manager, deputy_manager, coordinator, read_only]
        department: { type: string, nullable: true }
        phoneNumber: { type: string, nullable: true }
        employeeId: { type: string, nullable: true }
        stadiumId: { type: string, format: uuid }
        stadiumName: { type: string }
        isActive: { type: boolean }
        lastSeenAt: { type: string, format: date-time, nullable: true }
        preferences: { type: object, additionalProperties: true }
        createdAt: { type: string, format: date-time }

    CrowdData:
      type: object
      properties:
        zoneId: { type: string, format: uuid }
        zoneName: { type: string }
        zoneCode: { type: string }
        fanCount: { type: integer }
        safeCapacity: { type: integer }
        densityPct: { type: number, minimum: 0, maximum: 200 }
        densityLevel:
          type: string
          enum: [sparse, normal, elevated, high, critical]
        ingressRate: { type: integer }
        egressRate: { type: integer }
        recordedAt: { type: string, format: date-time }

    # ─── RESPONSE WRAPPERS ───

    SuccessResponse:
      type: object
      required: [success, data, meta]
      properties:
        success: { type: boolean, enum: [true] }
        data: {}
        meta:
          type: object
          properties:
            timestamp: { type: string, format: date-time }
            requestId: { type: string }
            version: { type: string }

    ErrorResponse:
      type: object
      required: [success, error, meta]
      properties:
        success: { type: boolean, enum: [false] }
        error:
          type: object
          required: [code, message]
          properties:
            code: { type: string }
            message: { type: string }
            details: { type: string, nullable: true }
            fieldErrors:
              type: array
              items:
                type: object
                properties:
                  field: { type: string }
                  message: { type: string }
            retryAfter: { type: integer, nullable: true }
        meta:
          type: object
          properties:
            timestamp: { type: string, format: date-time }
            requestId: { type: string }

    PaginationMeta:
      type: object
      properties:
        nextCursor: { type: string, nullable: true }
        hasMore: { type: boolean }
        total: { type: integer, nullable: true }

  responses:
    Unauthorized:
      description: Authentication required or token invalid
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
          example:
            success: false
            error: { code: 'TOKEN_EXPIRED', message: 'JWT has expired' }
    Forbidden:
      description: Insufficient permissions
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    RateLimited:
      description: Rate limit exceeded
      headers:
        Retry-After: { schema: { type: integer } }
        X-RateLimit-Reset: { schema: { type: integer } }
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    ValidationError:
      description: Request validation failed
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }

paths:
  /auth/login:
    post:
      tags: [Authentication]
      summary: Authenticate user
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email: { type: string, format: email }
                password: { type: string, minLength: 8 }
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          accessToken: { type: string }
                          refreshToken: { type: string }
                          expiresIn: { type: integer }
                          user: { $ref: '#/components/schemas/User' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '429': { $ref: '#/components/responses/RateLimited' }

  /matches/{matchId}/incidents:
    get:
      tags: [Incidents]
      summary: List match incidents
      parameters:
        - $ref: '#/components/parameters/MatchId'
        - $ref: '#/components/parameters/Cursor'
        - $ref: '#/components/parameters/Limit'
        - name: status
          in: query
          schema: { type: string }
          description: Comma-separated status values
        - name: severityTier
          in: query
          schema: { type: string }
          description: Comma-separated tier values (1,2,3,4)
        - name: sortBy
          in: query
          schema:
            type: string
            enum: [createdAt, updatedAt, severityTier]
            default: createdAt
      responses:
        '200':
          description: Incidents list
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items: { $ref: '#/components/schemas/Incident' }
                      pagination: { $ref: '#/components/schemas/PaginationMeta' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '404': { $ref: '#/components/responses/NotFound' }

    post:
      tags: [Incidents]
      summary: Create a new incident
      parameters:
        - $ref: '#/components/parameters/MatchId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, description, severityTier]
              properties:
                title: { type: string, minLength: 3, maxLength: 200 }
                description: { type: string, minLength: 10, maxLength: 2000 }
                zoneId: { type: string, format: uuid, nullable: true }
                incidentTypeId: { type: string, format: uuid, nullable: true }
                severityTier: { type: integer, enum: [1, 2, 3, 4] }
                locationDetail: { type: string, maxLength: 300, nullable: true }
                tags: { type: array, items: { type: string, maxLength: 50 }, maxItems: 10 }
      responses:
        '201':
          description: Incident created
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Incident' }
        '400': { $ref: '#/components/responses/ValidationError' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '403': { $ref: '#/components/responses/Forbidden' }

  /ai/recommendations/{recommendationId}:
    patch:
      tags: [AI]
      summary: Accept or dismiss an AI recommendation
      parameters:
        - name: recommendationId
          in: path
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [action]
              properties:
                action:
                  type: string
                  enum: [accepted, dismissed]
                dismissReason:
                  type: string
                  maxLength: 500
                  description: Required when action is 'dismissed'
      responses:
        '200':
          description: Decision recorded
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/AIRecommendation' }
        '422':
          description: Business rule violation
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ErrorResponse' }
              examples:
                alreadyDecided:
                  summary: Decision already made
                  value:
                    success: false
                    error:
                      code: AI_DECISION_ALREADY_MADE
                      message: Cannot change a decision once accepted or dismissed
                expired:
                  summary: Recommendation expired
                  value:
                    success: false
                    error:
                      code: AI_RECOMMENDATION_EXPIRED
                      message: This recommendation expired 3 minutes ago. Request a new one.
```

---

## 31. Caching Strategy

### 31.1 Cache-Control Policy by Endpoint Category

| Category               | Cache-Control                                    | ETag | Rationale                                   |
| ---------------------- | ------------------------------------------------ | ---- | ------------------------------------------- |
| Stadium config         | `private, max-age=3600`                          | Yes  | Static data; changes at most once per event |
| Zone config            | `private, max-age=1800`                          | Yes  | Semi-static                                 |
| Active match           | `private, max-age=30, stale-while-revalidate=60` | No   | Changes on phase transitions                |
| Crowd current          | `no-cache, no-store`                             | No   | Real-time; freshness is safety-critical     |
| Crowd trends           | `private, max-age=60`                            | Yes  | Aggregated; 1 minute staleness acceptable   |
| Incidents list         | `no-cache`                                       | No   | Match-day operational data                  |
| Incident detail        | `private, max-age=15`                            | Yes  | Detail can be cached briefly                |
| AI recommendations     | `no-cache`                                       | No   | Decisions must reflect current state        |
| KPI snapshot           | `private, max-age=300`                           | No   | Pre-computed every 5 minutes                |
| Health score           | `private, max-age=30`                            | No   | Near-realtime                               |
| Analytics (post-match) | `private, max-age=3600`                          | Yes  | Static after match end                      |
| System health          | `no-cache, no-store`                             | No   | Must always reflect live state              |

### 31.2 ETag Implementation

```typescript
// ETag generation for incident detail
async function GET(request: Request, { params }: { params: { incidentId: string } }) {
  const incident = await getIncident(params.incidentId);

  const etag = `"${incident.updatedAt.getTime()}"`;
  const ifNoneMatch = request.headers.get('If-None-Match');

  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return NextResponse.json(wrapSuccess(incident), {
    headers: {
      ETag: etag,
      'Cache-Control': 'private, max-age=15',
      'Last-Modified': incident.updatedAt.toUTCString(),
    },
  });
}
```

---

## 32. Security Design

### 32.1 Security Headers

```typescript
// Applied by Next.js middleware to all responses
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' https://fonts.googleapis.com", // unsafe-eval: Next.js dev only
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
  ].join('; '),
};
```

### 32.2 Input Sanitization

```typescript
// All string inputs are sanitized before DB insertion
import DOMPurify from 'isomorphic-dompurify';

function sanitizeString(input: string): string {
  // Strip HTML tags (prevents stored XSS if content is rendered)
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  // Normalize whitespace
  return clean.trim().replace(/\s+/g, ' ');
}

// Applied automatically in Zod transform:
const titleSchema = z.string().min(3).max(200).transform(sanitizeString);
```

### 32.3 CORS Configuration

```typescript
const CORS_CONFIG = {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://arenamind.ai', 'https://app.arenamind.ai']
      : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'Idempotency-Key',
    'If-None-Match',
    'If-Modified-Since',
  ],
  credentials: true,
  maxAge: 86400,
};
```

### 32.4 Secrets Management

```
RULES:
  1. SUPABASE_SERVICE_ROLE_KEY — server-only (.env.local, Vercel env)
  2. GEMINI_API_KEY — server-only
  3. NEXT_PUBLIC_SUPABASE_ANON_KEY — safe to expose (RLS protects data)
  4. NEXT_PUBLIC_SUPABASE_URL — safe to expose
  5. No secret MUST appear in:
     - Client-side JavaScript bundle
     - Server logs (use masking)
     - Error responses to clients
     - Git repository (even private)

VERIFICATION:
  grep -r "service_role" ./src  # Must return 0 results in client files
  grep -r "GEMINI_API_KEY" ./src  # Must not appear in client files
```

### 32.5 API Key Security (for Service Accounts)

Future service accounts (e.g., sensor hardware, third-party integrations) use API keys stored in `api_keys` table:

```typescript
type APIKeyAuthentication = {
  scheme: 'header';
  header: 'X-API-Key';
  format: 'am_live_{24-char-random}'; // Prefix identifies key type
  hashing: 'bcrypt(key, salt=12)'; // Only hash stored in DB
  scopes: ['crowd_data:write', 'incidents:read'];
};
```

---

## 33. Performance Targets

### 33.1 Latency SLOs by Endpoint Category

| Category                     | P50     | P95     | P99     | Rationale                             |
| ---------------------------- | ------- | ------- | ------- | ------------------------------------- |
| Auth (login/refresh)         | 150ms   | 400ms   | 800ms   | Supabase Auth overhead                |
| Simple GET (stadium, zone)   | 10ms    | 30ms    | 50ms    | Cached + indexed single lookup        |
| Operational list (incidents) | 20ms    | 60ms    | 100ms   | Indexed + RLS                         |
| Crowd heatmap                | 15ms    | 40ms    | 50ms    | Covering index — near index-only scan |
| AI operational summary       | 1,500ms | 4,000ms | 6,000ms | Gemini 2.0 Flash latency              |
| AI incident classify         | 800ms   | 2,500ms | 4,000ms | Shorter prompt                        |
| AI executive summary         | 3,000ms | 6,000ms | 8,000ms | Long-form generation                  |
| File upload (10MB)           | 1,000ms | 3,000ms | 5,000ms | Supabase Storage upload               |
| Search                       | 30ms    | 100ms   | 200ms   | GIN index + pg_trgm                   |
| Health check                 | 2ms     | 5ms     | 10ms    | Minimal computation                   |

### 33.2 Payload Optimization

```typescript
// Response compression (gzip/brotli via Next.js built-in)
// next.config.ts
const nextConfig = {
  compress: true,
  // Brotli for modern clients, gzip fallback
};

// Selective field returns to minimize payload:
// Instead of always returning full incident object with all fields:
// List endpoints → summary fields only (id, title, status, tier, zone, createdAt)
// Detail endpoint → full object with embedded relations

// JSON streaming for large AI responses (SSE):
// Avoids holding full response in memory before sending
```

### 33.3 AI Response Streaming

For AI endpoints generating long-form content, streaming reduces time-to-first-byte from ~6000ms to ~500ms:

```typescript
// AI streaming route handler
export async function POST(request: Request) {
  const acceptHeader = request.headers.get('Accept') || '';
  const useStreaming = acceptHeader.includes('text/event-stream');

  if (useStreaming) {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const sendEvent = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        sendEvent('start', { recommendationId, feature: 'operational_summary' });

        for await (const chunk of geminiStream) {
          sendEvent('chunk', { text: chunk.text() });
        }

        sendEvent('complete', { confidence, tokensUsed, latencyMs });
        sendEvent('end', {});
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  // Non-streaming path (buffered)
  const result = await generateOperationalSummary(matchId);
  return NextResponse.json(wrapSuccess(result));
}
```

---

## 34. Observability

### 34.1 Correlation IDs

Every request receives a unique `X-Request-ID` header. This ID propagates through:

- Middleware injection (or passthrough if client-provided)
- Response header
- Database `ai_call_logs.request_id` column (links AI call to HTTP request)
- Application logs
- Error responses

```typescript
// Client best practice: include X-Request-ID for client-initiated tracing
const response = await fetch('/api/v1/ai/operational-summary', {
  headers: {
    Authorization: `Bearer ${token}`,
    'X-Request-ID': crypto.randomUUID(), // Trace from client
  },
});
const requestId = response.headers.get('X-Request-ID');
// Store requestId for support reporting
```

### 34.2 Structured Request Logging

```typescript
// Logged on every request completion:
type RequestLog = {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  userId: string | null;
  stadiumId: string | null;
  userRole: string | null;
  userAgent: string;
  ip: string;
  responseSize: number; // bytes
  cached: boolean;
  timestamp: string; // ISO 8601 UTC
};
```

### 34.3 AI-Specific Tracing

```typescript
// Every AI call links the HTTP request to the DB log:
await supabase.from('ai_call_logs').insert({
  recommendation_id: recommendation.id,
  feature_name: featureName,
  model_name: 'gemini-2.0-flash',
  prompt_version: promptVersion,
  latency_ms: Date.now() - startTime,
  prompt_tokens: usage.promptTokenCount,
  output_tokens: usage.candidatesTokenCount,
  success: !error,
  error_code: error?.code ?? null,
  // request_id stored in metadata for cross-system tracing:
  // metadata: { request_id: requestId }
});
```

### 34.4 Key Metrics to Monitor

| Metric                   | Collection    | Alert Threshold                       |
| ------------------------ | ------------- | ------------------------------------- |
| Request error rate       | Request logs  | >1% errors/min                        |
| P99 latency (non-AI)     | Request logs  | >500ms                                |
| P99 AI latency           | ai_call_logs  | >10,000ms                             |
| AI success rate          | ai_call_logs  | <95% success                          |
| Rate limit violations    | rate_limits   | >50 violations/min                    |
| Authentication failures  | Supabase Auth | >20 failures/min                      |
| WebSocket disconnections | Realtime      | >10 disconnects/min                   |
| Crowd data insertion lag | crowd_data    | >60s since last insert (match active) |

---

## 35. API Versioning

### 35.1 Versioning Strategy

```
URI Versioning: /api/v1/
- Version is in the URL path segment (not a query param or header)
- Simple, explicit, predictable routing
- CDN and load balancer friendly
```

### 35.2 Version Lifecycle

```
v1 (current) — Active
v2 (future)  — Planned when breaking changes required

Versioning policy:
  • Additive changes (new fields, new endpoints) are backward-compatible — no new version
  • Breaking changes (removed fields, changed response shape, auth changes) require a new version
  • v1 will be maintained for minimum 12 months after v2 GA
  • Deprecation warning via response headers (3 months before sunset):
    Deprecation: true
    Sunset: Sat, 12 Jul 2027 00:00:00 GMT
    Link: <https://arenamind.ai/api/v2>; rel="successor-version"
```

### 35.3 What Counts as Breaking

**Breaking (requires new version):**

- Removing or renaming a response field
- Changing a field's data type
- Removing or renaming an endpoint
- Changing authentication mechanism
- Making a previously optional field required

**Non-breaking (no version change):**

- Adding new response fields
- Adding new optional request fields
- Adding new endpoints
- Adding new enum values (clients must handle unknown values)
- Performance improvements
- Bug fixes that match documented behavior

---

## 36. Testing Strategy

### 36.1 Unit Tests

```typescript
// Zod schema validation unit tests
describe('createIncidentSchema', () => {
  it('rejects missing title', () => {
    const result = createIncidentSchema.safeParse({ description: 'test', severityTier: 1 });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.title).toBeDefined();
  });

  it('rejects invalid severity tier', () => {
    const result = createIncidentSchema.safeParse({
      title: 'Test',
      description: 'test desc 10 chars',
      severityTier: 5,
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid incident', () => {
    const result = createIncidentSchema.safeParse({
      title: 'Medical Emergency',
      description: 'Fan collapsed near Gate 3',
      severityTier: 1,
    });
    expect(result.success).toBe(true);
  });
});
```

### 36.2 Integration Tests (RLS Verification)

```typescript
// Test: Cross-stadium access prevention
describe('Incident RLS', () => {
  it('returns only own-stadium incidents', async () => {
    const stadiumAUser = await loginAsUser('stadium-a-coordinator');
    const response = await fetch('/api/v1/matches/stadium-b-match/incidents', {
      headers: { Authorization: `Bearer ${stadiumAUser.accessToken}` },
    });
    // Should return 404 (match not found — RLS prevents seeing other stadium's matches)
    expect(response.status).toBe(404);
  });

  it('allows OM to accept AI recommendation', async () => {
    const om = await loginAsUser('operations-manager');
    const response = await fetch(`/api/v1/ai/recommendations/${recoId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${om.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accepted' }),
    });
    expect(response.status).toBe(200);
  });

  it('prevents coordinator from accepting AI recommendation', async () => {
    const coord = await loginAsUser('coordinator');
    const response = await fetch(`/api/v1/ai/recommendations/${recoId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${coord.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accepted' }),
    });
    expect(response.status).toBe(403);
  });
});
```

### 36.3 Contract Tests

```typescript
// Validate live API responses against OpenAPI schema
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import spec from '../openapi.json';

const ajv = new Ajv();
addFormats(ajv);

const validate = ajv.compile(spec.components.schemas.Incident);

it('incident response matches OpenAPI schema', async () => {
  const response = await fetch(`/api/v1/matches/${matchId}/incidents/${incidentId}`);
  const json = await response.json();
  const valid = validate(json.data);
  if (!valid) console.error(validate.errors);
  expect(valid).toBe(true);
});
```

### 36.4 Load Tests (k6)

```javascript
// k6 load test: Dashboard load simulation
// Simulates 50 concurrent users during match day

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50, // 50 virtual users
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(99)<500'], // P99 < 500ms
    http_req_failed: ['rate<0.01'], // <1% failure rate
  },
};

export default function () {
  const matchId = 'test-match-uuid';
  const headers = { Authorization: `Bearer ${__ENV.TEST_TOKEN}` };

  // Simulate dashboard load sequence
  http.get(`/api/v1/matches/${matchId}/crowd/current`, { headers }); // Heatmap
  http.get(`/api/v1/matches/${matchId}/incidents?limit=25`, { headers }); // Incident list
  http.get(`/api/v1/matches/${matchId}/kpis`, { headers }); // KPI strip
  http.get(`/api/v1/matches/${matchId}/health-score`, { headers }); // Health gauge

  sleep(3); // 3-second think time (users spend time reading)
}
```

### 36.5 WebSocket Tests

```typescript
// Test WebSocket subscription and event delivery
describe('Realtime: Incident channel', () => {
  it('receives incident INSERT event', async () => {
    const eventPromise = new Promise((resolve) => {
      const channel = supabase
        .channel(`incidents-${matchId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', table: 'incidents', filter: `match_id=eq.${matchId}` },
          (payload) => resolve(payload.new)
        )
        .subscribe();
    });

    // Create an incident via API
    await createTestIncident(matchId);

    // Assert event was received within 2 seconds
    const event = await Promise.race([eventPromise, timeout(2000)]);
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('severity_tier');
  });
});
```

---

## Appendix A: Complete Endpoint Reference

| #   | Method | Path                                        | Auth     | Roles         | Purpose                   |
| --- | ------ | ------------------------------------------- | -------- | ------------- | ------------------------- |
| 1   | POST   | `/auth/login`                               | None     | All           | Login                     |
| 2   | POST   | `/auth/logout`                              | Required | All           | Logout                    |
| 3   | POST   | `/auth/refresh`                             | None     | All           | Refresh JWT               |
| 4   | POST   | `/auth/forgot-password`                     | None     | All           | Password reset request    |
| 5   | POST   | `/auth/reset-password`                      | None     | All           | Set new password          |
| 6   | GET    | `/users/me`                                 | Required | All           | Get own profile           |
| 7   | PATCH  | `/users/me`                                 | Required | All           | Update own profile        |
| 8   | GET    | `/users`                                    | Required | OM, DM        | List stadium users        |
| 9   | GET    | `/users/:id`                                | Required | OM            | Get user profile          |
| 10  | PATCH  | `/users/:id`                                | Required | OM            | Update user               |
| 11  | GET    | `/stadiums`                                 | Required | All           | List stadiums             |
| 12  | GET    | `/stadiums/:id`                             | Required | All           | Stadium detail            |
| 13  | GET    | `/stadiums/:id/zones`                       | Required | All           | Stadium zones             |
| 14  | GET    | `/matches`                                  | Required | All           | List matches              |
| 15  | GET    | `/matches/active`                           | Required | All           | Active match              |
| 16  | GET    | `/matches/:id`                              | Required | All           | Match detail              |
| 17  | PATCH  | `/matches/:id/phase`                        | Required | OM            | Phase transition          |
| 18  | GET    | `/matches/:id/summary`                      | Required | All           | Match summary             |
| 19  | GET    | `/zones/:id`                                | Required | All           | Zone detail               |
| 20  | PATCH  | `/zones/:id`                                | Required | OM            | Update zone               |
| 21  | GET    | `/matches/:id/crowd/current`                | Required | All           | Live heatmap data         |
| 22  | GET    | `/matches/:id/crowd/trends`                 | Required | All           | Crowd trends chart        |
| 23  | GET    | `/matches/:id/crowd/zones/:zoneId`          | Required | All           | Zone crowd detail         |
| 24  | GET    | `/matches/:id/crowd/predictions`            | Required | All           | AI predictions            |
| 25  | POST   | `/matches/:id/crowd/data`                   | Service  | Service       | Insert crowd data         |
| 26  | GET    | `/matches/:id/queue`                        | Required | All           | Queue lengths             |
| 27  | GET    | `/matches/:id/incidents`                    | Required | All           | List incidents            |
| 28  | POST   | `/matches/:id/incidents`                    | Required | OM,DM,Coord   | Create incident           |
| 29  | GET    | `/matches/:id/incidents/:incId`             | Required | All           | Incident detail           |
| 30  | PATCH  | `/matches/:id/incidents/:incId`             | Required | OM,DM,Coord   | Update incident           |
| 31  | DELETE | `/matches/:id/incidents/:incId`             | Required | OM,DM         | Soft delete incident      |
| 32  | GET    | `/matches/:id/incidents/:incId/actions`     | Required | All           | Incident timeline         |
| 33  | POST   | `/matches/:id/incidents/:incId/actions`     | Required | OM,DM,Coord   | Add action note           |
| 34  | GET    | `/matches/:id/incidents/:incId/attachments` | Required | All           | Incident attachments      |
| 35  | POST   | `/matches/:id/incidents/:incId/attachments` | Required | OM,DM,Coord   | Upload attachment         |
| 36  | GET    | `/matches/:id/resources`                    | Required | All           | List resources            |
| 37  | POST   | `/matches/:id/resources`                    | Required | OM,DM,Coord   | Create resource           |
| 38  | GET    | `/matches/:id/resources/:resId`             | Required | All           | Resource detail           |
| 39  | PATCH  | `/matches/:id/resources/:resId`             | Required | OM,DM,Coord   | Update resource           |
| 40  | DELETE | `/matches/:id/resources/:resId`             | Required | OM,DM         | Delete resource           |
| 41  | POST   | `/matches/:id/resources/:resId/assign`      | Required | OM,DM,Coord   | Assign to incident        |
| 42  | POST   | `/matches/:id/resources/:resId/release`     | Required | OM,DM,Coord   | Release from incident     |
| 43  | GET    | `/matches/:id/accessibility`                | Required | All           | Accessibility requests    |
| 44  | POST   | `/matches/:id/accessibility`                | Required | OM,DM,Coord   | Create request            |
| 45  | PATCH  | `/matches/:id/accessibility/:reqId`         | Required | OM,DM,Coord   | Update request            |
| 46  | GET    | `/matches/:id/alerts`                       | Required | All           | List alerts               |
| 47  | PATCH  | `/matches/:id/alerts/:alertId`              | Required | OM,DM         | Acknowledge/resolve alert |
| 48  | GET    | `/notifications`                            | Required | All           | User notifications        |
| 49  | PATCH  | `/notifications/:id`                        | Required | All           | Mark read                 |
| 50  | POST   | `/notifications/read-all`                   | Required | All           | Mark all read             |
| 51  | GET    | `/matches/:id/weather`                      | Required | All           | Weather data              |
| 52  | POST   | `/matches/:id/weather`                      | Required | OM, Service   | Insert weather            |
| 53  | POST   | `/ai/operational-summary`                   | Required | OM,DM         | AI summary                |
| 54  | POST   | `/ai/incident-classify`                     | Required | OM,DM,Service | AI classify               |
| 55  | POST   | `/ai/incident-recommend`                    | Required | OM,DM         | AI recommend              |
| 56  | POST   | `/ai/crowd-recommendations`                 | Required | OM,DM         | AI crowd reco             |
| 57  | POST   | `/ai/executive-summary`                     | Required | OM            | AI exec summary           |
| 58  | POST   | `/ai/shift-handover`                        | Required | OM,DM         | AI handover               |
| 59  | GET    | `/matches/:id/ai/recommendations`           | Required | All           | List recommendations      |
| 60  | PATCH  | `/ai/recommendations/:id`                   | Required | OM,DM         | Accept/dismiss            |
| 61  | POST   | `/ai/recommendations/:id/feedback`          | Required | OM,DM         | AI feedback               |
| 62  | GET    | `/ai/metrics`                               | Required | OM            | AI performance metrics    |
| 63  | GET    | `/matches/:id/analytics`                    | Required | All           | Match analytics           |
| 64  | GET    | `/matches/:id/kpis`                         | Required | All           | KPI snapshot              |
| 65  | GET    | `/matches/:id/health-score`                 | Required | All           | Health score              |
| 66  | GET    | `/matches/:id/phase-timeline`               | Required | All           | Phase history             |
| 67  | GET    | `/matches/:id/reports`                      | Required | All           | List reports              |
| 68  | POST   | `/matches/:id/reports/generate`             | Required | OM,DM         | Generate report           |
| 69  | GET    | `/matches/:id/reports/:rptId`               | Required | All           | Report detail             |
| 70  | POST   | `/matches/:id/reports/:rptId/export`        | Required | OM,DM         | Export PDF                |
| 71  | GET    | `.../exports/:expId/download`               | Required | OM,DM         | Download signed URL       |
| 72  | POST   | `/files/upload`                             | Required | OM,DM,Coord   | Upload file               |
| 73  | GET    | `/files/:id`                                | Required | All           | File metadata             |
| 74  | DELETE | `/files/:id`                                | Required | OM,DM         | Soft delete file          |
| 75  | POST   | `/files/:id/signed-url`                     | Required | All           | Generate download URL     |
| 76  | GET    | `/search`                                   | Required | All           | Global search             |
| 77  | GET    | `/settings`                                 | Required | All           | Stadium settings          |
| 78  | PATCH  | `/settings/:key`                            | Required | OM            | Update setting            |
| 79  | GET    | `/feature-flags`                            | Required | All           | Feature flags             |
| 80  | PATCH  | `/feature-flags/:flag`                      | Required | OM            | Toggle feature            |
| 81  | GET    | `/admin/audit-logs`                         | Required | OM            | Audit log query           |
| 82  | GET    | `/admin/ai-metrics`                         | Required | OM            | AI admin metrics          |
| 83  | GET    | `/admin/users`                              | Required | OM            | Admin user list           |
| 84  | GET    | `/health`                                   | None     | All           | System health             |
| 85  | GET    | `/health/ai`                                | None     | All           | AI subsystem health       |
| 86  | GET    | `/health/db`                                | Required | OM            | Database health           |

---

_Document End_

---

> **ArenaMind AI** — API Specification Document  
> _Version 1.0.0 | July 12, 2026_  
> _API Contract — The definitive API reference for ArenaMind AI._  
> _Derived from: PRD v1.0.0 + TRD v1.0.0 + SAD v1.0.0 + Design Brief v1.0.0 + DDD v1.0.0_  
> _This document is the single source of truth for all API design decisions._
