# Project Structure

This document describes the directory layout and responsibilities of each major area of the ArenaMind codebase.

## Root

```
arenamind-ai/
├── src/                        # Application source code
├── prisma/                     # Database schema, migrations, seed
├── tests/                      # Unit, integration, and E2E tests
├── docs/                       # Internal documentation and audits
├── scripts/                    # Build and deployment scripts
├── public/                     # Static assets
├── .github/                    # GitHub Actions workflows and templates
├── k6/                         # Load testing scripts
├── Dockerfile                  # Production container definition
├── Dockerfile.dev              # Development container definition
├── docker-compose.yml          # Development services (app + db + redis)
├── docker-compose.prod.yml     # Production services
└── vercel.json                 # Vercel deployment configuration
```

---

## `src/`

### `src/app/`

Next.js App Router directory. Contains all pages, layouts, API routes, and module-specific components.

| Directory     | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `(auth)/`     | Authentication pages (login, register). Wrapped in an auth-specific layout. |
| `api/`        | API route handlers for server-side operations.                              |
| `components/` | Module-specific UI components, organized by domain.                         |
| `dashboard/`  | Dashboard route pages for each operational module.                          |
| `hooks/`      | Page-level React hooks.                                                     |
| `types/`      | Page-level TypeScript type definitions.                                     |

### `src/app/components/`

Each subdirectory represents a self-contained operational module.

| Module            | Description                                                                       |
| ----------------- | --------------------------------------------------------------------------------- |
| `camera/`         | Camera vision network — PTZ management, sweep animations, field-of-view rendering |
| `crowd/`          | Crowd intelligence — density heatmaps, gate occupancy, flow analysis              |
| `dashboard/`      | Operations dashboard — shell layout, copilot panel, widgets, digital twin         |
| `demo/`           | Executive Demo Panel — scenario controller for hackathon demonstrations           |
| `governance/`     | Governance & compliance — audit logs, RBAC policies, regulatory tracking          |
| `incidents/`      | Incident command — lifecycle management, AI recommendations, phase tracking       |
| `infrastructure/` | Infrastructure monitoring — topology engine, health metrics, service status       |
| `intelligence/`   | Intelligence center — knowledge graph visualization, cross-module correlation     |
| `landing/`        | Landing page — public-facing entry point                                          |
| `layout/`         | Shared layout components — sidebar, navigation, responsive containers             |
| `map/`            | Spatial digital twin — map layers (crowd, camera, sensor, vehicle, incident)      |
| `mobility/`       | Mobility & transport — parking, transit, traffic visualization                    |
| `motion/`         | Shared motion components — page transitions, animation utilities                  |
| `startup/`        | Application startup — initialization, loading states                              |
| `ui/`             | Reusable UI primitives — buttons, cards, inputs, modals                           |
| `workforce/`      | Workforce management — deployment visualization, department tracking              |

### `src/app/dashboard/`

Dashboard route pages organized by module. Each directory contains a `page.tsx` that renders the corresponding module.

| Route                       | Module                      |
| --------------------------- | --------------------------- |
| `/dashboard`                | Operations dashboard (home) |
| `/dashboard/cameras`        | Camera vision network       |
| `/dashboard/crowd`          | Crowd intelligence          |
| `/dashboard/governance`     | Governance & compliance     |
| `/dashboard/incidents`      | Incident command            |
| `/dashboard/infrastructure` | Infrastructure monitoring   |
| `/dashboard/intelligence`   | Intelligence center         |
| `/dashboard/map`            | Spatial digital twin        |
| `/dashboard/mobility`       | Mobility & transport        |
| `/dashboard/workforce`      | Workforce management        |

---

### `src/components/`

Global shared components and providers used across the application.

| File / Directory | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `providers.tsx`  | Root provider composition (SessionProvider, QueryClient, AuthProvider, ExecutiveDemoPanel) |
| `providers/`     | Individual provider components (auth-provider)                                             |

---

### `src/lib/`

Core libraries, services, and shared logic.

| Directory         | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| `ai/`             | AI client configuration (Google Gemini)                                            |
| `api/`            | API utilities and helpers                                                          |
| `api-client/`     | Typed API client for server communication                                          |
| `auth/`           | Authentication utilities and session helpers                                       |
| `contexts/`       | React Context definitions for shared state                                         |
| `db/`             | Database client configuration (Prisma, connection pooling)                         |
| `demo/`           | Demo state management — `DemoState.ts`, `DemoScenarioEngine.ts`, `useDemoState.ts` |
| `domain/`         | Domain models and business entities                                                |
| `enterprise/`     | Enterprise-grade services (see below)                                              |
| `errors/`         | Error handling utilities and custom error classes                                  |
| `hooks/`          | Shared React hooks (`useLiveTelemetry`, `useCopilotState`)                         |
| `infrastructure/` | Infrastructure services (configuration, health, logging)                           |
| `integrations/`   | Third-party integrations                                                           |
| `modules/`        | Module-specific business logic                                                     |
| `observability/`  | OpenTelemetry instrumentation and metrics                                          |
| `platform/`       | Platform-level services                                                            |
| `repositories/`   | Data access layer (repository pattern)                                             |
| `services/`       | Application services                                                               |
| `supabase/`       | Supabase client configuration                                                      |
| `utils/`          | General-purpose utility functions                                                  |
| `validation/`     | Zod validation schemas                                                             |

### `src/lib/enterprise/ai/`

The enterprise AI engine. This is the core of ArenaMind's intelligence layer.

| File / Directory                 | Description                                                            |
| -------------------------------- | ---------------------------------------------------------------------- |
| `gateway.service.ts`             | Central AI Gateway — request routing, orchestration, response pipeline |
| `provider-manager.ts`            | Multi-provider management with health monitoring and failover          |
| `provider-health.service.ts`     | Provider health checks and availability tracking                       |
| `hallucination-guard.service.ts` | Post-inference validation against known facts                          |
| `decision-engine.service.ts`     | Risk-scored recommendation generation                                  |
| `context-builder.service.ts`     | Module-aware context assembly for prompts                              |
| `prompt-registry.service.ts`     | Versioned prompt templates with variable interpolation                 |
| `operational-memory.service.ts`  | Persistent storage of decisions and learned patterns                   |
| `confidence-scoring.service.ts`  | Confidence interval calculation for recommendations                    |
| `content-safety.service.ts`      | Prompt injection detection and PII filtering                           |
| `explainability.service.ts`      | Reasoning chain generation for transparency                            |
| `rate-limit.service.ts`          | Token bucket rate limiting for AI requests                             |
| `token-budget.service.ts`        | Token usage tracking and budget enforcement                            |
| `cost-manager.service.ts`        | AI inference cost tracking and optimization                            |
| `streaming.service.ts`           | Server-Sent Events streaming for AI responses                          |
| `multi-agent/`                   | Multi-agent swarm system (see below)                                   |

### `src/lib/enterprise/ai/multi-agent/`

| File / Directory                           | Description                                                            |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `orchestrator.service.ts`                  | Swarm orchestrator — task decomposition, agent coordination, consensus |
| `agents/supervisor.agent.ts`               | Supervisor agent — delegates to domain agents, aggregates results      |
| `agents/crowd.agent.ts`                    | Crowd analysis specialist agent                                        |
| `agents/security.agent.ts`                 | Security threat assessment agent                                       |
| `agents/incident.agent.ts`                 | Incident response coordination agent                                   |
| `agents/mobility.agent.ts`                 | Transport and traffic optimization agent                               |
| `agents/camera.agent.ts`                   | Camera network intelligence agent                                      |
| `agents/workforce.agent.ts`                | Workforce deployment optimization agent                                |
| `agents/infrastructure.agent.ts`           | Infrastructure health assessment agent                                 |
| `agents/governance.agent.ts`               | Compliance and audit agent                                             |
| `agents/weather.agent.ts`                  | Weather impact assessment agent                                        |
| `agents/executive.agent.ts`                | Executive summary generation agent                                     |
| `knowledge/knowledge-graph.service.ts`     | Entity-relationship knowledge store                                    |
| `knowledge/entity-resolution.service.ts`   | Entity disambiguation and linking                                      |
| `knowledge/knowledge-retrieval.service.ts` | Context-aware knowledge retrieval                                      |

---

### `src/server/`

Server-side logic that runs exclusively on the backend.

| Directory     | Description                                             |
| ------------- | ------------------------------------------------------- |
| `auth/`       | Server-side authentication logic and session management |
| `audit/`      | Audit logging services                                  |
| `database/`   | Database connection management and utilities            |
| `middleware/` | Security middleware (rate limiting, CORS, headers)      |
| `services/`   | Server-side business logic services                     |
| `storage/`    | File and asset storage services                         |
| `validators/` | Server-side input validation                            |

---

## `prisma/`

| File            | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `schema.prisma` | Complete database schema — all models, relations, enums, and indexes |
| `seed.ts`       | Database seed script for development and testing                     |
| `migrations/`   | Version-controlled database migrations                               |

---

## `tests/`

| Directory      | Description                   |
| -------------- | ----------------------------- |
| `unit/`        | Unit tests (Vitest)           |
| `integration/` | Integration tests (Vitest)    |
| `e2e/`         | End-to-end tests (Playwright) |

---

## `.github/`

| File / Directory           | Description                                                     |
| -------------------------- | --------------------------------------------------------------- |
| `workflows/`               | GitHub Actions CI/CD pipeline definitions                       |
| `ISSUE_TEMPLATE/`          | Structured issue templates for bug reports and feature requests |
| `PULL_REQUEST_TEMPLATE.md` | Pull request checklist template                                 |
| `CODEOWNERS`               | Code ownership definitions for review routing                   |
| `labels.yml`               | Repository label definitions                                    |

---

## `docs/`

Internal documentation including production audits, architecture references, and certification reports.

---

## `scripts/`

Build, deployment, and maintenance scripts used by CI/CD pipelines and local development.
