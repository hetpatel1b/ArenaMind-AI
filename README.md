<div align="center">

# ArenaMind AI

### The Intelligent Venue Operations Copilot

**Real-time AI-powered command and control for large-scale venue operations.**

[![Version](https://img.shields.io/badge/version-1.0.0-00ffcc?style=for-the-badge)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Apache_2.0-blue?style=for-the-badge)](./LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](./.github/workflows)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](./Dockerfile)
[![Status](https://img.shields.io/badge/status-Production_Ready-00ffcc?style=for-the-badge)](<>)

---

_A Fortune-100 grade digital twin and AI copilot platform that transforms stadium operations into an intelligent, autonomous command center — coordinating crowd flow, incident response, workforce deployment, and infrastructure monitoring through a unified AI-driven interface._

</div>

---

## Table of Contents

- [Introduction](#introduction)
- [Executive Overview](#executive-overview)
- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [AI Architecture](#ai-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Demo Scenarios](#demo-scenarios)
- [Performance](#performance)
- [Security](#security)
- [Production Readiness](#production-readiness)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Introduction

**ArenaMind** is an enterprise AI platform that provides real-time operational intelligence for large-scale venue management. It combines a multi-module command dashboard, a spatial digital twin, and an AI copilot system to give operators a unified view of crowd dynamics, incident response, workforce coordination, and infrastructure health — all in a single interface.

### The Problem

Managing a 75,000-seat stadium during a live event requires coordinating dozens of independent systems — crowd sensors, CCTV networks, medical dispatch, traffic control, weather monitoring, and more. Operators currently rely on fragmented tools, manual radio communication, and reactive decision-making.

### The Solution

ArenaMind replaces fragmented operations with a single intelligent command surface. Every data stream — crowd density, camera feeds, incident reports, workforce positions, infrastructure telemetry — flows into one platform where an AI copilot continuously analyzes, reasons, and recommends actions in real time.

### Who It's For

- **Stadium & venue operators** managing large-scale events
- **Security operations centers** requiring real-time situational awareness
- **Emergency management teams** coordinating multi-department responses
- **Enterprise organizations** evaluating AI-driven operational intelligence
- **Media & Broadcast teams** managing live feeds, compounds, and press areas
- **Hospitality & VIP teams** overseeing premium fan experiences

---

## Executive Overview

ArenaMind is structured as a modular enterprise platform where each operational domain — crowd intelligence, incident command, camera vision, mobility, workforce, governance, and infrastructure — operates as an independent module with its own data pipeline, visualization layer, and AI copilot context.

A centralized AI Gateway routes requests through a multi-provider architecture with automatic failover, hallucination detection, and explainable reasoning. A Supervisor Agent coordinates specialized domain agents (crowd, security, medical, mobility) through a swarm orchestration pattern, producing consensus-driven recommendations that require human approval before execution.

The platform is designed for production deployment with Docker containerization, CI/CD pipelines, health monitoring, structured logging, and RBAC-based access control.

---

## Key Features

### 🎛️ Operations Dashboard

Real-time command surface with live telemetry, KPI monitoring, and operational status across all venue systems. GPU-accelerated rendering at 60 FPS.

### 👥 Crowd Intelligence

Heatmap visualization, density prediction, gate-level occupancy monitoring, and AI-driven crowd flow optimization with proactive surge alerts.

### 🚨 Incident Command

Full incident lifecycle management — detection, verification, AI analysis, resource assignment, containment, and resolution — with real-time phase tracking.

### 🚗 Mobility & Transport

Parking occupancy, public transit integration, traffic congestion monitoring, and intelligent rerouting recommendations.

### 🧠 Intelligence Center

AI reasoning visualization, knowledge graph exploration, cross-module correlation analysis, and operational memory retrieval.

### 📷 Camera Vision Network

PTZ camera management with animated field-of-view cones, sweep patterns, and automatic incident-triggered tracking override.

### 👷 Workforce Management

Real-time workforce positioning, fatigue monitoring, department-level deployment visualization, and AI-optimized dispatch.

### 📋 Governance & Compliance

SOC2, ISO 27001, and GDPR compliance tracking, audit logging, RBAC policy enforcement, and regulatory reporting.

### 🏗️ Infrastructure Monitoring

Live topology visualization of servers, pods, and databases with CPU, memory, latency, and API health metrics.

### 🎥 Broadcast & Media Operations

Real-time signal health monitoring, fiber route auto-failover, press zone capacity tracking, and broadcast compound management.

### 🥂 Hospitality & VIP Management

Premium lounge occupancy tracking, personalized concierge AI recommendations, luxury transport routing, and VIP surge detection.

### 🤖 Enterprise AI Copilot

Context-aware AI assistant with explainable reasoning, decision tree visualization, approval workflows, and confidence scoring.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                     │
│  Next.js 16 App Router · React 19 · Framer Motion      │
│  Canvas Layers · SVG Overlays · Recharts               │
├─────────────────────────────────────────────────────────┤
│                    API Layer                            │
│  Next.js Route Handlers · Server Actions               │
│  Security Middleware · Rate Limiting · CORS             │
├──────────────────┬──────────────────────────────────────┤
│   Data Layer     │          AI Layer                    │
│  Prisma 7 ORM   │  AI Gateway · Provider Manager       │
│  PostgreSQL 16   │  Supervisor Agent · Swarm            │
│  Redis Cache     │  Knowledge Graph · Prompt Registry   │
│  Supabase        │  Hallucination Guard · Memory        │
├──────────────────┴──────────────────────────────────────┤
│                 Infrastructure                          │
│  Docker · GitHub Actions CI/CD · Health Checks          │
│  Structured Logging · OpenTelemetry                     │
└─────────────────────────────────────────────────────────┘
```

| Layer             | Technology                          | Responsibility                                               |
| ----------------- | ----------------------------------- | ------------------------------------------------------------ |
| **Frontend**      | Next.js 16, React 19, Framer Motion | App routing, SSR, component rendering, animations            |
| **Visualization** | HTML Canvas, SVG, Recharts          | Crowd heatmaps, camera cones, resource dots, topology graphs |
| **State**         | Zustand, React Query, Context API   | Client state, server state caching, module-scoped state      |
| **API**           | Next.js Route Handlers              | RESTful endpoints, server actions, middleware chain          |
| **Database**      | PostgreSQL 16, Prisma 7             | Relational data, migrations, type-safe queries               |
| **Cache**         | Redis (ioredis)                     | Session cache, rate limiting, AI response cache              |
| **AI**            | Google Gemini, Multi-Provider       | LLM inference, reasoning, recommendations                    |
| **Auth**          | NextAuth.js v5                      | Session management, OAuth, RBAC                              |
| **Infra**         | Docker, GitHub Actions              | Containerization, CI/CD, automated testing                   |

---

## AI Architecture

ArenaMind's AI system is a production-grade multi-agent architecture designed for enterprise reliability.

```
┌───────────────────────────────────────────┐
│              AI Gateway                   │
│  Request routing · Rate limiting          │
│  Token budgeting · Cost management        │
├───────────────┬───────────────────────────┤
│ Provider      │ Hallucination Guard       │
│ Manager       │ Response Validation       │
│ Health Checks │ Confidence Scoring        │
│ Auto-Failover │ Content Safety            │
├───────────────┴───────────────────────────┤
│           Supervisor Agent                │
│  Swarm Orchestration · Task Decomposition │
│  Consensus Engine · Agent Coordination    │
├───────────────────────────────────────────┤
│           Specialized Agents              │
│  Crowd · Security · Medical · Mobility    │
│  Camera · Workforce · Infrastructure      │
│  Governance · Weather · Executive         │
│  Media · Broadcast · Hospitality          │
├───────────────────────────────────────────┤
│           Knowledge Layer                 │
│  Knowledge Graph · Entity Resolution      │
│  Operational Memory · Context Builder     │
│  Prompt Registry · Conversation History   │
└───────────────────────────────────────────┘
```

<details>
<summary><strong>AI Component Details</strong></summary>

| Component                  | Description                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| **AI Gateway**             | Central entry point for all AI requests with routing, rate limiting, and token budget enforcement |
| **Provider Manager**       | Multi-provider architecture with health monitoring and automatic failover between AI providers    |
| **Supervisor Agent**       | Orchestrates specialized domain agents using a swarm pattern for complex multi-domain scenarios   |
| **Knowledge Graph**        | Entity-relationship store for venue topology, historical incidents, and operational patterns      |
| **Operational Memory**     | Persistent memory of past decisions, outcomes, and learned operational patterns                   |
| **Context Builder**        | Assembles relevant context from multiple modules into structured prompts for each agent           |
| **Prompt Registry**        | Versioned, domain-specific prompt templates with variable interpolation                           |
| **Hallucination Guard**    | Post-inference validation layer that verifies AI outputs against known facts and constraints      |
| **Decision Engine**        | Risk-scored recommendation generator with confidence intervals and alternative strategies         |
| **Consensus Engine**       | Aggregates outputs from multiple agents into unified recommendations with conflict resolution     |
| **Explainability Service** | Generates human-readable reasoning chains showing which signals influenced each recommendation    |
| **Content Safety**         | Input/output filtering for prompt injection, PII exposure, and adversarial inputs                 |

</details>

---

## Technology Stack

<table>
<tr><td><strong>Category</strong></td><td><strong>Technologies</strong></td></tr>
<tr><td>Frontend</td><td>Next.js 16 · React 19 · TypeScript 5 · Framer Motion · Recharts · Zustand</td></tr>
<tr><td>Backend</td><td>Next.js Route Handlers · Server Actions · Zod Validation</td></tr>
<tr><td>Database</td><td>PostgreSQL 16 · Prisma 7 ORM · Supabase</td></tr>
<tr><td>Cache</td><td>Redis (ioredis)</td></tr>
<tr><td>AI</td><td>Google Gemini · Multi-Provider Gateway · Multi-Agent Swarm</td></tr>
<tr><td>Auth</td><td>NextAuth.js v5 · bcrypt · RBAC</td></tr>
<tr><td>Testing</td><td>Vitest · Playwright · Testing Library · axe-core</td></tr>
<tr><td>DevOps</td><td>Docker · Docker Compose · GitHub Actions CI/CD</td></tr>
<tr><td>Code Quality</td><td>ESLint 9 · Prettier · Husky · lint-staged · Commitlint</td></tr>
<tr><td>Observability</td><td>OpenTelemetry · Structured Logging · Health Endpoints</td></tr>
</table>

---

## Project Structure

> For the complete directory reference, see [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md).

```
arenamind-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication pages
│   │   ├── api/                # API route handlers
│   │   ├── components/         # Module-specific components
│   │   │   ├── camera/         # Camera vision module
│   │   │   ├── crowd/          # Crowd intelligence module
│   │   │   ├── dashboard/      # Operations dashboard
│   │   │   ├── demo/           # Executive demo panel
│   │   │   ├── governance/     # Governance & compliance
│   │   │   ├── incidents/      # Incident command module
│   │   │   ├── infrastructure/ # Infrastructure monitoring
│   │   │   ├── intelligence/   # AI intelligence center
│   │   │   ├── map/            # Spatial digital twin
│   │   │   ├── mobility/       # Mobility & transport
│   │   │   └── workforce/      # Workforce management
│   │   └── dashboard/          # Dashboard route pages
│   ├── components/             # Global shared components
│   ├── lib/                    # Core libraries
│   │   ├── media/              # Media Operations Domain
│   │   ├── broadcast/          # Broadcast Operations Domain
│   │   ├── hospitality/        # Hospitality & VIP Domain
│   │   ├── enterprise/ai/      # Enterprise AI engine
│   │   ├── demo/               # Demo scenario engine
│   │   ├── hooks/              # Shared React hooks
│   │   └── services/           # Business logic services
│   ├── server/                 # Server-side logic
│   │   ├── auth/               # Authentication services
│   │   ├── middleware/         # Security middleware
│   │   └── database/           # Database utilities
│   └── types/                  # TypeScript type definitions
├── prisma/                     # Database schema & migrations
├── tests/                      # Test suites
├── docs/                       # Documentation
├── scripts/                    # Build & deployment scripts
├── .github/                    # GitHub Actions & templates
├── Dockerfile                  # Production container
└── docker-compose.yml          # Development environment
```

---

## Getting Started

### Prerequisites

| Requirement | Version         |
| ----------- | --------------- |
| Node.js     | ≥ 22            |
| pnpm        | ≥ 10            |
| PostgreSQL  | ≥ 16            |
| Redis       | ≥ 7             |
| Docker      | ≥ 24 (optional) |

### Installation

```bash
# Clone the repository
git clone https://github.com/hetpatel1b/ArenaMind-AI.git
cd ArenaMind-AI

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials, API keys, etc.

# Set up the database
pnpm db:migrate

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Docker Quickstart

```bash
# Start all services (app + PostgreSQL + Redis)
docker compose up -d

# Production build
docker compose -f docker-compose.prod.yml up -d
```

### Available Commands

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start development server       |
| `pnpm build`      | Create production build        |
| `pnpm start`      | Start production server        |
| `pnpm lint`       | Run ESLint                     |
| `pnpm typecheck`  | Run TypeScript compiler checks |
| `pnpm test`       | Run unit tests                 |
| `pnpm test:e2e`   | Run end-to-end tests           |
| `pnpm format`     | Format code with Prettier      |
| `pnpm db:migrate` | Apply database migrations      |
| `pnpm analyze`    | Analyze bundle size            |

---

## Environment Variables

Create a `.env` file based on `.env.example`. The following variables are required:

| Variable            | Description                                 | Required |
| ------------------- | ------------------------------------------- | -------- |
| `DATABASE_URL`      | PostgreSQL connection string                | ✅       |
| `DIRECT_URL`        | Direct database connection (for migrations) | ✅       |
| `NEXTAUTH_URL`      | Application URL for authentication          | ✅       |
| `NEXTAUTH_SECRET`   | Session encryption secret                   | ✅       |
| `GOOGLE_AI_API_KEY` | Google Gemini API key                       | ✅       |
| `REDIS_URL`         | Redis connection string                     | Optional |
| `SUPABASE_URL`      | Supabase project URL                        | Optional |
| `SUPABASE_ANON_KEY` | Supabase anonymous key                      | Optional |

> **Security:** Never commit `.env` files. The `.env.example` file contains placeholder values only.

---

## Screenshots

> Screenshots of the live platform.

| Module                   | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| **Operations Dashboard** | Real-time KPI monitoring with live telemetry                   |
| **Crowd Intelligence**   | Heatmap visualization with gate-level density tracking         |
| **Incident Command**     | Full incident lifecycle with AI-driven phase progression       |
| **Spatial Digital Twin** | Interactive map with crowd, camera, sensor, and vehicle layers |
| **Camera Vision**        | PTZ sweep animations with incident-triggered tracking          |
| **Mobility & Transport** | Parking, transit, and traffic flow monitoring                  |
| **Workforce Management** | Department deployment visualization with fatigue alerts        |
| **Governance & Audit**   | Compliance tracking with RBAC policy enforcement               |
| **Infrastructure**       | Live topology graph with health metrics                        |
| **Media & Broadcast**    | Press zone alerts and fiber route auto-failover visualizations |
| **Hospitality**          | VIP corridor tracking and luxury suite occupancy               |
| **AI Copilot**           | Explainable reasoning with decision tree and approval workflow |

---

## Demo Scenarios

ArenaMind includes a built-in **Executive Scenario Controller** that triggers pre-built enterprise scenarios, demonstrating synchronized platform response across all modules.

| Scenario              | Trigger                              | Cascade                                                                                                |
| --------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Crowd Surge**       | Gate B reaches 95% occupancy         | Incident creation → AI analysis → Workforce dispatch → Rerouting → Camera tracking → Resolution        |
| **Medical Emergency** | Spectator collapse in Sector A       | Medical dispatch → AED coordination → Crowd redirect → AI prediction → Incident resolution             |
| **Security Threat**   | Suspicious package at Concourse West | Perimeter establishment → Police deployment → Camera override → VIP reroute → EOD response → All-clear |
| **VIP Arrival**       | VIP convoy approaching Gate A        | Traffic control → Parking reservation → Camera focus → Security deployment → Executive summary         |
| **Weather Alert**     | Severe thunderstorm warning          | Shelter protocol → Transport delay → Infrastructure load → Emergency planning → AI recommendations     |
| **Press Emergency**   | Media Zone capacity exceeded         | Security deployment → Overflow zone opened → Digital alerts to accredited media → Executive summary    |
| **Broadcast Failure** | Signal loss detected                 | Fiber route failover to satellite → Repair team dispatched → Telemetry throttled → Executive summary   |
| **VIP Surge**         | Celebrity arrival causes congestion  | VIP Security escort deployed → Fan traffic rerouted → Concierge staff increased → Executive summary    |

Each scenario unfolds with realistic operational delays and cascades deterministically through every connected module — dashboard, copilot, map, incidents, notifications, and timeline.

---

## Performance

| Metric             | Target     | Implementation                                                         |
| ------------------ | ---------- | ---------------------------------------------------------------------- |
| Render Performance | 60 FPS     | GPU-accelerated Canvas rendering for crowd, sensor, and vehicle layers |
| Bundle Size        | Optimized  | Code splitting via Next.js App Router with dynamic imports             |
| State Updates      | Throttled  | Ref-based animation loops decoupled from React render cycle            |
| Data Freshness     | Real-time  | Deterministic simulation engine with 1-second tick intervals           |
| Cache Strategy     | Multi-tier | Redis for server-side, React Query for client-side                     |
| Rate Limiting      | Enforced   | Token bucket algorithm on all API endpoints                            |

---

## Security

<details>
<summary><strong>Security Implementation Details</strong></summary>

| Domain               | Implementation                                                                   |
| -------------------- | -------------------------------------------------------------------------------- |
| **Authentication**   | NextAuth.js v5 with bcrypt password hashing and session tokens                   |
| **Authorization**    | Role-Based Access Control (RBAC) with Prisma-backed policy enforcement           |
| **API Security**     | Rate limiting, CORS configuration, security headers (CSP, HSTS, X-Frame-Options) |
| **Input Validation** | Zod schema validation on all API endpoints and server actions                    |
| **AI Safety**        | Prompt injection detection, hallucination guard, content safety filtering        |
| **Data Protection**  | Environment-based secrets, no credentials in source control                      |
| **Dependency Audit** | Automated `pnpm audit` in CI pipeline                                            |

For vulnerability reporting, see [`SECURITY.md`](./SECURITY.md).

</details>

---

## Production Readiness

| Category                | Status   | Details                                                             |
| ----------------------- | -------- | ------------------------------------------------------------------- |
| **Containerization**    | ✅ Ready | Multi-stage Docker build with production optimization               |
| **CI/CD**               | ✅ Ready | GitHub Actions with lint, typecheck, test, build, and deploy stages |
| **Health Monitoring**   | ✅ Ready | `/api/health` endpoint with dependency checks                       |
| **Structured Logging**  | ✅ Ready | JSON-formatted logs with correlation IDs                            |
| **Database Migrations** | ✅ Ready | Prisma migrate with version-controlled schema                       |
| **Scaling**             | ✅ Ready | Stateless architecture supporting horizontal scaling                |
| **Environment Config**  | ✅ Ready | Multi-environment support (development, preview, production)        |

---

## Roadmap

All phases are **complete** and production-certified.

| Phase       | Status      | Description                                                                                  |
| ----------- | ----------- | -------------------------------------------------------------------------------------------- |
| Phase 1–6   | ✅ Complete | Foundation, layout system, dashboard shell, component library, navigation, and motion design |
| Phase 7–9   | ✅ Complete | Crowd intelligence, incident command, and mobility modules                                   |
| Phase 10–12 | ✅ Complete | Intelligence center, camera vision, and workforce management                                 |
| Phase 13–14 | ✅ Complete | Governance & compliance, infrastructure monitoring                                           |
| Phase 15–16 | ✅ Complete | Enterprise AI engine, multi-agent swarm, knowledge graph                                     |
| Phase 17    | ✅ Complete | Authentication, authorization, and RBAC                                                      |
| Phase 18    | ✅ Complete | Spatial digital twin with synchronized map layers                                            |
| Phase 19    | ✅ Complete | Production infrastructure — Docker, CI/CD, security hardening, performance optimization      |
| Phase 20    | ✅ Complete | Synchronized demo state, executive scenario engine, hackathon demo readiness                 |

---

## License

This project is licensed under the **Apache License 2.0**. See the [`LICENSE`](./LICENSE) file for details.

---

## Acknowledgements

Built with the following open-source technologies:

- [Next.js](https://nextjs.org/) — React framework for production
- [React](https://react.dev/) — UI component library
- [Prisma](https://www.prisma.io/) — Type-safe database toolkit
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [Recharts](https://recharts.org/) — Charting library
- [NextAuth.js](https://next-auth.js.org/) — Authentication
- [Zod](https://zod.dev/) — Schema validation
- [Google Gemini](https://ai.google.dev/) — AI inference

---

<div align="center">

**ArenaMind AI** — Intelligent Venue Operations Copilot

_Transforming stadium operations through AI-driven situational intelligence._

</div>
