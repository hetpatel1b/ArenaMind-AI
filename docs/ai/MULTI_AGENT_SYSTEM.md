# Multi-Agent System

ArenaMind utilizes a Swarm Orchestrator pattern.

## Agents

- **Supervisor Agent**: The final decision-maker. Aggregates data and creates the unified executive summary.
- **Routing Agent**: Decides which domain agents are required based on the incoming query and telemetry.
- **Mobility Agent**: Focuses on spatial paths, egress routes, and choke points.
- **Crowd Agent**: Analyzes crowd density, sentiment, and risk anomalies.
- **Incident Agent**: Correlates and ranks active security/medical incidents.

## Consensus Engine

When domain agents provide conflicting recommendations, the Consensus Engine calculates semantic overlap, factors in agent confidence, and produces a consensus score. The Supervisor Agent uses this score to flag high-risk tradeoffs to the operator.
