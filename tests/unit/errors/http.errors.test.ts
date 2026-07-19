import { describe, it, expect } from 'vitest';
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  AIError,
} from '@/lib/errors/http.errors';

describe('HTTP Errors', () => {
  it('creates a ValidationError', () => {
    const error = new ValidationError('Invalid input');
    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('creates an AuthenticationError with default message', () => {
    const error = new AuthenticationError();
    expect(error.message).toBe('Authentication required');
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  it('creates an AuthorizationError with default message', () => {
    const error = new AuthorizationError();
    expect(error.message).toBe('Insufficient privileges');
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe('FORBIDDEN');
  });

  it('creates a NotFoundError', () => {
    const error = new NotFoundError('User');
    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });

  it('creates a ConflictError', () => {
    const error = new ConflictError('Resource already exists');
    expect(error.message).toBe('Resource already exists');
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe('CONFLICT');
  });

  it('creates a RateLimitError with default message', () => {
    const error = new RateLimitError();
    expect(error.message).toBe('Too many requests');
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
  });

  it('creates a DatabaseError', () => {
    const error = new DatabaseError('Connection failed');
    expect(error.message).toBe('Connection failed');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('DATABASE_ERROR');
  });

  it('creates an AIError', () => {
    const error = new AIError('Service unavailable');
    expect(error.message).toBe('Service unavailable');
    expect(error.statusCode).toBe(503);
    expect(error.code).toBe('AI_SERVICE_UNAVAILABLE');
  });
});
