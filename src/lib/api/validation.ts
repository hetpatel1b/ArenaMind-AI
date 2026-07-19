import { z } from 'zod';
import { NextRequest } from 'next/server';
import { ValidationError } from '../errors/http.errors';

/**
 * Safely parses the JSON body of a NextRequest against a Zod schema.
 * Throws a formatted ValidationError on failure.
 */
export async function validateBody<T>(req: NextRequest, schema: z.ZodType<T>): Promise<T> {
  let body: SafeAny;

  try {
    body = await req.json();
  } catch (err) {
    throw new ValidationError('Invalid JSON body');
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    throw new ValidationError('Schema validation failed', { errors: formattedErrors });
  }

  return result.data;
}
