# Stakeholder User Journeys

### 1. The Venue Operator (Operations Center)

**Goal:** Maintain overall stadium safety and efficiency.

- **Journey:** Logs into the main Dashboard (`/dashboard`). Uses the Spatial Digital Twin (`/dashboard/map`) to monitor the venue. Receives an AI alert regarding an unexpected crowd surge at Gate B. Uses the AI Copilot to automatically dispatch workforce (`/dashboard/workforce`) and adjust camera tracking (`/dashboard/cameras`).

### 2. The Security Team Lead

**Goal:** Assess and mitigate threats.

- **Journey:** Monitors the Incident Command module (`/dashboard/incidents`). A suspicious package is reported. The `security.agent.ts` cross-references camera feeds and suggests establishing a perimeter. The Lead approves the AI recommendation, triggering automated alerts to ground staff.

### 3. Transportation Coordinator

**Goal:** Ensure smooth ingress and egress.

- **Journey:** Uses the Mobility module (`/dashboard/mobility`). Notices traffic congestion on the main access road. The `mobility.agent.ts` suggests rerouting incoming traffic and dynamically updating digital signage.

### 4. Accessibility Coordinator

**Goal:** Ensure inclusive experiences for fans with disabilities.

- **Journey:** Uses Inclusive Profiles (`src/lib/inclusive/`) to monitor accessible seating and navigation routes. In an emergency, receives specific AI recommendations for evacuating fans needing mobility assistance.
