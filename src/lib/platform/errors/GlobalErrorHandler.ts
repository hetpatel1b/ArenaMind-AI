import { NextResponse } from 'next/server';
import { LoggerService } from '../observability/LoggerService';
import { config } from '../config/ConfigurationService';

export enum ErrorCategory {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  DATABASE = 'DATABASE_ERROR',
  AI = 'AI_PROVIDER_ERROR',
  REDIS = 'CACHE_ERROR',
  FILESYSTEM = 'STORAGE_ERROR',
  CONFIGURATION = 'CONFIGURATION_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  constructor(
    public category: ErrorCategory,
    message: string,
    public statusCode: number = 500,
    public details?: SafeAny
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class GlobalErrorHandler {
  static handle(
    error: SafeAny,
    context: { requestId?: string; correlationId?: string; route?: string } = {}
  ) {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as { name: string }).name === 'ZodError'
    ) {
      appError = new AppError(ErrorCategory.VALIDATION, 'Validation failed', 400, {
        issues: (error as { issues?: SafeAny }).issues || (error as { errors?: SafeAny }).errors,
      });
    } else if (error instanceof Error) {
      appError = new AppError(ErrorCategory.INTERNAL, 'An unexpected error occurred.', 500, {
        originalMessage: error.message,
      });
      // Attach original stack trace only in memory
      appError.stack = error.stack;
    } else {
      appError = new AppError(ErrorCategory.INTERNAL, 'An unknown error occurred.', 500);
    }

    // Log the error centrally
    LoggerService.error(`Request failed: ${appError.message}`, appError, {
      ...context,
      category: appError.category,
      statusCode: appError.statusCode,
    });

    // Determine what to return to the client
    const responsePayload: {
      error: {
        category: string;
        message: string;
        details?: SafeAny;
        stack?: string;
      };
    } = {
      error: {
        category: appError.category,
        message: appError.statusCode >= 500 ? 'Internal Server Error' : appError.message,
      },
    };

    // Never expose stack traces in production
    if (!config.isProduction) {
      responsePayload.error.message = appError.message;
      responsePayload.error.details = appError.details;
      if (appError.stack) {
        responsePayload.error.stack = appError.stack;
      }
    }

    return NextResponse.json(responsePayload, { status: appError.statusCode });
  }
}
