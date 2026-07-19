import { ApplicationError } from './app.error';

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, SafeAny>) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message: string = 'Authentication required', details?: Record<string, SafeAny>) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string = 'Insufficient privileges', details?: Record<string, SafeAny>) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, details?: Record<string, SafeAny>) {
    super(`${resource} not found`, 404, 'NOT_FOUND', details);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string, details?: Record<string, SafeAny>) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class RateLimitError extends ApplicationError {
  constructor(message: string = 'Too many requests', details?: Record<string, SafeAny>) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', details);
  }
}

export class DatabaseError extends ApplicationError {
  constructor(message: string, details?: Record<string, SafeAny>) {
    // Database errors are often not exposed to clients fully in production,
    // but marked as operational internally.
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class AIError extends ApplicationError {
  constructor(message: string, details?: Record<string, SafeAny>) {
    super(message, 503, 'AI_SERVICE_UNAVAILABLE', details);
  }
}
