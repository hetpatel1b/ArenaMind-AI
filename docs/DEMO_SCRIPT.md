# Executive Demo Script

**File Reference:** `src/lib/demo/DemoScenarioEngine.ts`

## Scenario: The "Crowd Surge" Cascade

**Context:** The match is about to begin, and a massive influx of fans arrives at Gate B, creating a severe bottleneck.

### Step 1: Detection

- **Action:** Open the Crowd Intelligence Module (`/dashboard/crowd`).
- **Visual:** The heatmap turns red at Gate B; occupancy exceeds 95%.
- **Impact:** Demonstrates real-time data ingestion and visualization.

### Step 2: AI Orchestration

- **Action:** Open the AI Copilot panel.
- **Visual:** The Supervisor Agent (`orchestrator.service.ts`) detects the anomaly and consults the Crowd and Workforce agents.
- **Impact:** Shows the multi-agent swarm analyzing the problem without human prompt.

### Step 3: Recommendation & Explainability

- **Action:** Review the AI recommendation.
- **Visual:** The AI suggests opening Overflow Gate C, dispatching 5 volunteers, and redirecting camera PTZ to Gate B. The Explainability Engine (`explainability.service.ts`) shows exactly _why_ this decision was made.
- **Impact:** Proves the AI is transparent, reliable, and uses hallucination guards.

### Step 4: Execution & Resolution

- **Action:** The Operator clicks "Approve."
- **Visual:** The system automatically updates the Workforce module (`/dashboard/workforce`), adjusts the Camera network (`/dashboard/cameras`), and creates an Incident log (`/dashboard/incidents`).
- **Impact:** Demonstrates true cross-module integration and human-in-the-loop autonomous operations.
