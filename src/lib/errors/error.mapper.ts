import { NextResponse } from 'next/server';
import { ApplicationError } from './app.error';
import { logger } from '../observability/logger';
import { errorResponse } from '../api/response';

/**
 * Maps an internal error or Exception to a standard NextResponse.
 * Ensures internal details are sanitized before sending to clients.
 */
export function mapErrorToResponse(
  error: unknown,
  reqContext?: Record<string, unknown>
): NextResponse {
  // If it's a known operational error
  if (error instanceof ApplicationError) {
    if (error.statusCode >= 500) {
      // Log server-side errors
      logger?.error(error.message, { ...error.details, ...reqContext, stack: error.stack });
    }

    return errorResponse(
      error.message,
      error.code,
      error.statusCode,
      process.env.NODE_ENV === 'development' ? error.details : undefined
    );
  }

  // If it's an unhandled or unknown exception
  const unknownError = error as Error;
  logger?.error('Unhandled exception', {
    message: unknownError.message,
    stack: unknownError.stack,
    ...reqContext,
  });

  return errorResponse(
    'An unexpected error occurred',
    'INTERNAL_ERROR',
    500,
    process.env.NODE_ENV === 'development' ? unknownError.message : undefined
  );
}
