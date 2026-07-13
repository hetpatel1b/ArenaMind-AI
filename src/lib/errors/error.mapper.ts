import { NextResponse } from 'next/server';
import { ApplicationError } from './app.error';
import { logger } from '../observability/logger'; // We will create this in Step 5

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

    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(process.env.NODE_ENV === 'development' && { details: error.details }),
        },
      },
      { status: error.statusCode }
    );
  }

  // If it's an unhandled or unknown exception
  const unknownError = error as Error;
  logger?.error('Unhandled exception', {
    message: unknownError.message,
    stack: unknownError.stack,
    ...reqContext,
  });

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        ...(process.env.NODE_ENV === 'development' && { dev_message: unknownError.message }),
      },
    },
    { status: 500 }
  );
}
