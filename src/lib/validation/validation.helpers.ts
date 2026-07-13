import { z } from 'zod';
import { ValidationError } from '../errors/http.errors';

/**
 * Validates data against a Zod schema.
 * Throws a standardized ValidationError if validation fails.
 */
export function validateDto<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((err: z.ZodIssue) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    throw new ValidationError('Validation failed', { errors: formattedErrors });
  }

  return result.data;
}
