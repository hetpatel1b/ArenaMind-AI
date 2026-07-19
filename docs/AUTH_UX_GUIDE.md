# ArenaMind AI Authentication UX Guide

This guide details the Phase 3.7 Enterprise Authentication Experience, built on top of Supabase Auth.

## Core Philosophy

Authentication in ArenaMind AI is not a barrier; it is the physical entry point into a live command center. The UX is designed to feel secure, tactile, and deeply integrated into the overarching "Cinematic Transition" workflow.

## No Public Sign-up

**ArenaMind AI is an invitation-only platform.**
There is no public `/register` or `/signup` route. Operators are provisioned by FIFA administrators and arrive via a secure magic link that routes them to `/accept-invite`.

## Premium Layout (Phase 3.1 & 3.5 Compliance)

- The legacy Tailwind CSS layout has been completely removed in favor of the frozen Vanilla CSS `tokens.css`.
- The background utilizes the massive stadium zoom `hero-bg.png` overlaid with a dark `backdrop-filter: blur(20px)` to pull focus to the authentication card.
- All form inputs utilize `var(--bg-app)` and `var(--border-subtle)` to match the Mission Control aesthetic.

## Interactive States & Motion

- **Entry**: The entire auth card wraps in `<PageTransition>`, gently sliding up when navigating between login and forgot-password states.
- **Feedback**: Form submissions wrap in `<WarningShake>`. If Supabase rejects the credentials, the entire form physically shakes horizontally to alert the user of a failure, preventing the need for massive red error banners.
- **Tactility**: All buttons are wrapped in `<PressFeedback scale={0.97}>` to provide instantaneous, spring-physics-driven reaction times.

## Accessibility (WCAG 2.2 AA)

- Form inputs include explicit `<label>` tags linked via `htmlFor`.
- The `Loading...` states disable inputs to prevent double-submission.
- If `prefers-reduced-motion` is detected by the OS, the `<WarningShake>` and cinematic transitions are bypassed instantly.

## The Cinematic Transition Hook

Upon successful authentication at `/login` or `/accept-invite`, we do not simply `router.push('/dashboard')`.
Instead, we mount the `<CinematicTransition />` component. This takes over the screen, zooms into the stadium background, plays the "ARENAMIND OS Initializing..." terminal text, and pushes to `/dashboard?boot=true` so the command center dynamically assembles around the operator.
