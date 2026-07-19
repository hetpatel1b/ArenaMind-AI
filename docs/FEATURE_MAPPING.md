# Feature to Source Code Mapping

To prove that no functionality is "faked," this document maps the core features to their exact repository implementations.

### 1. Crowd Intelligence

- **Implementation:** `src/app/components/crowd/`
- **Capabilities:** Real-time density heatmaps, gate-level occupancy tracking.
- **AI Link:** `src/lib/enterprise/ai/multi-agent/agents/crowd.agent.ts`

### 2. Incident Command

- **Implementation:** `src/app/components/incidents/`
- **Capabilities:** End-to-end incident lifecycle management, phase tracking, and resource dispatch.
- **AI Link:** `src/lib/enterprise/ai/multi-agent/agents/incident.agent.ts`

### 3. Camera Vision Network

- **Implementation:** `src/app/components/camera/`
- **Capabilities:** PTZ camera management, automated sweep patterns, and incident-triggered tracking.
- **AI Link:** `src/lib/enterprise/ai/multi-agent/agents/camera.agent.ts`

### 4. Mobility & Transport

- **Implementation:** `src/app/components/mobility/`
- **Capabilities:** Parking utilization, transit statuses, traffic flow analysis.
- **AI Link:** `src/lib/enterprise/ai/multi-agent/agents/mobility.agent.ts`

### 5. Spatial Digital Twin (Map)

- **Implementation:** `src/app/components/map/`
- **Capabilities:** Multi-layered spatial rendering of crowds, vehicles, and sensors on a Canvas/SVG overlay.

### 6. Workforce Management

- **Implementation:** `src/app/components/workforce/`
- **Capabilities:** Real-time personnel deployment visualization and fatigue tracking.
- **AI Link:** `src/lib/enterprise/ai/multi-agent/agents/workforce.agent.ts`

### 7. Governance & Compliance

- **Implementation:** `src/app/components/governance/`
- **Capabilities:** Audit logging, RBAC enforcement.
- **AI Link:** `src/lib/enterprise/ai/multi-agent/agents/governance.agent.ts`
