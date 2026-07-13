import { prisma } from '@/lib/db/client';
import { logger } from '@/lib/observability/logger';
import { config } from '../config/env';

export class BootstrapManager {
  async validateStartup(): Promise<void> {
    logger.info('Commencing Operational Bootstrap Validation', { env: config.NODE_ENV });

    try {
      // 1. Validate Database
      await prisma.$queryRaw`SELECT 1`;
      logger.info('Database connection established.');

      // 2. Validate Environment Constraints
      if (!config.DATABASE_URL && config.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL is strictly required in production.');
      }

      logger.info('Startup validation successful. System is ready to accept traffic.');
    } catch (error) {
      logger.error('CRITICAL: Startup validation failed. Initiating crash.', { error });
      // In a raw Node environment, we would process.exit(1)
      // Since this is Next.js serverless, we throw to prevent silent degraded boot
      throw error;
    }
  }
}

export const bootstrapManager = new BootstrapManager();
