# Architecture Decisions (ADR)

## 1. Next.js App Router for Modular Architecture

- **Decision:** Utilize Next.js 16 App Router for the frontend and API layer.
- **Rationale:** Enables strict modularity (`src/app/components/`) and seamless server-side rendering for optimal performance (60 FPS on dashboards).
- **Proof:** Core routing implemented in `src/app/`.

## 2. Multi-Agent Swarm over Monolithic Prompting

- **Decision:** Implement a Supervisor-Worker swarm architecture (`src/lib/enterprise/ai/multi-agent/`).
- **Rationale:** Stadium operations are too complex for a single prompt. Specialized agents (Crowd, Security, Medical) allow for highly scoped, accurate context retrieval and lower hallucination rates.
- **Proof:** `orchestrator.service.ts` and individual agents in `src/lib/enterprise/ai/multi-agent/agents/`.

## 3. Human-in-the-Loop AI

- **Decision:** The AI recommends, but does not autonomously execute high-risk actions without approval.
- **Rationale:** Essential for enterprise-grade security and compliance (Governance module).
- **Proof:** `decision-engine.service.ts` coupled with the Copilot UI approval workflows.

## 4. Prisma & PostgreSQL for Persistence

- **Decision:** Use Prisma 7 ORM with PostgreSQL 16.
- **Rationale:** Type-safe database queries are critical for operational data integrity.
- **Proof:** `prisma/schema.prisma` defines the rigorous data models.

## 5. Defense in Depth (Security)

- **Decision:** Implement Rate Limiting, RBAC, and a Hallucination Guard.
- **Rationale:** Venue operations are mission-critical. The AI must be shielded from prompt injections and operational errors.
- **Proof:** `hallucination-guard.service.ts`, `content-safety.service.ts`, and server-side middleware.
