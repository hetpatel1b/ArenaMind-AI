# ArenaMind AI — UI/UX Design Brief

> **Product:** ArenaMind AI — The Intelligent Stadium Operations Copilot  
> **Document Type:** UI/UX Design Brief — Design Bible  
> **Version:** 1.0.0  
> **Status:** APPROVED — Design Authority  
> **Last Updated:** July 12, 2026  
> **Document Owner:** Principal Product Design, Creative Direction  
> **References:** [PRD v1.0.0](./ArenaMind_AI_PRD.md) · [TRD v1.0.0](./ArenaMind_AI_TRD.md) · [SAD v1.0.0](./ArenaMind_AI_SAD.md)  
> **Classification:** Internal — Design

---

## Table of Contents

1. [Executive Design Vision](#1-executive-design-vision)
2. [Brand Personality](#2-brand-personality)
3. [Emotional Design Strategy](#3-emotional-design-strategy)
4. [Visual Storytelling](#4-visual-storytelling)
5. [Design Language](#5-design-language)
6. [Design Principles](#6-design-principles)
7. [UX Goals](#7-ux-goals)
8. [User Journey Philosophy](#8-user-journey-philosophy)
9. [Information Architecture](#9-information-architecture)
10. [Navigation Architecture](#10-navigation-architecture)
11. [Layout Architecture](#11-layout-architecture)
12. [Responsive Strategy](#12-responsive-strategy)
13. [Dashboard Philosophy](#13-dashboard-philosophy)
14. [AI Copilot Interaction Model](#14-ai-copilot-interaction-model)
15. [Color System](#15-color-system)
16. [Typography System](#16-typography-system)
17. [Spacing System](#17-spacing-system)
18. [Iconography](#18-iconography)
19. [Illustration Style](#19-illustration-style)
20. [Component Library](#20-component-library)
21. [Data Visualization](#21-data-visualization)
22. [Motion Design](#22-motion-design)
23. [Glassmorphism & Depth](#23-glassmorphism--depth)
24. [AI Experience Design](#24-ai-experience-design)
25. [State Design](#25-state-design)
26. [Accessibility](#26-accessibility)
27. [Design Token System](#27-design-token-system)
28. [Figma Organization](#28-figma-organization)
29. [Design QA Checklist](#29-design-qa-checklist)

---

## 1. Executive Design Vision

### 1.1 The Core Design Premise

ArenaMind AI is not a dashboard. It is an **operational intelligence environment** — a digital command center where stadium operations teams receive AI-augmented situational awareness during one of the most complex live events on earth.

The design must communicate a single, overriding feeling to the user the moment they open the application:

> _"I am prepared. I am informed. I am in control."_

This feeling is not achieved through visual complexity, feature density, or aggressive aesthetics. It is achieved through **precision, restraint, and purposeful information hierarchy** — every pixel earning its existence by reducing cognitive load or accelerating a decision.

The product serves Stadium Operations Managers who work 14+ hour shifts under significant pressure. The interface must be the **calmest thing in their environment**. It must deliver the right information at the right time, surface AI intelligence without demanding attention, and allow for fast, confident action without second-guessing.

### 1.2 Design Inspiration Matrix

| Inspiration Source                   | What We Take                                                            | What We Reject                                |
| ------------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------- |
| **Bloomberg Terminal**               | Information density discipline, monospace data clarity, color semantics | Visual brutalism, lack of hierarchy           |
| **Apple Human Interface Guidelines** | Clarity, deference, depth; every element has a job                      | Consumer-app playfulness, rounded excess      |
| **Linear**                           | Precision typography, keyboard-first density, minimal chrome            | Minimalism at the expense of function         |
| **Stripe Dashboard**                 | Trust-inspiring data visualization, controlled white space              | Overly marketing-friendly for operational use |
| **Vercel**                           | Dark mode mastery, subtle glass, clean developer aesthetic              | Code-centric focus                            |
| **Tesla UI**                         | Full-screen map-as-background, status-first hierarchy                   | Automotive-specific metaphors                 |
| **F1 Race Control**                  | Real-time multi-stream awareness, status-light language                 | Sport-specific visual loudness                |
| **Air Traffic Control**              | Zone-based spatial thinking, altitude/density metaphors                 | Military austerity                            |
| **Arc Browser**                      | Sidebar elegance, content-as-focus philosophy                           | Consumer personalization features             |
| **Mission Control**                  | Multi-module grid, status-at-a-glance, ambient awareness                | NASA-era visual language                      |

### 1.3 The Three Visual Pillars

```
DEPTH              INTELLIGENCE           PRECISION
─────────          ─────────────          ─────────
Layered glass      AI glow language       Pixel-perfect grid
surfaces create    signals where the      Monospace numbers
spatial hierarchy  machine is thinking    Sub-pixel typography
without clutter    and what it found      Intentional density
```

---

## 2. Brand Personality

### 2.1 Five Brand Dimensions

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARENAMIND AI BRAND DIMENSIONS                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AUTHORITATIVE          Not arrogant. Trusted expert voice.    │
│  ────────────           Speaks in facts, not suggestions.      │
│                                                                 │
│  INTELLIGENT            Not robotic. The system understands    │
│  ────────────           context, adapts to phase, anticipates. │
│                                                                 │
│  CALM                   Not passive. Communicates urgency      │
│  ────                   without inducing panic. Clear signal.  │
│                                                                 │
│  PRECISE                Not cold. Every piece of information   │
│  ───────                is exactly where it needs to be.       │
│                                                                 │
│  ALIVE                  Not static. The interface breathes.    │
│  ─────                  Live data. Ambient motion. Awareness.  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Voice and Tone in UI

The brand voice translates directly into interface copy and AI output language.

| Context                    | Tone                   | Example                                                               |
| -------------------------- | ---------------------- | --------------------------------------------------------------------- |
| **AI Operational Summary** | Authoritative, factual | "Zone C has reached 91% capacity. Projected overflow in 9 minutes."   |
| **AI Recommendation**      | Direct, actionable     | "Redeploy 2 stewards from Gate B to Zone C entrance. Priority: High." |
| **Empty State**            | Calm, encouraging      | "No incidents recorded. Match day is running smoothly."               |
| **Error State**            | Clear, non-alarmist    | "AI analysis unavailable. Your operational data remains accurate."    |
| **Success State**          | Minimal, confirmatory  | "Incident resolved. Logged at 20:14."                                 |
| **Warning**                | Precise, urgent        | "Crowd density in North Stand exceeding alert threshold."             |

### 2.3 Anti-Patterns (What This Product Must Never Feel Like)

- A BI tool with colorful charts for executive presentations
- A consumer app trying to be enterprise
- A government/legacy system with forms from 2008
- A gaming HUD with neon overload
- A generic SaaS dashboard with widgets and greeting text
- A chatbot interface where AI is the primary entry point

---

## 3. Emotional Design Strategy

### 3.1 Emotional Arc During a Match Day

The user's emotional state shifts dramatically through a match day. Design must track this arc and adapt.

```
Pre-Event (T-3h)       Fan Arrival (T-90m)    Match Live         Halftime          Post-Match
──────────────         ───────────────────    ──────────         ────────          ──────────
Emotion: Focused       Emotion: Alert         Emotion: Tense     Emotion: Relieved  Emotion: Fatigued
                                              + controlled        + re-energized
UI Priority:           UI Priority:           UI Priority:       UI Priority:       UI Priority:
Readiness audit        Crowd monitoring       Incident speed     Crowd surge mgmt   Report generation
Resource check         Ingress rates          AI clarity         Resource re-deploy Data review
Team briefing          Alert thresholds       Realtime push      Shift handover     Handover prep

Design Response:       Design Response:       Design Response:   Design Response:   Design Response:
Calm + organized       Elevated status cues   Maximum clarity    Re-focus state     Summary + export
```

### 3.2 Stress-Reduction Design Patterns

An operational system used under stress must actively reduce cognitive burden:

| Stress Trigger                                  | Design Response                                                             |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| **Information overload**                        | Progressive disclosure — surface critical info first, details on demand     |
| **Alert fatigue**                               | Hierarchical severity colors (not everything is red)                        |
| **Decision paralysis under AI recommendations** | One primary CTA per recommendation. Dismiss is always available.            |
| **Fear of making wrong action**                 | Every action shows consequence preview and is undoable where possible       |
| **Loss of situation awareness**                 | Persistent status strip, ambient health score gauge, live phase indicator   |
| **AI distrust**                                 | Every AI output shows confidence score + reasoning + source data references |
| **System uncertainty**                          | Explicit loading states, never show stale data silently                     |

### 3.3 Trust Architecture in the UI

Trust is built through **behavioral consistency, visual reliability, and transparent AI**.

```
TRUST BUILDING ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━

1. Consistent Layout       — The sidebar never moves. The health score is always top-right.
2. Color Semantics         — Red always means critical. Green always means safe. No exceptions.
3. AI Transparency         — Every recommendation shows: what it found, why it recommends, confidence.
4. Human Control           — Accept/Dismiss is always visible. AI never hides the dismiss option.
5. Audit Trail             — Every accepted recommendation shows who accepted it and when.
6. Graceful Degradation    — When AI is unavailable, data features work perfectly. No silent failures.
7. Data Freshness Signal   — Timestamps on every data-bearing widget. Staleness indicator when delayed.
```

---

## 4. Visual Storytelling

### 4.1 The Stadium as Metaphor

The spatial metaphor of the stadium permeates the design language:

- **Zones** — The dashboard is divided into operational zones, mirroring stadium sectors
- **Field-of-View** — The main content area is the "field" — everything else supports it
- **Control Room Aesthetic** — Dark backgrounds recall the deliberate dim lighting of control rooms that minimize glare and maximize screen focus
- **Live Status Lights** — Color-coded status indicators echo the physical status boards in operations centers

### 4.2 AI as Trusted Advisor, Not Oracle

Visually, the AI is represented as a **supporting presence** — not the primary focus:

- AI content appears in slightly **differentiated panels** with a subtle violet gradient border
- AI outputs are always accompanied by a **confidence ring** and **reasoning text**
- The AI "voice" in the UI is visually softer than the operational data — data is always the primary truth
- The transition from "AI Thinking" → "AI Output" is animated deliberately to signal that computation occurred

### 4.3 Data as the Hero

In this interface, **data is the hero, not the design**:

- Typography is subordinate to numbers
- Charts are subordinate to the data they represent
- The sidebar is subordinate to the content area
- AI cards are subordinate to the incident or crowd data they analyze

---

## 5. Design Language

### 5.1 Named Design Language: **"Obsidian Intelligence"**

The ArenaMind AI design language is called **Obsidian Intelligence** — evoking the dark, glassy, sharp-edged quality of obsidian stone combined with the precision of machine intelligence.

**Core characteristics:**

| Property              | Specification                                                        |
| --------------------- | -------------------------------------------------------------------- |
| **Surface quality**   | Deep dark base with layered glass panels creating depth              |
| **Color temperature** | Cold-neutral base (not warm dark) — Navy-black, not brown-black      |
| **Accent energy**     | Surgical sapphire blue for primary actions, cerebral violet for AI   |
| **Data chromatics**   | Semantic color for all status (crowd, incidents, resources)          |
| **Light source**      | Simulated top-left ambient glow on elevated surfaces                 |
| **Edge treatment**    | 1px hairline borders, low opacity, creating crisp surface definition |
| **Motion character**  | Spring-physics, fast, purposeful — nothing decorative                |

### 5.2 Surface Hierarchy (Dark Mode Primary)

```
Layer 5 (Highest)   Modal overlays, command palette
                    bg: rgba(16, 20, 32, 0.98) + blur(40px)
                    ↑
Layer 4             Floating cards, tooltips, active dropdowns
                    bg: rgba(22, 27, 44, 0.95) + blur(24px)
                    ↑
Layer 3             Card content, panels, sidebars (elevated)
                    bg: #161B2C / rgba(22, 27, 44, 0.9)
                    ↑
Layer 2             Section containers, tab panels
                    bg: #111827 / rgba(17, 24, 39, 0.8)
                    ↑
Layer 1 (Base)      Page background, app shell
                    bg: #0A0E1A (Deep Obsidian)
```

---

## 6. Design Principles

### 6.1 P01 — Minimal Cognitive Load

**Definition:** Reduce the number of decisions a user must make in any given moment.

**Application:** Each screen has a single primary action. Secondary actions are accessible but not prominent. Destructive actions require confirmation. AI recommendations are pre-digested — the manager evaluates a conclusion, not raw data.

**Implementation rules:**

- No screen should contain more than 2 competing primary CTAs
- Information groups are chunked in 3s or 4s (Miller's Law)
- Related controls are spatially grouped (Gestalt: proximity)

---

### 6.2 P02 — Progressive Disclosure

**Definition:** Show only what is needed. Reveal detail on demand.

**Application:** The command center shows health score + critical alerts. Clicking an alert reveals detail. Clicking detail reveals AI analysis. Clicking analysis reveals reasoning. Each step adds depth without overwhelming the previous view.

**Implementation rules:**

- Default card state: summary only
- Expand on hover/click: detail view
- Drill-down on dedicated action: full context panel

---

### 6.3 P03 — Calm Technology

**Definition:** Technology should inform without demanding attention.

**Application:** Realtime crowd updates animate subtly — zone color fades from amber to red over 3 seconds when density crosses a threshold. It is visible peripherally without hijacking focus. Alerts use a gentle slide-in, not a jarring full-screen interrupt.

**Implementation rules:**

- Realtime data changes use color interpolation, not hard jumps
- Notifications enter from the top-right, stay 6 seconds, dismiss automatically
- Only Tier 1 (life safety) incidents trigger an audible + full visual alert

---

### 6.4 P04 — Context Awareness

**Definition:** The interface adapts to the current operational context.

**Application:** During "Match Live" phase, crowd density and incident modules receive more visual prominence. During "Post Event," the reports module moves to the forefront. AI recommendations are phase-aware — they reference the current operational phase in their language.

**Implementation rules:**

- Phase indicator is always visible in top navigation
- Module ordering adapts to phase priority
- AI summary regenerates automatically on phase change

---

### 6.5 P05 — AI-First Interaction

**Definition:** AI analysis should be the first thing a manager sees when they need it, not something they have to navigate to.

**Application:** The command center surfaces the AI operational summary and top recommendations proactively. The manager doesn't "ask" the AI — the AI is already working in the background.

**Implementation rules:**

- AI content is above-the-fold on Command Center
- AI analysis initiates automatically when a new incident is created
- AI recommendations refresh every 10 minutes or on phase change — no manual trigger required

---

### 6.6 P06 — Human-in-the-Loop

**Definition:** AI always recommends. Humans always decide.

**Application:** Every AI recommendation requires an explicit Accept or Dismiss action. Accept does not automatically execute an operational change — it records the decision and the manager then performs the action through the appropriate module.

**Implementation rules:**

- Accept/Dismiss buttons are always visible alongside AI outputs
- Accepted recommendations show "Accepted by [Name] at [Time]"
- No AI panel auto-advances or auto-applies

---

### 6.7 P07 — Consistency

**Definition:** Identical interactions produce identical results in identical contexts.

**Application:** The same gesture (click a card title) always navigates to detail. The same color (red) always means the same thing (critical). The same badge shape (pill) always means status.

---

### 6.8 P08 — Visual Hierarchy

**Definition:** The most important information is the most visually prominent.

**Application:** Health score is largest on Command Center. Incident tier is the most prominent text on incident cards. Crowd density percentage is the primary number on zone cards.

---

### 6.9 P09 — Feedback Loops

**Definition:** Every action produces an immediate, visible response.

**Application:** Button click → loading state within 100ms. Form submit → success toast within 500ms of completion. AI request → thinking animation starts immediately. Realtime data change → zone color updates within 500ms of receiving WebSocket event.

---

### 6.10 P10 — Accessibility by Design

**Definition:** Accessibility is not a feature — it is a design constraint from day one.

**Application:** All colors meet WCAG 2.2 AA minimum contrast ratios. All interactive elements are keyboard-navigable. All charts have accessible text alternatives. All status indicators use shape + color, never color alone.

---

### 6.11 P11 — Learnability

**Definition:** A new user should understand the interface within 5 minutes of use.

**Application:** Module names are operational, not product marketing terms. Navigation labels use the vocabulary of stadium operations. Tooltips are available on hover for all data fields. An optional onboarding overlay explains the AI workflow on first visit.

---

### 6.12 P12 — Error Prevention

**Definition:** Design the interface to make errors unlikely before they occur.

**Application:** Phase change requires confirmation dialog with the new phase name. Resource status change shows the current status before allowing override. Incident closure requires resolution description (cannot be empty). AI dismissal accepts an optional reason to improve future recommendations.

---

### 6.13 P13 — Trust by Design

**Definition:** The interface must be visually reliable so that users trust the data it presents.

**Application:** Data timestamps are shown on every widget. Data freshness is communicated visually (green dot = live, amber dot = polling, grey dot = stale). AI confidence scores are displayed numerically, not just as "high/medium/low."

---

### 6.14 P14 — Keyboard-First Productivity

**Definition:** Power users should be able to operate the entire system without a mouse.

**Application:** Every navigation action has a keyboard shortcut. The Command Palette (⌘K) provides access to all modules, actions, and search. Tab order is logical and predictable. Escape always closes the topmost overlay.

---

## 7. UX Goals

| UX Goal                              | Measurement                              | Design Mechanism                              |
| ------------------------------------ | ---------------------------------------- | --------------------------------------------- |
| Immediate operational awareness      | Dashboard loads with full data in <3s    | Server-side rendering of initial state        |
| AI recommendation scan time          | Manager reads and decides in <30s        | Single-purpose recommendation cards           |
| Incident creation speed              | New incident logged in <90s              | Pre-filled smart defaults, keyboard shortcuts |
| Zero training required for basic use | First-session task completion > 80%      | Consistent navigation, labeled modules        |
| Situation recovery from distraction  | Re-orient to current status in <10s      | Persistent health score + phase indicator     |
| Fatigue-proof at hour 12             | Readability maintained at low brightness | High contrast defaults, adjustable density    |

---

## 8. User Journey Philosophy

### 8.1 The Three Journeys

**Journey 1: Morning Briefing (Pre-Event)**

> The manager opens ArenaMind AI 3 hours before kickoff. The Command Center shows resource deployment gaps, pre-event AI briefing, weather conditions, and gate readiness. The experience is calm and organized. The interface is in "preparation mode" — emphasis on readiness audit.

**Journey 2: Live Match Operations (Match Live)**

> The manager is monitoring 5 zones simultaneously. Crowd Zone C turns amber. An alert slides in from top-right. The incident list shows 2 new Tier-2 medical incidents. AI has already classified them and drafted response recommendations. The manager accepts one, dismisses the other (providing a reason). The experience is fast, decisive, and focused.

**Journey 3: End-of-Match Wind-Down (Post-Event)**

> The crowd is exiting. Crowd density drops across all zones. The manager initiates a shift handover. AI generates a structured handover document. The manager reviews it, adds one annotation, and completes the handover. The executive summary is generated and exported as a PDF. The interface feels complete — a closure to the operational cycle.

### 8.2 Journey States and Visual Mode

| Phase        | UI Mode               | Key Visual Change                                  | AI Behavior                             |
| ------------ | --------------------- | -------------------------------------------------- | --------------------------------------- |
| Pre-Event    | **Preparation**       | Status grid prominent, deployment overview visible | Resource gap analysis, weather brief    |
| Gate Opening | **Alert**             | Crowd module elevated, ingress rate displayed      | Congestion prediction active            |
| Fan Arrival  | **Monitoring**        | Zone heatmap full-width, queue data visible        | Real-time crowd recommendations         |
| Match Live   | **Active Operations** | Incident feed prominent, alert badge on sidebar    | Incident classification + response reco |
| Halftime     | **Surge Response**    | Concession + restroom indicators added             | Re-entry routing, crowd distribution    |
| Post-Match   | **Egress Mode**       | Transport module elevated, crowd exit tracking     | Exit routing suggestions                |
| Post-Event   | **Wrap-Up**           | Reports module primary, summary generation         | Executive summary generation            |

---

## 9. Information Architecture

### 9.1 Top-Level Navigation Structure

```
ArenaMind AI
├── /command-center          ← AI Command Center (default landing)
│   ├── Operational Summary  (AI-generated, full-shift overview)
│   ├── Health Score Gauge
│   ├── Critical Alerts Feed
│   ├── AI Recommendations
│   ├── KPI Strip
│   └── Live Status Grid
│
├── /crowd-intelligence      ← Crowd Intelligence Hub
│   ├── Stadium Zone Map     (interactive heatmap)
│   ├── Density by Zone      (real-time bars)
│   ├── Crowd Trends         (15-minute rolling chart)
│   ├── Queue Management     (concession + gates)
│   ├── Congestion Prediction
│   └── AI Crowd Recommendations
│
├── /incidents               ← Incident Management
│   ├── Incident List        (filterable, sortable)
│   ├── Incident Detail      (single incident view)
│   ├── Create Incident      (modal form)
│   ├── AI Classification    (per incident)
│   └── AI Response Plan     (per incident)
│
├── /resources               ← Resource Coordination
│   ├── Resource Table       (all deployed resources)
│   ├── Zone Coverage Map
│   ├── Resource Status Update
│   └── AI Deployment Suggestions
│
├── /transportation          ← Transport & Accessibility
│   ├── Parking Status
│   ├── Shuttle Tracking
│   ├── Accessibility Requests (live queue)
│   └── AI Routing Suggestions
│
└── /reports                 ← Analytics & Reporting
    ├── Match Analytics      (charts + KPIs)
    ├── Incident Summary
    ├── AI Executive Summary (generation + edit)
    └── Export PDF
```

### 9.2 Secondary Information Layers

| Layer                      | Access Method             | Content                          |
| -------------------------- | ------------------------- | -------------------------------- |
| **Right Context Panel**    | Click any module card     | Expanded detail view             |
| **AI Reasoning Panel**     | Click AI confidence badge | Full prompt → output → reasoning |
| **Incident Detail Drawer** | Click incident row        | Full incident timeline + AI reco |
| **Resource Detail Sheet**  | Click resource row        | Full resource history + location |
| **Shift Handover Modal**   | Click "Initiate Handover" | Generated handover document      |
| **Command Palette**        | ⌘K / Ctrl+K               | Search + actions + shortcuts     |

---

## 10. Navigation Architecture

### 10.1 Sidebar Design

**Collapsed State (64px width):** Icon-only navigation. Active module indicator via left accent bar (3px, primary blue). Hover shows floating tooltip with module name.

**Expanded State (240px width):** Icon + label. Module sections with subtle group headers. User avatar + role badge at bottom.

**Toggle:** Click the hamburger/chevron at top of sidebar, or keyboard shortcut `[`. On mobile, sidebar becomes a bottom sheet.

```
┌─────────────────────────────────────────────┐
│  ⊕ ArenaMind                               │
│  ──────────────────────────────────────────│
│  🏟  Command Center        ←← Active       │
│  👁  Crowd Intelligence                    │
│  🚨  Incidents              ③              │
│  📦  Resources                             │
│  🚌  Transportation                        │
│  📊  Reports                               │
│                                             │
│  ─────────────────                         │
│  ⚙   Settings                              │
│  ❓  Help                                  │
│                                             │
│  [Avatar] Het Patel                        │
│           Operations Manager               │
└─────────────────────────────────────────────┘
```

### 10.2 Top Navigation Bar

**Left zone:** App logo mark + current match context pill ("Al Bayt Stadium — Match 32 — LIVE")

**Center zone:** Phase indicator (pill with phase name + elapsed time in phase)

**Right zone:** Notification bell (with count badge) + Health Score mini-gauge + Avatar menu

```
┌─────────────────────────────────────────────────────────────────────┐
│  ◈ ArenaMind  │ Al Bayt Stadium — Match 32 ●LIVE  │  ⬤ MATCH LIVE  │   🔔³  88  [Het ▾] │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.3 Module Tab Navigation

Within each module, secondary navigation uses horizontal tabs at the top of the content area:

```
[Overview] [Zone Map] [Trends] [Queue Management] [AI Analysis]
  ──────
  (active underline, 2px, primary blue)
```

### 10.4 Command Palette (⌘K)

Full-screen overlay with search-first interface. Categories: Navigation, Actions, AI Features, Recent.

```
┌─────────────────────────────────────────────────────────┐
│  🔍  Search or type a command...                        │
│  ────────────────────────────────────────────────────── │
│  NAVIGATION                                             │
│  ⌘1  Command Center                                    │
│  ⌘2  Crowd Intelligence                                │
│  ⌘3  Incidents                                         │
│  ────────────────────────────────────────────────────── │
│  ACTIONS                                                │
│  N   New Incident                                       │
│  H   Initiate Shift Handover                           │
│  P   Change Match Phase                                 │
│  ────────────────────────────────────────────────────── │
│  AI FEATURES                                            │
│  A   Generate Operational Summary                       │
│  R   Refresh AI Recommendations                        │
└─────────────────────────────────────────────────────────┘
```

---

## 11. Layout Architecture

### 11.1 Primary Layout Grid

```
Desktop (1280px+):
┌──────────┬──────────────────────────────────────────────┐
│          │  TOP NAV BAR (56px)                          │
│ SIDEBAR  ├──────────────────────────────────────────────┤
│ (240px)  │                                              │
│          │  CONTENT AREA (fluid, max 1400px centered)   │
│          │                                              │
│          │  [Module Tabs]                               │
│          │                                              │
│          │  [Main Content Grid]                         │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### 11.2 Content Grid System

**Primary grid:** 12-column, 24px gutters, 24px outer padding

**Breakpoint-specific column counts:**

| Breakpoint          | Columns | Gutter | Outer |
| ------------------- | ------- | ------ | ----- |
| xs (375px)          | 4       | 16px   | 16px  |
| sm (640px)          | 6       | 16px   | 20px  |
| md (768px)          | 8       | 20px   | 24px  |
| lg (1024px)         | 12      | 24px   | 24px  |
| xl (1280px)         | 12      | 24px   | 32px  |
| 2xl (1536px)        | 12      | 24px   | 40px  |
| ultrawide (2560px+) | 16      | 32px   | 80px  |

### 11.3 Command Center Layout Specification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOP NAV                                                                     │
├──────────────────────────────────────────────────────┬──────────────────────┤
│                                                      │                      │
│  OPERATIONAL SUMMARY (AI)                            │  HEALTH SCORE GAUGE  │
│  col-span-8                                          │  col-span-4          │
│                                                      │                      │
├──────────────────────────────────────────────────────┴──────────────────────┤
│  KPI STRIP (4 tiles, each col-span-3)                                       │
├────────────────────────────────────────┬────────────────────────────────────┤
│                                        │                                    │
│  CRITICAL ALERTS FEED                  │  AI RECOMMENDATIONS                │
│  col-span-6                            │  col-span-6                        │
│                                        │                                    │
├────────────────────────────────────────┴────────────────────────────────────┤
│  LIVE STATUS GRID (6 modules, each col-span-2)                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Responsive Strategy

### 12.1 Breakpoint Philosophy

ArenaMind AI is **desktop-first for operations** but **mobile-capable for mobile coordinators**. The design is optimized for the 1280px–1920px range (laptop to 1080p monitor).

| Device                      | Primary Use Case                        | Layout Strategy                                        |
| --------------------------- | --------------------------------------- | ------------------------------------------------------ |
| **Mobile (375-767px)**      | Coordinators on-field checking status   | Single-column, critical data only, large touch targets |
| **Tablet (768-1023px)**     | Deputy managers in mobile command posts | 2-column, condensed cards, bottom navigation           |
| **Laptop (1024-1279px)**    | Operations managers at workstations     | Collapsed sidebar (icons), 12-column grid              |
| **Desktop (1280-1919px)**   | Primary operations center               | Expanded sidebar, full grid, all features visible      |
| **Large Display (1920px+)** | Control room wall displays              | Multi-panel layout, increased type sizes               |
| **Ultra-Wide (2560px+)**    | Stadium control room arrays             | 3-panel layout, ambient monitoring mode                |

### 12.2 Mobile Strategy

On mobile, the interface transforms:

- Sidebar → **Bottom navigation bar** (5 icons: Command, Crowd, Incidents, Resources, More)
- Top nav → **compact header** (logo + notification + avatar)
- Cards → **full-width**, reduced padding
- Charts → **simplified** (no interactive tooltips, larger labels)
- AI content → **collapsible sections**, summary-first

### 12.3 Control Room Display Mode

For 55"+ displays in physical stadium control rooms:

- **Ambient mode**: Auto-rotating views between modules (30-second intervals)
- **Ultra-density mode**: Increased information density, smaller text, more simultaneous data
- **No-interaction mode**: Read-only display for secondary screens
- Font size increases 20% across all type scales
- 3-panel layout: Crowd Left | Command Center | Incidents Right

---

## 13. Dashboard Philosophy

### 13.1 The Command Center as the Single Point of Truth

The Command Center is not a summary of other modules — it is the primary operational view. It answers the question: **"What is happening right now, what does the AI recommend, and what do I need to act on?"**

This means:

- The Operational Summary AI panel is the topmost content element
- Health Score is the single number that encodes the entire operational state
- Critical Alerts are surfaced proactively — not requiring navigation to Incidents
- AI Recommendations appear without the manager having to ask

### 13.2 Health Score Design Philosophy

The **Health Score** (0–100, computed from incidents + crowd + resources + accessibility) is the **most important single number in the interface**. Its design must reflect this:

- **Position:** Top-right of Command Center, always visible
- **Size:** 80px circular gauge, 5px stroke
- **Color:** 0-40 = Red → 41-60 = Amber → 61-80 = Green → 81-100 = Sapphire
- **Typography:** 36px tabular-nums bold, centered in gauge
- **Animation:** Score changes animate via spring physics over 800ms
- **Label:** Small "HEALTH SCORE" in uppercase caption, below gauge
- **History sparkline:** Tiny 60-point sparkline beneath gauge showing last 60 minutes

### 13.3 Information Density Settings

Three density modes accessible from user preferences:

| Mode                      | Card Padding | Type Size | Info Shown            |
| ------------------------- | ------------ | --------- | --------------------- |
| **Comfortable** (default) | 24px         | Base      | Key data + AI summary |
| **Compact**               | 16px         | -2px      | Key data only         |
| **Ultra-Dense**           | 10px         | -4px      | Numbers + status only |

---

## 14. AI Copilot Interaction Model

### 14.1 AI as Ambient Intelligence

The AI is not a chatbot. It does not require the user to ask questions. Instead, it operates as an **ambient intelligence layer** — always working in the background, surfacing insights proactively.

**The AI interaction model has three modes:**

**Mode 1: Proactive (Default)**
AI analyses run automatically. The Operational Summary regenerates every 10 minutes. Incident classification runs when an incident is created. Crowd recommendations refresh when density changes significantly. The manager sees AI outputs without requesting them.

**Mode 2: On-Demand**
Some AI features require explicit triggering: Executive Summary generation, Shift Handover initiation, manual AI recommendation refresh. These are triggered by a primary action button in the relevant module.

**Mode 3: Contextual**
When a manager opens an incident detail, the AI response plan is fetched automatically. When a manager views the crowd map, congestion predictions are shown. AI follows the user's attention, not the reverse.

### 14.2 AI Content Block Design

Every AI-generated section uses the `AIContentBlock` visual pattern:

```
┌─ AI CONTENT BLOCK ─────────────────────────────────────────────┐
│  ⬡ Operational Summary                    [88%] ↻ Regenerate  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  [Content — text, recommendations, structured data]             │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Generated at 20:14 · Expires at 20:24 · gemini-2.0-flash      │
│  [👍 Accept] [👎 Dismiss ▾]                                    │
└─────────────────────────────────────────────────────────────────┘
```

Visual signature:

- **Left border accent:** 2px gradient (violet → blue) — the AI visual mark
- **Top-right:** Confidence ring (color-coded: green ≥0.8, amber ≥0.6, red <0.6) + score
- **Footer:** Generation timestamp + model name (subtle, caption size)
- **Actions:** Accept (primary ghost blue) + Dismiss (destructive ghost, low prominence)

---

## 15. Color System

### 15.1 Design Philosophy

The color system serves **operational semantics first, aesthetics second**. Every color has an unambiguous meaning. Hue is reserved for semantic communication — decorative color use is minimal.

### 15.2 Base Palette — Dark Mode (Primary)

```css
/* ─────────────────────────────────────────── */
/* DEEP BACKGROUND — The Obsidian Foundation  */
/* ─────────────────────────────────────────── */
--color-base-950: #060911; /* Void — deepest black */
--color-base-900: #0a0e1a; /* Obsidian — page background */
--color-base-850: #0e1220; /* Abyss — sidebar background */
--color-base-800: #111827; /* Cavern — section containers */
--color-base-750: #161b2c; /* Slate — card backgrounds */
--color-base-700: #1c2136; /* Dusk — elevated cards */
--color-base-650: #212740; /* Twilight — active states */
--color-base-600: #272e4a; /* Mist — hover states */
--color-base-500: #3a4262; /* Fog — borders */
--color-base-400: #5b6480; /* Haze — secondary borders */
--color-base-300: #8b93b0; /* Cloud — disabled text */
--color-base-200: #b8bece; /* Silver — secondary text */
--color-base-100: #d8dce8; /* Pearl — primary text (dim) */
--color-base-50: #f0f2f8; /* White — primary text (bright) */
```

### 15.3 Primary — Sapphire Blue (Actions, Primary UI)

```css
--color-primary-950: #001329;
--color-primary-900: #00224d;
--color-primary-800: #003380;
--color-primary-700: #0047ad;
--color-primary-600: #005ce6; /* Primary — default button */
--color-primary-500: #1a75ff; /* Primary — hover */
--color-primary-400: #4d94ff; /* Primary — focus ring */
--color-primary-300: #80b3ff; /* Primary — ghost button text */
--color-primary-200: #b3d1ff; /* Primary — light backgrounds */
--color-primary-100: #e6f0ff; /* Primary — very light */
```

### 15.4 AI Accent — Cerebral Violet (AI-specific UI)

```css
--color-ai-950: #0d0019;
--color-ai-900: #1a0033;
--color-ai-800: #2d0066;
--color-ai-700: #4000a6;
--color-ai-600: #5500d9; /* AI — primary, borders */
--color-ai-500: #7e22ce; /* AI — accent, glows */
--color-ai-400: #a855f7; /* AI — hover, thinking */
--color-ai-300: #c084fc; /* AI — light mode */
--color-ai-200: #ddb6fe; /* AI — subtle background tint */
--color-ai-100: #f5e8ff; /* AI — very light */
```

### 15.5 Semantic Colors

```css
/* ─── SUCCESS ─── */
--color-success-700: #064e3b;
--color-success-600: #065f46;
--color-success-500: #059669; /* Default success */
--color-success-400: #10b981;
--color-success-300: #34d399;
--color-success-100: #d1fae5;

/* ─── WARNING ─── */
--color-warning-700: #78350f;
--color-warning-600: #92400e;
--color-warning-500: #d97706; /* Default warning */
--color-warning-400: #f59e0b;
--color-warning-300: #fcd34d;
--color-warning-100: #fef3c7;

/* ─── DANGER ─── */
--color-danger-700: #7f1d1d;
--color-danger-600: #991b1b;
--color-danger-500: #dc2626; /* Default danger */
--color-danger-400: #ef4444;
--color-danger-300: #fca5a5;
--color-danger-100: #fee2e2;

/* ─── INFO ─── */
--color-info-500: #0284c7;
--color-info-400: #0ea5e9;
--color-info-300: #38bdf8;
--color-info-100: #e0f2fe;
```

### 15.6 Crowd Density Colors (Semantic — 5 Levels)

```css
/* Crowd density is the most safety-critical semantic system */
--color-crowd-sparse: #059669; /* <30% capacity — Green — Safe */
--color-crowd-normal: #2563eb; /* 30-59% — Blue — Normal */
--color-crowd-elevated: #d97706; /* 60-79% — Amber — Monitor */
--color-crowd-high: #ea580c; /* 80-89% — Orange — Alert */
--color-crowd-critical: #dc2626; /* 90%+ — Red — Critical */

/* Background tints for zone cards */
--color-crowd-sparse-bg: rgba(5, 150, 105, 0.08);
--color-crowd-normal-bg: rgba(37, 99, 235, 0.08);
--color-crowd-elevated-bg: rgba(217, 119, 6, 0.1);
--color-crowd-high-bg: rgba(234, 88, 12, 0.12);
--color-crowd-critical-bg: rgba(220, 38, 38, 0.15);
```

### 15.7 Incident Severity Colors (4 Tiers + Unclassified)

```css
--color-incident-tier1: #dc2626; /* Tier 1: Life Safety — Red */
--color-incident-tier2: #ea580c; /* Tier 2: Serious — Orange */
--color-incident-tier3: #d97706; /* Tier 3: Moderate — Amber */
--color-incident-tier4: #2563eb; /* Tier 4: Minor — Blue */
--color-incident-none: #6b7280; /* Unclassified — Grey */

/* Incident tier backgrounds */
--color-incident-tier1-bg: rgba(220, 38, 38, 0.12);
--color-incident-tier2-bg: rgba(234, 88, 12, 0.1);
--color-incident-tier3-bg: rgba(217, 119, 6, 0.1);
--color-incident-tier4-bg: rgba(37, 99, 235, 0.08);
```

### 15.8 Live Status Colors

```css
/* Live / Realtime status indicators */
--color-live-active: #10b981; /* Connected, live data */
--color-live-polling: #f59e0b; /* Degraded, polling mode */
--color-live-disconnected: #6b7280; /* No realtime connection */
--color-live-critical: #ef4444; /* Critical alert, pulsing */
```

### 15.9 Surface and Glass Colors

```css
/* ─── GLASS SURFACES ─── */
--color-glass-ultralight: rgba(255, 255, 255, 0.02);
--color-glass-light: rgba(255, 255, 255, 0.04);
--color-glass-medium: rgba(255, 255, 255, 0.06);
--color-glass-strong: rgba(255, 255, 255, 0.09);
--color-glass-heavy: rgba(255, 255, 255, 0.12);

/* ─── OVERLAY COLORS ─── */
--color-overlay-light: rgba(0, 0, 0, 0.4);
--color-overlay-medium: rgba(0, 0, 0, 0.6);
--color-overlay-heavy: rgba(0, 0, 0, 0.8);
--color-overlay-modal: rgba(6, 9, 17, 0.9);

/* ─── BORDER COLORS ─── */
--color-border-subtle: rgba(255, 255, 255, 0.05);
--color-border-default: rgba(255, 255, 255, 0.08);
--color-border-emphasis: rgba(255, 255, 255, 0.12);
--color-border-strong: rgba(255, 255, 255, 0.18);
--color-border-primary: rgba(26, 117, 255, 0.4);
--color-border-ai: rgba(126, 34, 206, 0.4);
```

### 15.10 Gradient Library

```css
/* ─── NAMED GRADIENTS ─── */

/* Aurora — primary brand gradient */
--gradient-aurora: linear-gradient(135deg, #1a75ff 0%, #7e22ce 100%);

/* Horizon — background accent */
--gradient-horizon: linear-gradient(180deg, #0a0e1a 0%, #111827 100%);

/* AI Pulse — AI content accent */
--gradient-ai-pulse: linear-gradient(135deg, #5500d9 0%, #1a75ff 100%);

/* Danger Blaze — critical alert */
--gradient-danger: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);

/* Success Field — success state */
--gradient-success: linear-gradient(135deg, #059669 0%, #0284c7 100%);

/* Crowd Heatmap — density visualization */
--gradient-crowd-heatmap: linear-gradient(90deg, #059669 0%, #d97706 50%, #dc2626 100%);

/* Gold — trophy, achievement */
--gradient-gold: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);

/* Card Sheen — subtle card highlight */
--gradient-sheen: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 60%);

/* Sidebar — sidebar background gradient */
--gradient-sidebar: linear-gradient(180deg, #0e1220 0%, #0a0e1a 100%);
```

### 15.11 Light Mode Tokens (Secondary Theme)

```css
/* Light mode surfaces */
--color-surface-primary-light: #ffffff;
--color-surface-secondary-light: #f8fafc;
--color-surface-tertiary-light: #f1f5f9;
--color-surface-elevated-light: #ffffff;

/* Light mode text */
--color-text-primary-light: #0f172a;
--color-text-secondary-light: #475569;
--color-text-tertiary-light: #94a3b8;

/* Light mode borders */
--color-border-default-light: #e2e8f0;
--color-border-emphasis-light: #cbd5e1;
```

---

## 16. Typography System

### 16.1 Font Stack

| Role                             | Font           | Fallback                                      | Weight Range |
| -------------------------------- | -------------- | --------------------------------------------- | ------------ |
| **Primary (UI)**                 | Inter          | -apple-system, BlinkMacSystemFont, sans-serif | 300–700      |
| **Monospace (Data)**             | JetBrains Mono | 'Fira Code', 'Cascadia Code', monospace       | 400, 500     |
| **Display (Headings, optional)** | Cal Sans       | Inter, sans-serif                             | 600 only     |

**Why Inter:** Engineered for screen legibility at small sizes. Optical kerning at 12px. Tabular number variant (`font-feature-settings: "tnum"`) for numerical data alignment. Widely available via Google Fonts.

**Why JetBrains Mono:** Superior monospace for data display. Clear digit differentiation (0 vs O, 1 vs l). Fixed-width ensures all numerical data aligns perfectly in tables and dashboards.

### 16.2 Import Specification

```html
<!-- Google Fonts import -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

### 16.3 Heading Scale

```css
/* HEADING SCALE — 1.250 Major Third ratio */
--type-display-2xl: 4.5rem; /* 72px  — Hero headings (reports) */
--type-display-xl: 3.75rem; /* 60px  — Section hero */
--type-display-lg: 3rem; /* 48px  — Large module title */
--type-display-md: 2.25rem; /* 36px  — Health score number */
--type-h1: 1.875rem; /* 30px  — Page title */
--type-h2: 1.5rem; /* 24px  — Module heading */
--type-h3: 1.25rem; /* 20px  — Card heading */
--type-h4: 1.125rem; /* 18px  — Sub-section heading */
--type-h5: 1rem; /* 16px  — Widget title */
```

### 16.4 Body Scale

```css
--type-body-xl: 1.125rem; /* 18px — Large body text, AI summaries */
--type-body-lg: 1rem; /* 16px — Default body text */
--type-body-md: 0.9375rem; /* 15px — Secondary body text */
--type-body-sm: 0.875rem; /* 14px — UI labels, form fields */
--type-body-xs: 0.8125rem; /* 13px — Dense tables, code */
```

### 16.5 Caption and Label Scale

```css
--type-caption-lg: 0.75rem; /* 12px — Widget labels, timestamps */
--type-caption-md: 0.6875rem; /* 11px — Micro labels, status badges */
--type-caption-sm: 0.625rem; /* 10px — Footnotes (use sparingly) */
```

### 16.6 Numeric Typography (Dashboard Data)

All dashboard numbers use:

```css
font-family: 'JetBrains Mono', monospace;
font-feature-settings:
  'tnum' 1,
  'zero' 1; /* tabular nums + slashed zero */
font-variant-numeric: tabular-nums;
letter-spacing: -0.02em; /* tighter for large numbers */
```

**Size assignments:**

- Health Score (primary): `--type-display-md` (36px), weight 700
- Zone density %: `--type-h2` (24px), weight 700
- KPI values: `--type-h3` (20px), weight 600
- Table numbers: `--type-body-sm` (14px), weight 500
- Timestamps: `--type-caption-lg` (12px), weight 400

### 16.7 AI Typography

AI-generated text uses specific styling to visually differentiate it from system UI text:

```css
/* AI Content Typography */
.ai-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem; /* 15px — slightly larger than UI labels */
  line-height: 1.7; /* Generous — AI text is often dense */
  font-weight: 400;
  color: var(--color-base-100); /* Slightly softer than primary text */
  letter-spacing: 0;
}

/* AI Streaming Text — appears character by character */
.ai-streaming {
  /* No special styling — just the blinking cursor */
}

.ai-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: var(--color-ai-400);
  animation: blink 0.7s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 2px;
}
```

### 16.8 Line Heights

```css
--leading-none: 1;
--leading-tight: 1.25; /* Headings */
--leading-snug: 1.375; /* Sub-headings */
--leading-normal: 1.5; /* Default body */
--leading-relaxed: 1.625; /* Reading paragraphs */
--leading-loose: 1.75; /* AI content */
--leading-2x: 2; /* Spacious labels */
```

### 16.9 Letter Spacing

```css
--tracking-tighter: -0.05em; /* Large display headings */
--tracking-tight: -0.025em; /* H1, H2 */
--tracking-normal: 0em; /* Body */
--tracking-wide: 0.025em; /* Captions, labels */
--tracking-wider: 0.05em; /* ALL-CAPS labels */
--tracking-widest: 0.1em; /* Status badges, section headers */
```

---

## 17. Spacing System

### 17.1 Base Grid and Tokens

**Base unit:** 4px. All values are multiples of 4px.

```css
/* SPACING SCALE — 4pt base system */
--sp-0: 0px;
--sp-0.5: 2px; /* Hairline separation */
--sp-1: 4px; /* Micro — icon padding */
--sp-1.5: 6px; /* Tight labels */
--sp-2: 8px; /* Standard tight gap */
--sp-2.5: 10px;
--sp-3: 12px; /* Badge padding, small icon gaps */
--sp-3.5: 14px;
--sp-4: 16px; /* Standard gap — most common */
--sp-5: 20px; /* Card internal spacing */
--sp-6: 24px; /* Card padding — default */
--sp-7: 28px;
--sp-8: 32px; /* Section gap */
--sp-9: 36px;
--sp-10: 40px; /* Large section gap */
--sp-11: 44px; /* Minimum touch target */
--sp-12: 48px; /* Form field height */
--sp-14: 56px; /* Top navigation height */
--sp-16: 64px; /* Sidebar collapsed width */
--sp-20: 80px; /* Large spacing */
--sp-24: 96px;
--sp-28: 112px;
--sp-32: 128px;
```

### 17.2 Component Spacing Standards

| Component            | Padding   | Internal Gap | Between Components |
| -------------------- | --------- | ------------ | ------------------ |
| **Card (default)**   | 24px      | 16px         | 16px               |
| **Card (compact)**   | 16px      | 12px         | 12px               |
| **Card (dense)**     | 10px      | 8px          | 8px                |
| **Modal**            | 32px      | 20px         | —                  |
| **Form field**       | 12px 16px | —            | 12px               |
| **Button (default)** | 10px 20px | —            | 8px                |
| **Button (large)**   | 14px 28px | —            | 12px               |
| **Button (small)**   | 6px 12px  | —            | 6px                |
| **Table cell**       | 12px 16px | —            | —                  |
| **Sidebar item**     | 10px 16px | —            | 4px                |
| **Badge**            | 2px 8px   | —            | 4px                |

### 17.3 Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
--container-prose: 720px; /* Report reading width */
--container-dashboard: 1400px; /* Max content width */
```

---

## 18. Iconography

### 18.1 Icon Style

**Style:** Lucide Icons — 1.5px stroke, rounded line caps and joins, 24px × 24px base grid, optically balanced.

**Why Lucide:** Consistent stroke weight across all icons, open source, React package (`lucide-react`), matches the clean linear aesthetic of the design language. Works at all sizes from 12px to 48px without pixelation.

### 18.2 Icon Sizes

```css
--icon-xs: 12px; /* Inline text icons, status dots */
--icon-sm: 16px; /* Badge icons, dense table icons */
--icon-md: 20px; /* Default UI icons */
--icon-lg: 24px; /* Navigation icons, card icons */
--icon-xl: 32px; /* Empty state icons, feature icons */
--icon-2xl: 48px; /* Hero empty state illustrations */
--icon-3xl: 64px; /* Onboarding illustrations */
```

### 18.3 Icon Assignments by Domain

| Icon              | Lucide Name    | Domain      | Usage                  |
| ----------------- | -------------- | ----------- | ---------------------- |
| `LayoutDashboard` | command-center | Module nav  | Command Center         |
| `Users`           | crowd          | Module nav  | Crowd Intelligence     |
| `AlertTriangle`   | incident       | Module nav  | Incidents              |
| `Package`         | resource       | Module nav  | Resources              |
| `Bus`             | transport      | Module nav  | Transportation         |
| `BarChart2`       | reports        | Module nav  | Reports                |
| `Brain`           | ai             | AI features | AI content blocks      |
| `Zap`             | alert          | Critical    | Tier 1 incidents       |
| `Activity`        | live           | Status      | Live data indicator    |
| `ThumbsUp`        | accept         | AI          | Accept recommendation  |
| `ThumbsDown`      | dismiss        | AI          | Dismiss recommendation |
| `RefreshCw`       | regenerate     | AI          | Regenerate AI content  |
| `Shield`          | security       | Resource    | Security staff         |
| `Heart`           | medical        | Resource    | Medical personnel      |
| `Fire`            | fire           | Resource    | Fire safety            |
| `MapPin`          | location       | Crowd       | Zone location          |
| `TrendingUp`      | trend-up       | Data        | Positive trend         |
| `TrendingDown`    | trend-down     | Data        | Negative trend         |
| `CheckCircle`     | resolved       | Status      | Resolved incident      |
| `Clock`           | time           | Data        | Timestamps             |
| `ChevronRight`    | expand         | Navigation  | Expand detail          |
| `Download`        | export         | Action      | PDF export             |
| `Bell`            | notification   | Alert       | Notification bell      |
| `Command`         | command-k      | Navigation  | Command palette        |

---

## 19. Illustration Style

### 19.1 Style Definition

Illustrations use a **minimal geometric vector style** — simple shapes, 2-3 color palette drawn from the design system, no photographic elements, no clip art, no gradients that look like consumer apps.

All illustrations are:

- Line-based, 1.5px stroke matching icon language
- Single-color or 2-color with 60/30/10 proportion rule
- On transparent backgrounds (layer over dark surfaces)
- Animated with subtle idle loops (Lottie-compatible)

### 19.2 Empty State Illustrations

| State                 | Illustration                      | Colors               |
| --------------------- | --------------------------------- | -------------------- |
| No incidents          | Stadium interior, calm, no alerts | Primary blue on dark |
| No crowd data         | Empty seats, concentric arcs      | Blue + subtle grey   |
| No resources assigned | Empty grid, dotted outlines       | Blue + ghost fill    |
| No reports generated  | Document outline + AI spark       | Violet + blue        |
| Realtime disconnected | Cloud with broken WiFi arc        | Warning amber        |
| AI unavailable        | Brain outline, greyed             | Grey + subtle violet |

### 19.3 Onboarding Illustrations

Used in the first-login experience modal:

1. **Stadium Command Center** — Bird's eye view of stadium with data overlay lines
2. **AI Copilot** — Abstract brain with data streams
3. **Live Data** — Multiple screens showing synchronized data
4. **Human Approval** — Human hand + AI output with checkmark

---

## 20. Component Library

### 20.1 Button System

**5 Variants × 4 Sizes × 5 States = 100 button configurations**

#### Variants

| Variant         | Background             | Text                  | Border                   | Usage                       |
| --------------- | ---------------------- | --------------------- | ------------------------ | --------------------------- |
| **Primary**     | `--color-primary-600`  | white                 | none                     | Single primary CTA per view |
| **Secondary**   | `--color-glass-medium` | `--color-primary-400` | `--color-border-primary` | Secondary actions           |
| **Ghost**       | transparent            | `--color-base-200`    | `--color-border-default` | Tertiary actions            |
| **Destructive** | `--color-danger-500`   | white                 | none                     | Delete, close incident      |
| **AI**          | gradient: AI Pulse     | white                 | none                     | AI-triggered actions        |

#### Sizes

```css
.btn-sm {
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  border-radius: 6px;
}
.btn-md {
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  border-radius: 8px;
}
.btn-lg {
  height: 48px;
  padding: 0 28px;
  font-size: 15px;
  border-radius: 10px;
}
.btn-xl {
  height: 56px;
  padding: 0 36px;
  font-size: 16px;
  border-radius: 12px;
}
```

#### States

- **Default** — Base appearance
- **Hover** — Background lightens 8%, scale: 1.02 (spring, 150ms)
- **Active/Pressed** — Scale: 0.97 (spring, 80ms)
- **Focus** — 3px outline, `--color-primary-400`, 2px offset
- **Disabled** — 40% opacity, no pointer events, no hover effects
- **Loading** — Left-side spinner, text remains, prevents double-click

#### Button Anatomy

```
[Leading Icon?] [Label Text] [Trailing Icon?]
   16px gap      ─────────     16px gap
```

#### Magnetic Button Effect (Primary and AI variants only)

On hover within 80px radius of button center, the button follows the cursor with `transform: translate()` — max 6px displacement. This is a premium micro-interaction used exclusively for the 2 highest-priority CTAs on any page. Implementation: `requestAnimationFrame`, `mousemove` event.

---

### 20.2 Card Design System

**Anatomy of every card:**

```
┌─ CARD ─────────────────────────────────────────────────────────┐
│  [Card Header]                                                 │
│  Icon  Title  (optional: subtitle)           [Action Button]  │
│  ──────────────────────────────────────────────────────────── │
│  [Card Body]                                                   │
│  Primary content                                               │
│  ──────────────────────────────────────────────────────────── │
│  [Card Footer] (optional)                                      │
│  Timestamp / Status / Secondary action                         │
└─────────────────────────────────────────────────────────────────┘
```

**Card base styles:**

```css
.card {
  background: var(--color-base-750);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 24px;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease;
}
.card:hover {
  border-color: var(--color-border-emphasis);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
}
```

**Card elevation lift on hover:**

```css
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.32);
}
```

#### KPI Card

```
┌─ KPI CARD ──────────────────────────────┐
│  📊  Open Incidents                     │
│                                         │
│       12                               │
│    ─────────                            │
│    ↑ 3 from last hour                  │
│                                         │
│  ████████░░  78%                       │
└─────────────────────────────────────────┘
```

- Primary number: 36px JetBrains Mono, bold
- Delta indicator: trend arrow + color (green up = good or red up = bad, context-aware)
- Sparkline: 40px height, last 60 data points, 1px stroke

#### AI Recommendation Card

```
┌─ AI CARD ───────────────────────────────────────────── ⬡ ──┐
│  ⬡ Response Recommendation          [●●●] 84% Confidence  │
│  ──────────────────────────────────────────────────────── │
│                                                            │
│  IMMEDIATE ACTIONS                                         │
│  1. Dispatch 2 medical staff to Zone C, Gate 3            │
│  2. Clear pedestrian path: Block C → Medical Bay          │
│  3. Notify security to manage crowd around incident       │
│                                                            │
│  ──────────────────────────────────────────────────────── │
│  ⚑ Priority: High · Based on: 3 active incidents, 91%    │
│    crowd density in Zone C                                 │
│  ──────────────────────────────────────────────────────── │
│  [✓ Accept]                              [✕ Dismiss ▾]   │
└─────────────────────────────────────────────────────────────┘
```

- **Left border:** 2px gradient (AI Pulse) — the AI mark
- **Background:** subtle violet tint (`rgba(126, 34, 206, 0.04)`)
- **Header icon:** `Brain` with violet glow
- **Confidence indicator:** 3-dot ring (filled = confidence level) + percentage
- **Footer:** data sources that informed the recommendation
- **Action row:** Accept = primary blue ghost, Dismiss = destructive ghost

#### Incident Card (List Item)

```
┌─ INCIDENT CARD ─────────────────────────────────────────────────┐
│  🔴 TIER 1    [ACTIVE]                              20:14:32    │
│  Medical Emergency — Zone C, Gate 3                             │
│  ─────────────────────────────────────────────────────────────  │
│  Reported by: J. Rodriguez  ·  AI: Medical (89%)  ·  2 actions │
└─────────────────────────────────────────────────────────────────┘
```

- Left accent bar: colored per tier (Red/Orange/Amber/Blue)
- Status badge: pill (ACTIVE/MONITORING/RESOLVED/CLOSED)
- AI classification: shown if available, with confidence percentage
- Tap/click anywhere → Incident Detail Drawer

#### Resource Card

```
┌─ RESOURCE CARD ────────────────────────────────────────────────┐
│  🟢 Available  EMT Unit 4                     Zone C           │
│  Medical · 4 staff · Last updated 20:10                       │
└─────────────────────────────────────────────────────────────────┘
```

#### Notification Card (Toast)

```
┌─────────────────────────────────────────────────────────────────┐
│  🔴 Critical Alert                                        ✕   │
│  Crowd density in Zone C reached 92%. Immediate action needed. │
│  ──────────────────────────────────────────────────────────── │
│  [View Zone] [Dismiss]                               20:14:56  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 20.3 Data Tables

**Default table specifications:**

```css
/* Table container */
.table-container {
  border-radius: 12px;
  border: 1px solid var(--color-border-default);
  overflow: hidden;
}

/* Header row */
.table-header {
  background: var(--color-base-800);
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-base-300);
}

/* Body row */
.table-row {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-subtle);
  font-size: 14px;
  transition: background 150ms ease;
}
.table-row:hover {
  background: var(--color-glass-light);
}
.table-row:last-child {
  border-bottom: none;
}
```

**Column types:**

- **Status column:** Colored pill badge, not text
- **Number column:** Right-aligned, JetBrains Mono, tabular nums
- **Timestamp column:** Right-aligned, caption size
- **Action column:** Visible on hover only (icon buttons appear on row hover)

---

### 20.4 Form System

**Input field:**

```css
.input {
  height: 44px;
  padding: 0 16px;
  background: var(--color-base-800);
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  color: var(--color-base-50);
  font-size: 14px;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}
.input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(26, 117, 255, 0.15);
  outline: none;
}
.input::placeholder {
  color: var(--color-base-400);
}
```

**Textarea (for incident description):**

- Min-height: 120px, auto-expands up to 320px
- Character count shown in bottom-right (with warning at 90% of limit)
- Spell-check: enabled

**Select dropdown:**

- Custom styled, not browser native
- Arrow indicator rotates 180° when open
- Options list: glass surface, 12px border-radius, max-height 240px with scroll

**Switch toggle:**

```
OFF: [○    ] — grey track, white knob left
ON:  [    ○] — primary-blue track, white knob right
Transition: spring physics, 200ms
```

---

### 20.5 Status Chips and Badges

**Status Badge (pill):**

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.badge-live {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
}
.badge-active {
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
}
.badge-warning {
  background: rgba(245, 158, 11, 0.12);
  color: #fcd34d;
}
.badge-blue {
  background: rgba(26, 117, 255, 0.12);
  color: #80b3ff;
}
.badge-grey {
  background: rgba(107, 114, 128, 0.12);
  color: #9ca3af;
}
```

**Live Status Dot:**

```css
.status-dot-live {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-live-active);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pulse-ring 2s ease-out infinite;
}
@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
```

---

### 20.6 Modal and Dialog System

**Standard Modal:**

- Max-width: 560px
- Background: `var(--color-base-800)` + backdrop blur(40px)
- Border: 1px `--color-border-emphasis`
- Border-radius: 20px
- Padding: 32px
- Entry animation: `scale(0.95) → scale(1)` + `opacity: 0 → 1`, spring, 250ms
- Exit animation: `scale(0.97) → scale(0.95)` + `opacity: 1 → 0`, 150ms

**Full-Screen Modal (Shift Handover, Executive Summary):**

- 90vw × 90vh, centered
- Scrollable content area
- Fixed header + footer

**Drawer (Right Panel — Incident Detail):**

- Width: 560px (desktop), 100vw (mobile)
- Slides in from right: `translateX(100%) → translateX(0)`, spring, 300ms
- Backdrop: dark overlay, click to close
- Sticky action bar at bottom

---

## 21. Data Visualization

### 21.1 Chart Philosophy

All charts in ArenaMind AI follow the **Signal, Not Decoration** principle:

- Every chart answers a single operational question
- Chart chrome (axes, grids, labels) is minimal — just enough to interpret
- Data labels are included when precision matters
- Animation on data load is 600ms ease-out, not distracting

**Chart library:** Recharts (React-native, composable) with custom theme.

### 21.2 Stadium Zone Heatmap

The most visually distinctive element in the product — a top-down stadium SVG with zones colored by crowd density.

```
Specs:
- SVG-based stadium outline (Al Bayt, Lusail, MetLife, etc.)
- Zones: 8-24 named zones per stadium
- Zone fill: interpolated color from crowd density scale
- Zone hover: tooltip with zone name + density % + fan count + capacity
- Zone click: opens Zone Detail right panel
- Update animation: color transitions over 3s (smooth interpolation, not hard jump)
- Legend: horizontal density color scale at bottom
- Empty state: monochrome stadium outline with "No crowd data" overlay
```

**Color mapping:**

```
0-29%  → #059669 (Green)
30-59% → #2563EB (Blue)
60-79% → #D97706 (Amber)
80-89% → #EA580C (Orange)
90%+   → #DC2626 (Red, pulsing border on the zone)
```

### 21.3 Crowd Trend Area Chart

- Type: Area chart (filled below the line)
- X-axis: Time (15-minute intervals)
- Y-axis: Crowd count (with % scale on right axis)
- Colors: Gradient fill matching crowd density level at each data point
- Threshold line: Horizontal dashed line at stadium safe capacity
- Hover: Crosshair + tooltip with exact values
- Data range: Last 3 hours, updating in real-time

### 21.4 KPI Sparklines

- Width: 80px, Height: 40px
- Stroke: 1.5px, `--color-primary-400`
- Area fill: 20% opacity gradient
- No axes, no labels — context is the surrounding KPI card
- Last value: emphasized dot (4px radius)

### 21.5 Incident Tier Donut

- 120px diameter, 14px stroke
- 4 segments: Tier 1-4, colored by severity
- Center: Total incident count (large) / "Incidents" (small caption)
- Legend: Vertical list to the right, tier names + counts

### 21.6 Resource Coverage Bar Chart

- Horizontal bars per zone
- Bar color: matches deployment status (green = adequate, amber = low, red = critical)
- Bar shows: Deployed / Recommended ratio
- Sorted by criticality (lowest coverage first)
- Background: subtle row striping (alternating 0% / 2% white)

### 21.7 Phase Timeline

- Horizontal timeline at the bottom of the Command Center (optional)
- Phases as labeled segments with elapsed time
- Current phase: highlighted with animated shimmer
- Predicted end time: ghost segment showing estimated duration

---

## 22. Motion Design

### 22.1 Motion Philosophy

**Purpose-driven motion only.** Every animation must serve one of these functions:

1. **Provide orientation** — show where something came from or where it went
2. **Communicate state** — show that something is loading, active, or complete
3. **Acknowledge action** — confirm that an interaction was registered
4. **Guide attention** — direct focus to a new or changed element

Motion that is purely decorative and serves none of these purposes is **prohibited**.

### 22.2 Spring Configurations

```javascript
// Framer Motion spring configs

const springs = {
  // Fast, precise — button presses, badges
  micro: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },

  // Snappy — card hover, tab switches
  snappy: { type: 'spring', stiffness: 350, damping: 25, mass: 0.8 },

  // Default — modals, panels, cards
  smooth: { type: 'spring', stiffness: 260, damping: 20, mass: 1 },

  // Gentle — page transitions, drawer
  gentle: { type: 'spring', stiffness: 200, damping: 26, mass: 1.2 },

  // Bouncy — success animations, health score
  bouncy: { type: 'spring', stiffness: 300, damping: 15, mass: 0.8 },
};
```

### 22.3 Duration Tokens

```css
--duration-instant: 50ms; /* Hover color changes */
--duration-micro: 100ms; /* Button press, badge update */
--duration-fast: 150ms; /* Tab switch, dropdown open */
--duration-normal: 200ms; /* Most transitions */
--duration-moderate: 300ms; /* Modal/drawer entry */
--duration-slow: 400ms; /* Page transition */
--duration-long: 600ms; /* Chart data load */
--duration-dramatic: 800ms; /* Health score change, splash */
```

### 22.4 Easing Curves

```css
--ease-linear: cubic-bezier(0, 0, 1, 1);
--ease-standard: cubic-bezier(0.2, 0, 0, 1); /* Material standard */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1); /* Items entering */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1); /* Items leaving */
--ease-sharp: cubic-bezier(0.4, 0, 0.6, 1); /* Quick transitions */
--ease-spring-out: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot */
```

### 22.5 Page Transition

**Route change:** Content area fades out (150ms, ease-accelerate) → new content fades in (200ms, ease-decelerate) with a 4px translateY from below. Sidebar and top nav are not animated — they are persistent.

```javascript
// Framer Motion page wrapper
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
};
```

### 22.6 Micro-Interaction Specifications

| Interaction         | Animation                                | Duration | Spring |
| ------------------- | ---------------------------------------- | -------- | ------ |
| Button hover        | scale(1.02), brightness(1.05)            | —        | micro  |
| Button press        | scale(0.97)                              | —        | micro  |
| Card hover          | translateY(-2px), shadow increase        | 200ms    | snappy |
| Tab switch          | Underline slides to new position         | 200ms    | snappy |
| Modal open          | scale(0.95→1), opacity(0→1)              | —        | smooth |
| Modal close         | scale(1→0.97), opacity(1→0)              | 150ms    | —      |
| Drawer open         | translateX(100%→0)                       | —        | gentle |
| Drawer close        | translateX(0→100%)                       | 250ms    | —      |
| Notification in     | translateY(-100%→0), opacity(0→1)        | —        | smooth |
| Notification out    | opacity(1→0), translateX(100%)           | 200ms    | —      |
| Badge count update  | scale(1→1.3→1)                           | —        | bouncy |
| Health score change | Number ticks through intermediate values | 800ms    | bouncy |
| Zone color change   | Color interpolation                      | 3000ms   | linear |
| AI thinking         | Pulsing gradient animation               | infinite | —      |
| AI content reveal   | Streaming text, typewriter               | per-char | —      |
| Success checkmark   | Path draw animation                      | 400ms    | —      |
| Sidebar toggle      | width(64→240px)                          | —        | smooth |
| Command palette     | scale(0.98→1), opacity(0→1)              | —        | snappy |
| Switch toggle       | knob translateX                          | —        | micro  |
| Number change       | Count-up animation                       | 600ms    | —      |
| Realtime data       | Subtle flash on cell                     | 300ms    | —      |

### 22.7 AI Thinking Animation

Three-phase animation cycle when Gemini is processing:

**Phase 1 — Collecting (0-500ms):** Three horizontal dots appear sequentially (staggered 100ms), color: `--color-ai-400`.

**Phase 2 — Processing (500ms-ongoing):** Dots merge into a single pulsing ring (40px diameter). Inner ring rotates, outer ring pulses. Gradient: AI Pulse. The ring has a shimmer effect that travels clockwise at 1.5s interval.

**Phase 3 — Formulating (final 300ms before content appears):** Ring expands to content width, dissolves into text area where streaming begins.

```css
/* Phase 2 — Processing ring */
.ai-thinking-ring {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: conic-gradient(
    from 0deg,
    var(--color-ai-600),
    var(--color-primary-600),
    var(--color-ai-600)
  );
  animation: spin 1.5s linear infinite;
}
```

### 22.8 Streaming Text Animation

AI-generated text appears character by character, but **batched in 4-8 character chunks** for performance (not truly character-by-character in DOM).

- Batch reveal interval: 30ms
- Cursor: blinking violet line (`|`)
- Sentence completion: brief pause (150ms) before next sentence
- Paragraph breaks: 300ms pause
- On completion: cursor fades out (200ms), "Generated at [time]" fades in

### 22.9 Realtime Data Update Animation

When new data arrives via Supabase Realtime:

- If the change is **significant** (±5% density, new incident): Yellow-green flash on the affected element, 300ms fade-out
- If the change is **minor** (small count change): Silent update, no animation
- Zone heatmap: Color interpolation from current → new over 3 seconds (linear)

### 22.10 Reduced Motion Support

All animations respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Remove transitions and animations */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Keep data-critical state transitions */
  .data-flash {
    background-color: var(--color-warning-300);
  }
}
```

For Framer Motion:

```javascript
import { useReducedMotion } from 'framer-motion';
const shouldReduceMotion = useReducedMotion();
const animation = shouldReduceMotion ? { opacity: [0, 1] } : { opacity: [0, 1], y: [8, 0] };
```

---

## 23. Glassmorphism & Depth

### 23.1 Glass Usage Philosophy

Glass is used **sparingly and purposefully** — only on overlaying surfaces (modals, tooltips, command palette, floating panels). Overuse of glass removes its premium quality. The rule: glass is reserved for elements that float above the content.

### 23.2 Blur Scale

```css
--blur-xs: 4px; /* Subtle tooltip background tinting */
--blur-sm: 8px; /* Notification toasts */
--blur-md: 16px; /* Panel overlays */
--blur-lg: 24px; /* Modals, command palette */
--blur-xl: 32px; /* Full-screen overlays */
--blur-2xl: 48px; /* Maximum glass effect */
```

### 23.3 Elevation Token System

```css
/* Elevation scale — expressed as shadow + background shift */

--elevation-0: none; /* Base — page background */

--elevation-1:                                       /* Cards */
  0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.24);

--elevation-2:                                       /* Raised cards */
  0 4px 12px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.16);

--elevation-3:                                       /* Dropdowns, tooltips */
  0 8px 24px rgba(0, 0, 0, 0.32), 0 4px 8px rgba(0, 0, 0, 0.2);

--elevation-4:                                       /* Modals */
  0 16px 48px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.24);

--elevation-5:                                       /* Command palette */
  0 32px 80px rgba(0, 0, 0, 0.48), 0 16px 32px rgba(0, 0, 0, 0.32);
```

### 23.4 Glow Language

**AI Glow** — Used on AI content blocks and the AI badge:

```css
.ai-glow {
  box-shadow:
    0 0 0 1px rgba(126, 34, 206, 0.2),
    0 0 20px rgba(126, 34, 206, 0.1),
    0 0 40px rgba(126, 34, 206, 0.06);
}
```

**Alert Glow** — Used on Tier 1 incident cards:

```css
.alert-glow {
  box-shadow:
    0 0 0 1px rgba(220, 38, 38, 0.3),
    0 0 20px rgba(220, 38, 38, 0.15),
    0 0 40px rgba(220, 38, 38, 0.08);
  animation: alert-pulse 2s ease-in-out infinite;
}
@keyframes alert-pulse {
  0%,
  100% {
    box-shadow:
      0 0 0 1px rgba(220, 38, 38, 0.3),
      0 0 20px rgba(220, 38, 38, 0.15);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(220, 38, 38, 0.5),
      0 0 30px rgba(220, 38, 38, 0.25);
  }
}
```

**Success Glow** — Used on completed actions:

```css
.success-glow {
  box-shadow:
    0 0 0 1px rgba(5, 150, 105, 0.2),
    0 0 16px rgba(5, 150, 105, 0.12);
}
```

**Primary Glow** — Used on focus states and active navigation items:

```css
.primary-glow {
  box-shadow:
    0 0 0 1px rgba(26, 117, 255, 0.25),
    0 0 16px rgba(26, 117, 255, 0.12);
}
```

### 23.5 Depth Hierarchy Diagram

```
Z-INDEX DEPTH LAYERS
════════════════════════════════════════════════

Layer 0 (z-0)     Page background, decorative elements
Layer 10 (z-10)   Card hover elevations
Layer 20 (z-20)   Sticky table headers
Layer 30 (z-30)   Fixed top navigation, sidebar
Layer 40 (z-40)   Dropdowns, popovers, tooltips
Layer 50 (z-50)   Context panels (right drawer)
Layer 60 (z-60)   Notification toasts
Layer 70 (z-70)   Modals and dialogs
Layer 80 (z-80)   Modal overlays / backdrops
Layer 90 (z-90)   Command palette
Layer 100 (z-100) Critical alerts (full-screen Tier 1)
Layer 999 (z-999) Debug overlay, onboarding

```

---

## 24. AI Experience Design

### 24.1 AI Interaction Model Summary

The AI experience in ArenaMind AI is built on these interaction truths:

1. **AI never talks first in a chat sense** — it presents conclusions, not conversations
2. **Every AI output is anchored to data** — "Based on current crowd data..."
3. **Confidence is always visible** — never hide uncertainty
4. **Human decision is the exit condition** — every AI block ends with Accept/Dismiss
5. **AI failure is graceful** — the block shows a fallback state, not a broken UI

### 24.2 AI Status States

| State               | Visual                      | Copy                                                              |
| ------------------- | --------------------------- | ----------------------------------------------------------------- |
| **Ready**           | Grey brain icon             | "Ready to analyze"                                                |
| **Thinking**        | Animated violet ring        | "Analyzing operational data..."                                   |
| **Streaming**       | Text appearing + cursor     | Text streams character-by-character                               |
| **Complete**        | Content visible + timestamp | "Generated at [time]"                                             |
| **Error — Timeout** | Orange warning icon         | "AI analysis timed out. Operational data is accurate."            |
| **Error — Parse**   | Red error icon              | "AI returned an unexpected response. Try again."                  |
| **Rate Limited**    | Clock icon                  | "AI requests are cooling down. Available in [N] minutes."         |
| **Stale**           | Grey clock                  | "Analysis from [time]. May not reflect latest data." [Regenerate] |
| **Unavailable**     | Strikethrough brain         | "AI temporarily unavailable. All data features remain active."    |

### 24.3 Confidence Indicator Design

Three visual representations of AI confidence, used together:

**1. Confidence Ring (Primary):**
A circular ring (24px diameter, 3px stroke) that fills clockwise to the confidence percentage. Color coding:

- ≥0.80: `--color-success-400` (green)
- 0.60-0.79: `--color-warning-400` (amber)
- <0.60: `--color-danger-400` (red)

**2. Confidence Bar (Within expanded panel):**
A horizontal bar (full width of panel, 4px height) showing confidence percentage with gradient fill.

**3. Confidence Label:**
Percentage as text (e.g., "87%") in JetBrains Mono, 13px, next to the ring.

### 24.4 AI Reasoning Panel

Accessible by clicking the confidence indicator — expands a panel below the AI content:

```
┌─ AI REASONING ──────────────────────────────────────────────────┐
│  Data Points Analyzed                                           │
│  • Crowd density: Zone C = 91%, Zone B = 67%, Zone D = 54%    │
│  • Active incidents: 2 Tier-2, 0 Tier-1                       │
│  • Available medical resources: 3 units, 2 in Zone D          │
│  • Current phase: Match Live (minute 73)                       │
│                                                                 │
│  Reasoning                                                      │
│  Zone C is approaching critical density. Two medical incidents │
│  in adjacent zones suggest crowd pressure points near gates    │
│  3 and 4. Resource Unit 4 is closest (Zone D) and available.  │
│                                                                 │
│  Model: gemini-2.0-flash · Tokens: 1,247 · Latency: 2.3s     │
│  Prompt version: incident-recommend-v1.2                       │
└─────────────────────────────────────────────────────────────────┘
```

### 24.5 Human Approval Workflow UX

**Step 1 — Recommendation displayed:**
Accept (primary blue ghost) and Dismiss (low-prominence grey ghost) always visible.

**Step 2a — Accept:**
Button shows loading state (spinner). PATCH fires. On success: button changes to "✓ Accepted by [Name]" badge (green). Dismiss button disappears. Audit timestamp shown.

**Step 2b — Dismiss:**
Dismiss dropdown opens: pre-set reasons (Not applicable / Resources unavailable / Already handled / Other). On selection: card collapses with slide-up animation. Brief toast: "Recommendation dismissed."

**Step 3 — Post-acceptance guidance:**
If the recommendation involves an action (e.g., "redeploy Resource Unit 4 to Zone C"), a subtle blue info banner appears below the accepted card:

> "To complete this recommendation, go to Resources → Resource Unit 4 → Update Location"

This reinforces the architectural principle: accepting ≠ executing.

### 24.6 AI Feedback Collection

After 10 minutes of accepting a recommendation, a non-intrusive micro-survey appears at the bottom of the recommendation card:

```
Was this recommendation helpful?
[👍]  [👎]
```

Clicking 👍: Brief thank-you, disappears. Clicking 👎: small text input "What was wrong?" → submit → disappears.

This data is stored in `ai_recommendations.feedback_rating` for prompt iteration.

---

## 25. State Design

### 25.1 Empty States

Every empty state must:

1. Explain what the empty state means operationally
2. Provide context on when data will appear
3. Offer a primary action where appropriate
4. Use a calm, minimal illustration (not stock art)

**Empty State Template:**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│          [Geometric Illustration — 64px]        │
│                                                 │
│           No incidents recorded                 │
│                                                 │
│    Match operations are running smoothly.       │
│    New incidents will appear here as they       │
│    are reported.                                │
│                                                 │
│         [+ Create Incident]                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 25.2 Error States

**Module-level error (data unavailable):**

```
┌─────────────────────────────────────────────────┐
│  ⚠  Unable to load crowd data                  │
│                                                 │
│  Connection to the data source was interrupted. │
│  Your last update was 2 minutes ago.            │
│                                                 │
│  [↻ Retry]     [View cached data]              │
└─────────────────────────────────────────────────┘
```

**AI-specific error (non-breaking):**

```
┌─ AI ANALYSIS ─────────────────────────────────── ⬡ ──┐
│  AI analysis temporarily unavailable.               │
│  Operational data below remains accurate.           │
│                                                     │
│  [↻ Retry analysis]              Last attempt 2m ago │
└─────────────────────────────────────────────────────┘
```

### 25.3 Loading States — Skeleton Loaders

All loading states use skeleton loaders — animated grey-to-lighter grey shimmer:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-base-750) 25%,
    var(--color-base-700) 50%,
    var(--color-base-750) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

**Skeleton dimensions match exact content:**

- Card title: 60% width, 20px height
- Card body text: 100%, 80%, 90% width lines, 14px height, 8px gap
- KPI number: 40% width, 36px height
- Chart: full width, fixed height box with shimmer
- Table rows: 3 skeleton rows visible before data loads

### 25.4 Success States

**Action success toast:**

- Green checkmark draws with path animation (400ms)
- Message: "[Action completed] at [time]"
- Auto-dismiss: 4 seconds
- Position: top-right, below notification area

**Form success:**

- Form slides out with opacity fade
- Success state slides in with checkmark
- Auto-redirect to relevant view after 1.5 seconds

### 25.5 AI Thinking States (Progressive)

Three visible phases as described in Section 22.7:

**0s:** "⬡ Analyzing operational data..." + three-dot fade-in animation
**0.5s:** Pulsing violet ring, "Processing match context..."
**2s+:** Ring stabilizes, "Formulating recommendation..."
**Content ready:** Ring dissolves into text area. Streaming begins.

### 25.6 Progress Bars and Step Indicators

**Phase Change Confirmation (multi-step):**

```
Step 1 of 2 — Confirm Phase Change
[●────────────────○]

Select new phase:
[Pre-Event] [Gate Opening] [Fan Arrival] [Match Live ●] [Halftime] ...

[Cancel]  [Next →]
```

**Report Generation Progress:**

```
Generating Executive Summary...

Collecting match data   ████████████████████ ✓
Analyzing incidents     ████████████████████ ✓
Processing crowd data   █████████████░░░░░░░ 65%
Formulating summary     ░░░░░░░░░░░░░░░░░░░░ Waiting...
```

---

## 26. Accessibility

### 26.1 WCAG 2.2 AA Compliance Requirements

All interactive elements must meet:

- **Text contrast:** 4.5:1 minimum (body text), 3:1 minimum (large text/UI components)
- **Focus indicators:** 3:1 contrast ratio vs. adjacent color, 2px minimum area
- **Touch targets:** 44×44px minimum for all interactive elements
- **No color alone:** Every status must use both color AND shape/icon/text
- **Motion:** All animations disable with `prefers-reduced-motion: reduce`

### 26.2 Color Contrast Matrix

| Element        | Foreground | Background           | Ratio | Pass   |
| -------------- | ---------- | -------------------- | ----- | ------ |
| Body text      | `#D8DCE8`  | `#111827`            | 7.2:1 | ✅ AAA |
| Secondary text | `#8B93B0`  | `#111827`            | 4.6:1 | ✅ AA  |
| Primary button | `#FFFFFF`  | `#005CE6`            | 5.1:1 | ✅ AA  |
| Danger badge   | `#FCA5A5`  | rgba(220,38,38,0.12) | 4.8:1 | ✅ AA  |
| AI text        | `#F0F2F8`  | `#161B2C`            | 8.1:1 | ✅ AAA |
| Disabled text  | `#8B93B0`  | `#111827`            | 4.6:1 | ✅ AA  |

### 26.3 Keyboard Navigation Map

```
Tab/Shift+Tab     → Move between interactive elements
Enter/Space       → Activate focused element
Escape            → Close topmost overlay
Arrow keys        → Navigate within menus, tables, tab groups
⌘K / Ctrl+K      → Open command palette
⌘1-6             → Navigate to module 1-6
N                 → New Incident (when not in input)
H                 → Open Shift Handover
A                 → Generate AI Summary
[                 → Toggle sidebar
]                 → Open right context panel
```

### 26.4 Focus Indicator Specification

```css
/* Global focus style — NOT browser default */
:focus-visible {
  outline: 2px solid var(--color-primary-400);
  outline-offset: 3px;
  border-radius: 4px; /* Match element border-radius */
}

/* AI element focus */
.ai-element:focus-visible {
  outline: 2px solid var(--color-ai-400);
  outline-offset: 3px;
}
```

Focus order must be logical (top-left → bottom-right), and every interactive element must be reachable via keyboard.

### 26.5 Screen Reader Requirements

- All icons have `aria-label` or `aria-hidden` (decorative)
- All charts have `aria-description` with the key insight in text
- All status badges have `role="status"` and descriptive `aria-label`
- The health score gauge has `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- All modals have `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- The command palette has `role="combobox"` with proper ARIA
- Live realtime updates use `aria-live="polite"` regions for non-critical, `assertive` for Tier 1 alerts

### 26.6 High Contrast Mode

```css
@media (forced-colors: active) {
  /* Override glass backgrounds with system colors */
  .card {
    background: Canvas;
    border: 1px solid ButtonText;
  }
  .badge-live {
    background: Highlight;
    color: HighlightText;
  }
  .btn-primary {
    background: ButtonFace;
    color: ButtonText;
    border: 1px solid ButtonText;
  }
  .status-dot-live {
    background: Highlight;
  }
}
```

### 26.7 Color-Blind Safe Design

All crowd density and incident severity states use:

- **Color** (primary differentiator)
- **Icon** (secondary differentiator)
- **Text label** (always present)

This ensures accessibility for:

- Deuteranopia (red-green): Icons differentiate
- Protanopia (red deficiency): Blue-amber used instead of red-green for crowd levels
- Tritanopia (blue-yellow): Shape/icon backup

### 26.8 Accessible Charts

All charts include:

- **`<figcaption>`** with a text description of the chart's key insight
- **Data table** accessible as a visually hidden alternative (`sr-only` class)
- **Color + pattern** for line/bar differentiation (no color-only)
- **Focus-navigable** data points (keyboard users can tab through data points and hear values)

---

## 27. Design Token System

### 27.1 Complete Token Specification

```css
/* ─── BORDER RADIUS ─── */
--radius-none: 0px;
--radius-xs: 4px; /* Small badges, inputs */
--radius-sm: 6px; /* Buttons, small cards */
--radius-md: 8px; /* Standard buttons */
--radius-lg: 12px; /* Cards, panels */
--radius-xl: 16px; /* Large cards, modals */
--radius-2xl: 20px; /* Modals, command palette */
--radius-3xl: 24px; /* Full panels */
--radius-full: 9999px; /* Pill badges, avatar */

/* ─── OPACITY ─── */
--opacity-0: 0;
--opacity-5: 0.05;
--opacity-10: 0.1;
--opacity-20: 0.2;
--opacity-30: 0.3;
--opacity-40: 0.4;
--opacity-50: 0.5;
--opacity-60: 0.6;
--opacity-70: 0.7;
--opacity-80: 0.8;
--opacity-90: 0.9;
--opacity-100: 1;
--opacity-disabled: 0.4;

/* ─── Z-INDEX ─── */
--z-below: -1;
--z-base: 0;
--z-raised: 10;
--z-sticky: 20;
--z-fixed: 30;
--z-dropdown: 40;
--z-panel: 50;
--z-toast: 60;
--z-modal: 70;
--z-overlay: 80;
--z-command: 90;
--z-critical: 100;
--z-debug: 999;
```

### 27.2 Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        base: {
          950: '#060911',
          900: '#0A0E1A',
          850: '#0E1220',
          800: '#111827',
          750: '#161B2C',
          700: '#1C2136',
          650: '#212740',
          600: '#272E4A',
          500: '#3A4262',
          400: '#5B6480',
          300: '#8B93B0',
          200: '#B8BECE',
          100: '#D8DCE8',
          50: '#F0F2F8',
        },
        primary: {
          600: '#005CE6',
          500: '#1A75FF',
          400: '#4D94FF',
          300: '#80B3FF',
          200: '#B3D1FF',
        },
        ai: {
          600: '#5500D9',
          500: '#7E22CE',
          400: '#A855F7',
          300: '#C084FC',
          200: '#DDB6FE',
        },
        crowd: {
          sparse: '#059669',
          normal: '#2563EB',
          elevated: '#D97706',
          high: '#EA580C',
          critical: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      boxShadow: {
        'elev-1': '0 1px 3px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.24)',
        'elev-2': '0 4px 12px rgba(0,0,0,0.24), 0 2px 4px rgba(0,0,0,0.16)',
        'elev-3': '0 8px 24px rgba(0,0,0,0.32), 0 4px 8px rgba(0,0,0,0.20)',
        'elev-4': '0 16px 48px rgba(0,0,0,0.40), 0 8px 16px rgba(0,0,0,0.24)',
        'ai-glow': '0 0 0 1px rgba(126,34,206,0.20), 0 0 20px rgba(126,34,206,0.10)',
        'alert-glow': '0 0 0 1px rgba(220,38,38,0.30), 0 0 20px rgba(220,38,38,0.15)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'ai-spin': 'spin 1.5s linear infinite',
        blink: 'blink 0.7s step-end infinite',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        ultrawide: '2560px',
      },
    },
  },
};
```

---

## 28. Figma Organization

### 28.1 File Structure

```
ArenaMind AI — Design System (Figma)
│
├── 📄 Page 00 — Cover + Index
│     Design system overview, version, team, last updated
│
├── 📄 Page 01 — Foundations
│     Color Styles (all semantic tokens)
│     Typography Styles (all type scales)
│     Spacing reference grid
│     Elevation / shadow styles
│     Border radius reference
│
├── 📄 Page 02 — Iconography
│     Icon grid (all Lucide icons used, sized at 16/20/24px)
│     Custom icon adaptations
│     AI icon variants
│
├── 📄 Page 03 — Components / Atoms
│     Buttons (all 5 variants × 4 sizes × 5 states)
│     Badges, chips, status dots
│     Form inputs, selects, switches, checkboxes
│     Progress bars, rings
│     Avatars
│
├── 📄 Page 04 — Components / Molecules
│     Cards (all 8 types)
│     AI Content Block (all states)
│     Table rows (standard + compact)
│     Notification toast
│     Form groups
│     Section headers
│
├── 📄 Page 05 — Components / Organisms
│     Sidebar (collapsed + expanded states)
│     Top Navigation bar
│     Command Palette
│     Modal (standard + fullscreen)
│     Drawer (right panel)
│     Data tables (full)
│     Stadium Zone Map
│
├── 📄 Page 06 — Data Visualization
│     All chart types (annotated)
│     Heatmap states (all 5 density levels)
│     KPI sparklines
│     Phase timeline
│
├── 📄 Page 07 — Screens / Desktop
│     Command Center (full layout)
│     Crowd Intelligence Hub
│     Incident Management
│     Resource Coordination
│     Transportation & Accessibility
│     Reports & Analytics
│
├── 📄 Page 08 — Screens / Mobile
│     All 6 modules in mobile layout
│     Bottom navigation
│     Mobile modals and drawers
│
├── 📄 Page 09 — Screens / States
│     Empty states (all modules)
│     Error states (all modules)
│     Loading states (all modules)
│     AI states (thinking, streaming, complete, error)
│
├── 📄 Page 10 — Motion Reference
│     Animation specs (statics with annotations)
│     Easing curve previews
│     Spring configuration reference
│     Reduced motion variants
│
└── 📄 Page 11 — Prototypes
      Interactive prototype flows:
      1. Login → Command Center
      2. Create Incident → AI Classification
      3. Accept AI Recommendation
      4. Generate Executive Summary
      5. Phase Change → Realtime Update
```

### 28.2 Figma Variable Collections

```
Variable Collections:
├── 🎨 Colors/Dark (all --color-* tokens for dark theme)
├── 🎨 Colors/Light (all --color-* tokens for light theme)
├── 📏 Spacing (all --sp-* tokens)
├── 🔤 Typography (all --type-* tokens)
├── ⚡ Animation (all --duration-* tokens)
├── 🌀 Blur (all --blur-* tokens)
├── 📐 Radius (all --radius-* tokens)
└── 🎭 Z-Index (all --z-* tokens)
```

### 28.3 Component Naming Convention

```
Pattern: [Category] / [Component] / [Variant] / [State]

Examples:
  Atoms / Button / Primary / Hover
  Atoms / Badge / Crowd/Critical / Default
  Molecules / Card / AI Recommendation / Accepted
  Molecules / Card / Incident / Tier-1-Active
  Organisms / Sidebar / Expanded / Default
  Organisms / Command Palette / Open / With-Results
  Screens / Desktop / Command Center / Match-Live
  Screens / Desktop / Incidents / Empty State
```

### 28.4 Library Architecture

- **ArenaMind AI — Foundation Library** → Published, shared to all files
- **ArenaMind AI — Component Library** → Published, uses Foundation Library
- **ArenaMind AI — Product Screens** → Consumes both libraries, contains final screens and prototypes

---

## 29. Design QA Checklist

### 29.1 Visual Consistency Review

```
□  All colors use design system tokens (no hex codes in components)
□  All typography uses defined type scale tokens
□  All spacing uses spacing scale (no arbitrary pixel values)
□  All border-radius uses radius tokens
□  All shadows use elevation tokens
□  Icon sizes consistently 16/20/24px (no 18px, 22px)
□  All status indicators use both color + icon/label
□  Card hover states are consistent across all card types
□  Button states are complete for all 5 states
□  Dark mode tested for all components
□  Light mode tested for all components (if applicable)
```

### 29.2 Accessibility Review

```
□  Color contrast ≥ 4.5:1 for all body text
□  Color contrast ≥ 3:1 for all large text and UI components
□  Focus indicators visible on all interactive elements
□  Focus indicators contrast ≥ 3:1 vs adjacent color
□  No information conveyed by color alone
□  All touch targets ≥ 44×44px
□  Tab order is logical (top-left to bottom-right)
□  All icons have aria-label or aria-hidden
□  All charts have accessible text alternative
□  All modals have aria-modal, aria-labelledby, focus trap
□  All form inputs have associated labels
□  Error messages are announced to screen readers
□  Live data regions use aria-live="polite"
□  Tier 1 alerts use aria-live="assertive"
□  Tested with VoiceOver (macOS) or NVDA (Windows)
□  Tested with keyboard-only navigation
□  Reduced motion variant implemented
□  High contrast mode tested
```

### 29.3 Motion Review

```
□  All animations serve a communication purpose
□  No purely decorative animations
□  Animation durations match token scale
□  Spring configurations are from defined spring set
□  prefers-reduced-motion disables all non-essential animations
□  AI thinking animation tested for all 3 phases
□  Streaming text tested at various response lengths
□  Realtime data update animations are not disruptive
□  Page transitions feel instantaneous to users (<300ms perceived)
□  No animation that causes layout shift (CLS)
□  Magnetic button effect has max displacement limit
□  Chart animations don't block data reading
```

### 29.4 Performance Review

```
□  All skeleton loaders match exact content dimensions
□  Images/illustrations are optimized (SVG or WebP)
□  Font loading uses font-display: swap
□  No custom fonts used for data-heavy tables (use system font)
□  Chart component renders within 100ms after data available
□  Command palette opens within 50ms of ⌘K
□  Realtime updates process within 100ms of WebSocket event
□  No layout shifts on data load (reserved height)
□  Lazy loading implemented for below-fold charts
□  GPU-accelerated transforms only (transform, opacity)
```

### 29.5 Responsiveness Review

```
□  Tested at 375px (iPhone SE)
□  Tested at 390px (iPhone 14)
□  Tested at 768px (iPad Portrait)
□  Tested at 1024px (iPad Landscape / Small Laptop)
□  Tested at 1280px (Standard Laptop)
□  Tested at 1440px (Large Laptop)
□  Tested at 1920px (1080p Monitor)
□  Tested at 2560px (Ultra-Wide)
□  Sidebar collapses correctly at 1024px
□  Bottom nav appears correctly on mobile
□  Tables horizontally scroll on small screens
□  Charts resize correctly at all breakpoints
□  Command palette is full-width on mobile
□  Modals are full-screen on mobile
□  Touch targets are 44px+ on mobile
□  Heatmap remains readable at all sizes
```

### 29.6 Interaction Quality Review

```
□  Button loading states prevent double-submit
□  Form errors appear inline (not as alerts)
□  Confirmation dialogs present for destructive actions
□  Escape key closes all overlays
□  Dismissing modal/drawer via backdrop click works
□  All hover states are present and intentional
□  Active/pressed states are present
□  Disabled states are visually clear (not just greyed text)
□  Empty state CTAs navigate to the correct action
□  Error state retry buttons actually retry the failed operation
□  AI accept/dismiss states are visually permanent (no re-enabling)
□  Phase change confirmation shows current + new phase clearly
□  Incident tier override shows override warning
```

### 29.7 Readability Review

```
□  Line length ≤ 72 characters for body text
□  AI-generated text uses generous line-height (1.7)
□  Numbers in tables right-aligned, monospace
□  All timestamps in consistent format (HH:MM:SS local time)
□  Status labels are in title case (not ALL CAPS for long labels)
□  Incident type uses operational vocabulary (not technical codes)
□  AI confidence shown as percentage (not just high/medium/low)
□  Abbreviations have tooltips (e.g., "SOC" → tooltip: "Stadium Operations Center")
□  Data labels on charts are readable at all viewport sizes
```

### 29.8 AI Experience Review

```
□  AI thinking state activates within 200ms of request
□  AI content block has left gradient border (AI visual mark)
□  Confidence indicator visible on all AI outputs
□  Accept + Dismiss always visible until action taken
□  Post-accept state shows who accepted and when
□  Post-dismiss state shows dismissal (card collapses)
□  Stale AI content shows staleness indicator
□  AI error state is visually non-breaking (data still visible)
□  Reasoning panel accessible (click confidence indicator)
□  Generation timestamp and model name shown in footer
□  Rate limit state shows countdown timer
□  AI content streams (not appears all at once)
```

### 29.9 Enterprise Readiness Review

```
□  No consumer-app design patterns (onboarding fun facts, confetti, etc.)
□  No emoji in operational UI (only in illustrations)
□  Professional copy — no "Oops!" or "Uh oh!" error messages
□  All data has context (units, scope, timestamp)
□  Role-based UI correctly hides unauthorized actions
□  Sensitive operational data is not shown in browser tab title
□  No autoplaying media or sound (except critical Tier 1 alert)
□  Print stylesheet defined for report pages
□  Favicon is the ArenaMind AI logomark (not generic)
□  Browser tab title follows pattern: [Module] — ArenaMind AI
□  404 and 500 error pages are branded and helpful
□  Designed for 14-hour shift use (no eye-fatigue-inducing bright surfaces)
```

---

## Appendix A: Key Design Decisions Summary

| Decision                               | Rationale                                                                                                                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dark mode primary**                  | Operations centers run in controlled lighting. Dark mode reduces eye strain over long shifts. All physical stadium control rooms use dark screens.                |
| **No light mode as default**           | Light mode is available but the product is designed for dark-first. Switching to light mode is a user preference, not a design requirement.                       |
| **Inter over DM Sans or Plus Jakarta** | Inter's tabular number variant is essential for dashboard data alignment. DM Sans doesn't have tabular figures.                                                   |
| **JetBrains Mono for data**            | All numerical data in tables and KPI cards must use monospace to prevent number-width jumping during realtime updates.                                            |
| **Violet for AI, Blue for actions**    | Creating a clear visual separation between AI-generated content (violet) and human-triggered actions (blue) reinforces the human-in-the-loop principle visually.  |
| **16px card border-radius**            | More structured than consumer apps (24px), less cold than BI tools (4px). The radius expresses "professional but modern."                                         |
| **Semantic > Decorative color**        | In a safety-critical operational system, using red decoratively (even for brand) would create confusion with danger states. Color is strictly semantic.           |
| **3s crowd density color transition**  | Sudden color jumps in the heatmap would be startling and potentially alarming for non-critical changes. 3-second interpolation communicates change without panic. |
| **Streaming AI text**                  | Streaming communicates that computation is active and gives the manager something to read while the full output generates. It reduces perceived wait time.        |
| **Command Palette priority**           | Power users managing large incidents should not need to reach for their mouse. ⌘K provides instant access to every feature.                                       |

---

_Document End_

---

> **ArenaMind AI** — UI/UX Design Brief  
> _Version 1.0.0 | July 12, 2026_  
> _Design Bible — The definitive visual and interaction specification for ArenaMind AI._  
> _Derived from: PRD v1.0.0 + TRD v1.0.0 + SAD v1.0.0_  
> _This document is the single source of truth for all design decisions._
