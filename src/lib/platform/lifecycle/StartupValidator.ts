import { HealthService } from '../health/HealthService';
import { LoggerService } from '../observability/LoggerService';

export class StartupValidator {
  /**
   * Validates that all necessary dependencies are reachable before allowing the application to start.
   * If a critical dependency is unavailable, it throws an error to prevent silent startup failures.
   */
  static async validate(): Promise<void> {
    LoggerService.info('🔄 [StartupValidator] Validating enterprise infrastructure...');

    try {
      const health = await HealthService.checkHealth();

      if (health.status === 'down') {
        LoggerService.error('❌ [StartupValidator] Critical dependency check failed:');

        if (health.components.database.status === 'down') {
          LoggerService.error(`  - Database: ${health.components.database.error}`);
        }
        if (health.components.redis.status === 'down') {
          LoggerService.error(`  - Redis: ${health.components.redis.error}`);
        }

        throw new Error('Startup validation failed due to unreachable critical dependencies.');
      }

      if (health.status === 'degraded') {
        LoggerService.warn('⚠️ [StartupValidator] Application starting in degraded state:');
        if (health.components.storage.status === 'down') {
          LoggerService.warn(`  - Storage: ${health.components.storage.error}`);
        }
        if (health.components.aiProviders.grok.status === 'down') {
          LoggerService.warn(`  - Grok API not configured.`);
        }
        if (health.components.aiProviders.gemini.status === 'down') {
          LoggerService.warn(`  - Gemini API not configured.`);
        }
      } else {
        LoggerService.info('✅ [StartupValidator] Enterprise infrastructure is healthy.');
      }
    } catch (error) {
      LoggerService.error('❌ [StartupValidator] Fatal error during startup validation.', error);
      // Exit process gracefully if possible, or throw
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        throw error;
      }
    }
  }
}
