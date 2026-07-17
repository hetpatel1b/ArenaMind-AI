import Redis from 'ioredis';
import { config } from '../config/ConfigurationService';
import { LoggerService } from '../observability/LoggerService';

// Initialize a dedicated redis client for rate limiting
let rateLimitClient: Redis | null = null;
if (config.redisUrl) {
  rateLimitClient = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 1,
    keyPrefix: 'arenamind:rate:',
    retryStrategy: () => null, // Don't block if Redis is down
  });

  rateLimitClient.on('error', (err) => {
    LoggerService.warn('Rate limit Redis client error (failing open)', { error: String(err) });
  });
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export class RateLimiter {
  /**
   * Fixed window rate limiter via Redis.
   * Uses a fail-open strategy if Redis is unavailable.
   */
  static async checkLimit(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    if (!rateLimitClient) {
      // Fail-open
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: Date.now() + windowSeconds * 1000,
      };
    }

    try {
      const currentWindow = Math.floor(Date.now() / 1000 / windowSeconds);
      const redisKey = `${key}:${currentWindow}`;

      const multi = rateLimitClient.multi();
      multi.incr(redisKey);
      multi.expire(redisKey, windowSeconds * 2); // Buffer expiration

      const results = await multi.exec();
      if (!results || results.length === 0) {
        throw new Error('Redis multi failed');
      }

      // Check results[0][1] for the INCR result
      const count = Number(results[0]?.[1] || 0);
      const success = count <= limit;
      const remaining = Math.max(0, limit - count);
      const reset = (currentWindow + 1) * windowSeconds * 1000;

      return { success, limit, remaining, reset };
    } catch (error) {
      LoggerService.warn(`Rate limiter failed, falling back to open for key: ${key}`, { error });
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: Date.now() + windowSeconds * 1000,
      };
    }
  }
}
