import { config } from '../config/ConfigurationService';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  requestId?: string;
  correlationId?: string;
  userId?: string;
  organizationId?: string;
  route?: string;
  latency?: number;
  environment?: string;
  [key: string]: SafeAny;
}

export class LoggerService {
  private static getLevelValue(level: LogLevel): number {
    const levels: Record<LogLevel, number> = {
      trace: 10,
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      fatal: 60,
    };
    return levels[level];
  }

  private static shouldLog(level: LogLevel): boolean {
    const currentLevel = (config.logLevel as LogLevel) || 'info';
    return this.getLevelValue(level) >= this.getLevelValue(currentLevel);
  }

  private static formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: SafeAny
  ): string {
    const logEntry = {
      // standard datadog/ELK fields
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: config.nodeEnv,

      // trace/correlation IDs
      requestId: context?.requestId,
      correlationId: context?.correlationId,

      // user/tenant context
      userId: context?.userId,
      organizationId: context?.organizationId,

      // additional metadata
      ...context,

      // error details formatted for ingestion
      ...(error instanceof Error
        ? {
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
            },
          }
        : { error }),
    };

    // Clean up undefined fields
    Object.keys(logEntry).forEach((key) => {
      if ((logEntry as Record<string, SafeAny>)[key] === undefined) {
        delete (logEntry as Record<string, SafeAny>)[key];
      }
    });

    return JSON.stringify(logEntry);
  }

  private static print(level: LogLevel, message: string, context?: LogContext, error?: SafeAny) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context, error);

    switch (level) {
      case 'trace':
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(formattedMessage);
        break;
      case 'info':
        // eslint-disable-next-line no-console
        console.info(formattedMessage);
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(formattedMessage);
        break;
      case 'error':
      case 'fatal':
        // eslint-disable-next-line no-console
        console.error(formattedMessage);
        break;
    }
  }

  static trace(message: string, context?: LogContext) {
    this.print('trace', message, context);
  }

  static debug(message: string, context?: LogContext) {
    this.print('debug', message, context);
  }

  static info(message: string, context?: LogContext) {
    this.print('info', message, context);
  }

  static warn(message: string, context?: LogContext) {
    this.print('warn', message, context);
  }

  static error(message: string, error?: SafeAny, context?: LogContext) {
    this.print('error', message, context, error);
  }

  static fatal(message: string, error?: SafeAny, context?: LogContext) {
    this.print('fatal', message, context, error);
  }
}
