# ArenaMind AI Enterprise Design System Guide

This guide outlines the Vanilla CSS Architecture implemented in Phase 3.1. We strictly avoid inline styles and heavy CSS-in-JS runtimes.

## 1. Design Tokens (`tokens.css`)

All colors, spacing, typography, and radiuses are mapped to CSS Custom Properties (`--var`).

- **Backgrounds**: `--bg-app` (deepest), `--bg-surface` (cards), `--bg-surface-elevated` (dropdowns).
- **Text**: `--text-primary`, `--text-secondary`, `--text-tertiary`.
- **Semantic**: `--status-critical` (Red), `--status-success` (Green).

## 2. Component Foundations (`components.css`)

We define baseline classes for standard UI elements so they render correctly even before React mounts.

- **Buttons**: `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost`.
- **Cards**: `.card`, `.metric-card`.
- **Inputs**: `.input`.

## 3. Glassmorphism & Utilities (`utilities.css`)

The ArenaMind AI "Command Center" aesthetic heavily utilizes glass.

- Use `.glass-panel` for floating UI elements that overlay the map or dashboard.
- Use `.container` for standard center-aligned page constraints.

## 4. Accessibility

- All interactive elements must use the `.focus-ring` utility class or native focus states to ensure keyboard navigability.
- Our `motion.css` automatically disables all animations if the user's OS has `prefers-reduced-motion` enabled.
- Always use semantic HTML (`<button>`, `<main>`, `<nav>`).
