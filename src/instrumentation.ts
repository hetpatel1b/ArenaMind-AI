import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Sentry Node.js initialization is handled by sentry.server.config.ts
    // but the actual Next.js integration hooks happen behind the scenes.

    // We only want to run this in the Node.js runtime, not edge
    const { ShutdownManager } = await import('./lib/platform/lifecycle/ShutdownManager');
    const { StartupValidator } = await import('./lib/platform/lifecycle/StartupValidator');

    ShutdownManager.initialize();

    // We run the validator but don't strictly await it if it's blocking the build
    // To ensure it doesn't break static generation, we only run it if not building
    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PUBLIC_E2E_MODE !== 'true'
    ) {
      await StartupValidator.validate();
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry init is handled by sentry.edge.config.ts
  }
}

export const onRequestError = Sentry.captureRequestError;
