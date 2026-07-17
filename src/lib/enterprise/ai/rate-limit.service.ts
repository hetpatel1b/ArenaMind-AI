export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  burstAllowed?: number;
}

export class RateLimitService {
  // In-memory token bucket implementation for hackathon
  private buckets: Map<string, { tokens: number; lastRefill: number }> = new Map();

  // Default configurations
  private configs: Record<string, RateLimitConfig> = {
    organization: { maxRequests: 1000, windowMs: 60000, burstAllowed: 50 },
    user: { maxRequests: 50, windowMs: 60000, burstAllowed: 10 },
    ip: { maxRequests: 100, windowMs: 60000, burstAllowed: 20 },
  };

  private getBucketKey(type: string, id: string): string {
    return `${type}:${id}`;
  }

  public async checkLimit(
    type: 'organization' | 'user' | 'ip' | 'apiKey',
    id: string
  ): Promise<{ allowed: boolean; retryAfterMs?: number }> {
    const config = this.configs[type] || this.configs['user']!;
    const key = this.getBucketKey(type, id);
    const now = Date.now();

    const bucket = this.buckets.get(key) || { tokens: config.maxRequests, lastRefill: now };

    // Refill tokens based on time passed
    const timePassed = now - bucket.lastRefill;
    const refillRate = config.maxRequests / config.windowMs;
    const newTokens = Math.floor(timePassed * refillRate);

    if (newTokens > 0) {
      bucket.tokens = Math.min(
        config.maxRequests + (config.burstAllowed || 0),
        bucket.tokens + newTokens
      );
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      this.buckets.set(key, bucket);
      return { allowed: true };
    }

    // Rate limited
    const timeUntilNextToken = Math.ceil(1 / refillRate - (now - bucket.lastRefill));
    return { allowed: false, retryAfterMs: timeUntilNextToken > 0 ? timeUntilNextToken : 1000 };
  }

  public getEnterpriseErrorPayload(retryAfterMs: number) {
    return {
      status: 'error',
      technicalMessage: 'Rate limit exceeded.',
      operatorMessage: 'You are submitting requests too quickly. Please wait a moment.',
      recommendedAction: `Wait ${Math.ceil(retryAfterMs / 1000)} seconds before retrying.`,
      retryAfter: retryAfterMs,
    };
  }
}

export const aiRateLimitService = new RateLimitService();
