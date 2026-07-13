import { BusinessContext } from './business.context';
import { ITransaction } from '@/types/domain.types';
import { logger } from '../observability/logger';
import { AuthorizationError } from '../errors/http.errors';

/**
 * Abstract Base Service.
 * Provides standard operational wrappers, logging, and security context validation
 * for all domain services.
 */
export abstract class BaseService {
  protected readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Helper to execute business logic with consistent logging and error wrapping.
   */
  protected async execute<T>(
    operationName: string,
    context: BusinessContext,
    operation: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();

    logger.info(`[${this.serviceName}] Starting operation: ${operationName}`, {
      correlationId: context.correlationId,
      userId: context.userId,
    });

    try {
      const result = await operation();

      const duration = performance.now() - start;
      logger.info(`[${this.serviceName}] Completed operation: ${operationName}`, {
        correlationId: context.correlationId,
        durationMs: Math.round(duration),
      });

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      const err = error as Error;

      logger.error(`[${this.serviceName}] Failed operation: ${operationName}`, {
        correlationId: context.correlationId,
        durationMs: Math.round(duration),
        error: err.message,
        stack: err.stack,
      });

      throw error;
    }
  }

  /**
   * Helper to execute business logic within a database transaction context.
   */
  protected async executeTransactional<T>(
    operationName: string,
    context: BusinessContext,
    transactionProvider: <R>(callback: (tx: ITransaction) => Promise<R>) => Promise<R>,
    operation: (tx: ITransaction) => Promise<T>
  ): Promise<T> {
    return this.execute(`TX:${operationName}`, context, async () => {
      return transactionProvider(async (tx) => {
        return operation(tx);
      });
    });
  }

  /**
   * Enforces that the current context operates within the authorized stadium.
   * Prevents cross-tenant logic leaks at the service layer.
   */
  protected enforceTenantIsolation(context: BusinessContext, targetStadiumId: string): void {
    if (context.role === 'system_admin') return;

    if (context.stadiumId !== targetStadiumId) {
      throw new AuthorizationError('Cross-tenant data violation attempted at Service Layer');
    }
  }
}
