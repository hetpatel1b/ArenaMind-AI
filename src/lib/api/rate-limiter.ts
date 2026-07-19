import { NextRequest } from 'next/server';
import { RateLimitError } from '../errors/http.errors';
import { prisma } from '@/lib/db/client';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

/**
 * Enterprise Rate Limiter.
 * Uses PostgreSQL for distributed rate limiting.
 */
export async function enforceRateLimit(
  req: NextRequest,
  identifier: string,
  options: RateLimitOptions
): Promise<void> {
  const windowEnd = new Date(Date.now() + options.windowMs);

  // In a high-throughput enterprise app, Redis is better.
  // For Phase 5.3 we persist to the RateLimit Postgres table.
  const recordId = `${identifier}_${Math.floor(Date.now() / options.windowMs)}`;

  try {
    // Attempt to increment/create
    const count = await prisma.rateLimit.count({
      where: {
        id: recordId, // Reusing ID to group requests per window
      },
    });

    if (count >= options.maxRequests) {
      throw new RateLimitError('Too many requests');
    }

    await prisma.rateLimit.create({
      data: {
        id: `${identifier}_${Date.now()}`, // Create unique event for the window
        identifier,
        windowEnd,
      },
    });
  } catch (error) {
    if (error instanceof RateLimitError) throw error;
    // Log but allow pass-through if DB fails (fail-open)
    LoggerService.error('Rate limit DB error', error);
  }
}
