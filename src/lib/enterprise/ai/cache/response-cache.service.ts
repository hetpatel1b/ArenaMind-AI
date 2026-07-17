import { createHash } from 'crypto';

interface CacheEntry {
  data: any;
  timestamp: number;
}

export class ResponseCacheService {
  private memoryCache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 1000 * 60 * 60; // 1 hour

  private generateFingerprint(prompt: string, contextData: any): string {
    const dataString =
      typeof contextData === 'string' ? contextData : JSON.stringify(contextData || {});
    const combined = `${prompt}|${dataString}`;
    return createHash('sha256').update(combined).digest('hex');
  }

  private buildCacheKey(orgId: string, matchId: string, fingerprint: string): string {
    return `ai-cache:${orgId || 'global'}:${matchId || 'global'}:${fingerprint}`;
  }

  async get(
    orgId: string | undefined,
    matchId: string,
    prompt: string,
    contextData: any,
    ttlMs: number = this.defaultTTL
  ): Promise<any | null> {
    const fingerprint = this.generateFingerprint(prompt, contextData);
    const key = this.buildCacheKey(orgId || 'global', matchId, fingerprint);

    // Memory Check
    const entry = this.memoryCache.get(key);
    if (entry) {
      if (Date.now() - entry.timestamp < ttlMs) {
        return entry.data;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Redis placeholder check could go here for production
    // const redisData = await redis.get(key);
    // if (redisData) { ... }

    return null;
  }

  async set(
    orgId: string | undefined,
    matchId: string,
    prompt: string,
    contextData: any,
    data: any
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

    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Redis placeholder set
    // await redis.setex(key, ttlSeconds, JSON.stringify(data));
  }

  async invalidateOrg(orgId: string): Promise<void> {
    const prefix = `ai-cache:${orgId}:`;
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
  }

  async invalidateMatch(orgId: string, matchId: string): Promise<void> {
    const prefix = `ai-cache:${orgId}:${matchId}:`;
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const aiResponseCacheService = new ResponseCacheService();
