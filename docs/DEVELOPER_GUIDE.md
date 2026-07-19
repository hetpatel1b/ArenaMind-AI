# Developer Guide

## Setup

1. `pnpm install`
2. `pnpm db:generate` to generate Prisma types.
3. `pnpm dev` to start the Next.js development server.

## Code Quality Standards

- **TypeScript**: We run `tsc --noEmit` strictly. No implicit any.
- **ESLint**: Zero warnings policy.
- **Components**: The UI is Gold Master certified. **Do not alter layout, styling, or motion.**

## Creating a new Service

1. Add logic to `src/lib/modules/<domain>/service.ts`.
2. Do not use NextRequest objects here. Pass the `BusinessContext`.
3. Use `this.logger` instead of `console.log`.

## Making API Changes

1. Register endpoints in `src/app/api/v1/`.
2. Wrap with `createRouteHandler()`.
3. Map frontend requests using `useGenericMutation` in `@tanstack/react-query`.
