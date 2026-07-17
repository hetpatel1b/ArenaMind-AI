import { prisma } from '@/lib/db/client';
import { LoggerService } from '../observability/LoggerService';

export class ShutdownManager {
  private static isShuttingDown = false;
  private static cleanupCallbacks: Array<() => Promise<void> | void> = [];

  static registerCleanup(callback: () => Promise<void> | void) {
    this.cleanupCallbacks.push(callback);
  }

  static async shutdown(signal: string) {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    LoggerService.info(`\n🛑 [ShutdownManager] Received ${signal}. Starting graceful shutdown...`);

    try {
      // Execute all registered cleanup callbacks
      for (const callback of this.cleanupCallbacks) {
        await callback();
      }

      // Close Prisma
      await prisma.$disconnect();
      LoggerService.info('✅ [ShutdownManager] Prisma disconnected.');

      // Add other disconnections like Redis here if accessible

      LoggerService.info('✅ [ShutdownManager] Graceful shutdown complete. Exiting.');
      process.exit(0);
    } catch (error) {
      LoggerService.error('❌ [ShutdownManager] Error during shutdown:', error);
      process.exit(1);
    }
  }

  static initialize() {
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));

    // In nodemon or development environments, SIGUSR2 might be used
    process.on('SIGUSR2', () => this.shutdown('SIGUSR2'));
  }
}
