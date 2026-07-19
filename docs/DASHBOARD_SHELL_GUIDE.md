# ArenaMind AI Dashboard Shell Guide

This guide outlines the Phase 3.3 Dashboard Shell architecture.

## Overview

The Dashboard Shell is the permanent Mission Control UI for authenticated users. It is composed of highly optimized, modular components located in `src/app/components/dashboard/shell/`.

## CSS Grid & Flexbox Structure

We utilize a strict Flexbox layout inside `src/app/(dashboard)/layout.tsx` to lock the application into a 100vh viewport, preventing ugly body-scrolls.

- **Header**: `TopCommandBar`
- **Middle Row**:
  - `LeftNavigation` (Fixed/Collapsible)
  - `main` (Scrollable Workspace)
  - `PersistentAiPanel` (Fixed Aside)
- **Footer**: `StatusBar`

## Component Interaction

1. **Command Palette**: Triggered globally via `Ctrl+K`. It mounts at `z-index: var(--z-modal)` to overlay the entire application.
2. **Context Panel**: Lives inside the `<main>` workspace area to float over table views or map grids. It is absolutely positioned relative to the viewport.
3. **AI Panel**: Always present on the right side. Future phases will inject the LLM context stream here.

## Accessibility

- All interactive shell elements utilize `.btn-ghost` and `.focus-ring`.
- The `LeftNavigation` correctly uses `aria-label="Main Navigation"` to differentiate it from other `<nav>` elements.
- The `CommandPalette` traps focus conceptually and uses `role="dialog"`.

## Performance

- The `layout.tsx` is a React Server Component.
- The interactive shell components use `"use client"` but manage their own localized state, preventing the entire layout from re-rendering when the sidebar collapses.
