export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // We only want to run this in the Node.js runtime, not edge
    const { ShutdownManager } = await import('./lib/platform/lifecycle/ShutdownManager');
    const { StartupValidator } = await import('./lib/platform/lifecycle/StartupValidator');

    ShutdownManager.initialize();

    // We run the validator but don't strictly await it if it's blocking the build
    // To ensure it doesn't break static generation, we only run it if not building
    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.NEXT_PHASE !== 'phase-production-build'
    ) {
      await StartupValidator.validate();
    }
  }
}
