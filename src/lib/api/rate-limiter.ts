import { NextRequest } from 'next/server';
import { RateLimitError } from '../errors/http.errors';

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

/**
 * Enterprise Rate Limiter Foundation.
 * Currently serves as a pass-through mock, but structured to easily drop in
 * @upstash/ratelimit or Redis later without changing route handler code.
 */
export async function enforceRateLimit(
  req: NextRequest,
  identifier: string,
  options: RateLimitOptions
): Promise<void> {
  // In Phase 3, this will check Redis:
  // const limit = await redis.ratelimit(identifier, options);
  // if (!limit.success) throw new RateLimitError('Too many requests');

  // For Phase 2D foundation, it's a structural placeholder
  return Promise.resolve();
}
