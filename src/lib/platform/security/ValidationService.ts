import { ZodSchema, ZodError } from 'zod';
import { NextResponse } from 'next/server';
import { LoggerService } from '../observability/LoggerService';

export class ValidationService {
  /**
   * Validates a JSON payload against a Zod schema.
   * Enforces a maximum payload size limit.
   */
  static async validateJsonPayload<T>(
    request: Request,
    schema: ZodSchema<T>,
    maxSizeBytes = 2 * 1024 * 1024 // 2MB default
  ): Promise<{ data?: T; errorResponse?: NextResponse }> {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
      LoggerService.warn('Payload exceeded size limit', {
        size: contentLength,
        limit: maxSizeBytes,
      });
      return { errorResponse: NextResponse.json({ error: 'Payload too large' }, { status: 413 }) };
    }

    try {
      const body = await request.json();
      const result = schema.safeParse(body);

      if (!result.success) {
        return {
          errorResponse: NextResponse.json(
            { error: 'Validation failed', details: (result.error as any).errors },
            { status: 400 }
          ),
        };
      }

      return { data: result.data };
    } catch (error) {
      LoggerService.warn('Malformed JSON payload received', { error });
      return {
        errorResponse: NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 }),
      };
    }
  }

  /**
   * Helper to format Zod errors into a standard string array
   */
  static formatZodError(error: ZodError): string[] {
    return (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`);
  }
}
