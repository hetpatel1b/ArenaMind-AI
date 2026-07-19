import { createHash } from 'crypto';

import Redis from 'ioredis';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

// Check if REDIS_URL exists, if not we gracefully fallback or fail,
// but for enterprise audit we initialize the real client.
const redisClient = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;
if (redisClient) {
  redisClient.on('error', () => {});
}

export class ResponseCacheService {
  private readonly defaultTTL = 60 * 60; // 1 hour in seconds

  private generateFingerprint(prompt: string, contextData: SafeAny): string {
    const dataString =
      typeof contextData === 'string' ? contextData : JSON.stringify(contextData || {});
    const combined = `${prompt}|${dataString}`;
    return createHash('sha256').update(combined).digest('hex');
  }

  private buildCacheKey(orgId: string, matchId: string, fingerprint: string): string {
    return `ai-cache:${orgId || 'global'}:${matchId || 'global'}:${fingerprint}`;
  }

  async get<T = unknown>(
    orgId: string | undefined,
    matchId: string,
    prompt: string,
    contextData: SafeAny,
    ttlMs: number = this.defaultTTL * 1000
  ): Promise<T | null> {
    const fingerprint = this.generateFingerprint(prompt, contextData);
    const key = this.buildCacheKey(orgId || 'global', matchId, fingerprint);

    if (redisClient) {
      try {
        const cached = await redisClient.get(key);
        if (cached) {
          return JSON.parse(cached) as T;
        }
      } catch (err) {
        LoggerService.error('[RedisCache] Error retrieving cache:', err);
      }
    }

    return null;
  }

  async set(
    orgId: string | undefined,
    matchId: string,
    prompt: string,
    contextData: SafeAny,
    data: SafeAny
  ): Promise<void> {
    // Requirements: Never cache low-confidence answers.
    if (
      data &&
      typeof data === 'object' &&
      typeof data.confidence === 'number' &&
      data.confidence < 0.7
    ) {
      return;
    }

    const fingerprint = this.generateFingerprint(prompt, contextData);
    const key = this.buildCacheKey(orgId || 'global', matchId, fingerprint);

    if (redisClient) {
      try {
        await redisClient.setex(key, this.defaultTTL, JSON.stringify(data));
      } catch (err) {
        LoggerService.error('[RedisCache] Error setting cache:', err);
      }
    }
  }

  async invalidateOrg(orgId: string): Promise<void> {
    if (!redisClient) return;
    try {
      const keys = await redisClient.keys(`ai-cache:${orgId}:*`);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (err) {
      LoggerService.error('[RedisCache] Error invalidating org cache:', err);
    }
  }

  async invalidateMatch(orgId: string, matchId: string): Promise<void> {
    if (!redisClient) return;
    try {
      const keys = await redisClient.keys(`ai-cache:${orgId}:${matchId}:*`);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (err) {
      LoggerService.error('[RedisCache] Error invalidating match cache:', err);
    }
  }
}

export const aiResponseCacheService = new ResponseCacheService();
