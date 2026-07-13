# ArenaMind AI - Intelligent Stadium Operations Copilot

ArenaMind AI is an enterprise-grade GenAI-enabled solution designed to enhance stadium operations and the tournament experience, built for FIFA evaluation.

## Project Setup Guide

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL (via Supabase)

### Installation

1. Clone the repository.
2. Run `pnpm install` to install dependencies.
3. Copy `.env.example` to `.env.local` and configure your environment variables (Supabase, Gemini).
4. Run `pnpm dev` to start the development server.

## Environment Guide

See `.env.example` for required variables.

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Client-side Supabase keys.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-side admin operations.
- `GEMINI_API_KEY`: Google Generative AI token.

## Folder Explanation

- `src/app`: Next.js App Router (pages, layouts, api routes).
- `src/components`: Reusable UI components, grouped by domain (dashboard, crowd, incidents).
- `src/lib`: Shared logic (supabase clients, ai configurations, api helpers).
- `src/hooks`: React hooks for data fetching and realtime subscriptions.
- `src/styles`: Vanilla CSS global styles.
- `src/types`: TypeScript definitions (including auto-generated Database types).
- `supabase`: Migrations, seed data, and Edge Functions.
- `tests`: Unit, Integration, and E2E testing suites.

## Dependency Explanation

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Database/Auth/Realtime**: Supabase (@supabase/ssr, @supabase/supabase-js)
- **AI Integration**: Google Gemini (@google/generative-ai)
- **Styling**: Vanilla CSS (Tailwind disabled per TRD)
- **Testing**: Vitest, Playwright
- **Linting/Formatting**: ESLint, Prettier, Husky, lint-staged

## Development Guide

- **Start server**: `pnpm dev`
- **Lint code**: `pnpm lint`
- **Format code**: `pnpm format`
- **Type check**: `pnpm typecheck`
- **Run tests**: `pnpm test:unit`

## Contribution Guide

1. Ensure your code satisfies SOLID, Clean Architecture, and DRY principles.
2. No direct database queries in UI components—use hooks or server actions.
3. Commit messages must follow conventional commits format.
4. Pre-commit hooks will automatically run formatting and linting.
