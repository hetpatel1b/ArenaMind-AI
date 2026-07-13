/* eslint-disable no-console */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
  correlationId?: string;
  requestId?: string;
  userId?: string;
  stadiumId?: string;
  spanId?: string;
}

/**
 * Structured application logger.
 * In a real enterprise app, this would wrap Pino or Winston and transport to Datadog/ELK.
 */
class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      ...context,
    });
  }

  public info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  public warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  public error(message: string, context?: LogContext) {
    console.error(this.formatMessage('error', message, context));
  }

  public debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = new Logger();
