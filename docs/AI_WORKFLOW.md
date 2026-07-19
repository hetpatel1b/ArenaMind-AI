# AI Workflow & Orchestration

## Multi-Agent Swarm Architecture

ArenaMind employs a sophisticated multi-agent swarm architecture to handle concurrent, domain-specific operational data streams.

### 1. AI Gateway & Provider Manager

- **Location:** `src/lib/enterprise/ai/gateway.service.ts`
- **Workflow:** All AI requests are routed through the AI Gateway. The `provider-manager.ts` handles multi-provider routing (primarily Gemini), ensuring high availability and automatic failover. Rate limiting and token budgets are strictly enforced.

### 2. Context Building & Retrieval

- **Location:** `src/lib/enterprise/ai/context-builder.service.ts`
- **Workflow:** When an event occurs (e.g., a crowd surge), the context builder queries the `knowledge-graph.service.ts` and `operational-memory.service.ts` to enrich the prompt with historical data and venue topology.

### 3. Swarm Orchestration (The Supervisor)

- **Location:** `src/lib/enterprise/ai/multi-agent/orchestrator.service.ts`
- **Workflow:** The Supervisor Agent evaluates the enriched context and delegates sub-tasks to specialized domain agents (e.g., `crowd.agent.ts`, `security.agent.ts`).

### 4. Consensus & Decision Engine

- **Location:** `src/lib/enterprise/ai/decision-engine.service.ts`
- **Workflow:** Once the domain agents return their analyses, the `orchestrator` reaches a consensus. The decision engine scores the risk and provides a confidence interval for the recommended action.

### 5. Hallucination Guard & Explainability

- **Location:** `src/lib/enterprise/ai/hallucination-guard.service.ts` & `explainability.service.ts`
- **Workflow:** Before presenting the recommendation to the operator, the hallucination guard verifies facts against known venue constraints. The explainability service generates a clear reasoning chain, ensuring transparent and human-in-the-loop decision-making.
