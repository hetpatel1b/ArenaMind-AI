import { logger } from './logger';
import { metrics } from './metrics';

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
  FATAL = 'fatal',
}

export class ErrorTracker {
  captureException(
    error: Error,
    severity: ErrorSeverity = ErrorSeverity.CRITICAL,
    context?: Record<string, any>
  ) {
    // Sanitize stack trace (remove internal node module paths in a real app)
    const sanitizedStack = error.stack?.split('\n').slice(0, 5).join('\n');

    logger.error(`[${severity.toUpperCase()}] ${error.name}: ${error.message}`, {
      stack: sanitizedStack,
      severity,
      ...context,
    });

    metrics.incrementCounter('application_errors', 1, { severity, name: error.name });

    if (severity === ErrorSeverity.FATAL) {
      // In a real environment, trigger PagerDuty or immediate alerting
      logger.error('FATAL ERROR DETECTED. SYSTEM COMPROMISED OR HALTING.');
    }
  }

  captureMessage(
    message: string,
    severity: ErrorSeverity = ErrorSeverity.INFO,
    context?: Record<string, any>
  ) {
    logger.info(`Tracked Message: ${message}`, { severity, ...context });
  }
}

export const errorTracker = new ErrorTracker();
