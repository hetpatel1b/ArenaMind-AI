# ArenaMind AI Motion Guide

This guide details the Phase 3.5 Enterprise Motion & Interaction System, governed by `framer-motion`.

## Core Philosophy

In ArenaMind AI, **motion is data**. We do not use animation for visual decoration. Motion is strictly used to:

1. Explain spatial relationships (e.g., Drawers sliding from the right).
2. Direct attention to critical operational changes (e.g., `CriticalPulse`).
3. Differentiate AI reasoning from standard system logic (`AiThinkingPulse`).

## Wrapper Components

To ensure consistency and "Apple-level polish", developers must never write raw `framer-motion` configs (like `transition={{ type: "spring" }}`) inline. Always use the provided wrapper components located in `src/app/components/motion/`.

### 1. Navigation & Layout

- **`PageTransition`**: Wrap page-level components to ensure smooth enter/exit easing curves when navigating modules.
- **`DrawerTransition`**: A specialized `AnimatePresence` wrapper for right-side or left-side context menus, ensuring the backdrop blur animates in sync with the sliding panel.

### 2. AI Motion

- **`AiThinkingPulse`**: A specialized 3-dot loader using exact easing arrays to mimic organic "thinking", reserved exclusively for GenAI latency.
- **`AiRecommendationReveal`**: Uses a distinct, slightly slower spring physics config to make AI recommendations feel "heavier" and more thoughtful than instant UI toggles.
- **`ConfidenceCounter`**: Animates a number from 0 to X over 1 second, used to draw the operator's eye to the AI's confidence score.

### 3. Data & Attention

- **`DataListStagger`**: Wraps any array of children to stagger their entrance (0.05s delay per item). Essential for rendering incident feeds without overwhelming the operator.
- **`CriticalPulse`**: Emits a red `boxShadow` ripple, reserved _only_ for SEVERITY_CRITICAL incidents.

### 4. Accessibility & `prefers-reduced-motion`

**CRITICAL:** Every wrapper component in this library utilizes Framer Motion's `useReducedMotion` hook.
If an operator has OS-level reduced motion enabled:

- Spring physics are bypassed.
- Opacity fades replace physical slides (e.g., `y: 20`).
- Durations are reduced to `0` or `0.1s`.
  Developers do not need to write defensive CSS; the wrapper components handle WCAG compliance automatically.
