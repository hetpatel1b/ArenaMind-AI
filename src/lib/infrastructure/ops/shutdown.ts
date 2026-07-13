import { prisma } from '@/lib/db/client';
import { logger } from '@/lib/observability/logger';

export class ShutdownManager {
  private isShuttingDown = false;
  private hooks: (() => Promise<void>)[] = [];

  registerHook(name: string, hook: () => Promise<void>) {
    this.hooks.push(async () => {
      logger.info(`Running shutdown hook: ${name}`);
      await hook();
    });
  }

  async executeGracefulShutdown(signal: string) {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    logger.warn(`Received shutdown signal: ${signal}. Commencing graceful shutdown.`);

    try {
      // Execute all registered hooks (e.g. stopping Queue processing)
      for (const hook of this.hooks) {
        await hook().catch((err) => logger.error('Shutdown hook failed', { err }));
      }

      await prisma.$disconnect();
      logger.info('Database disconnected.');

      logger.info('Graceful shutdown complete. Exiting.');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown.', { error });
      process.exit(1);
    }
  }

  listenForSignals() {
    process.on('SIGTERM', () => this.executeGracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.executeGracefulShutdown('SIGINT'));
  }
}

export const shutdownManager = new ShutdownManager();
