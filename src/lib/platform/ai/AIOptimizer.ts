import { RedisOptimizer } from '../storage/RedisOptimizer';
import { LoggerService } from '../observability/LoggerService';
import { createHash } from 'crypto';

export interface AICacheConfig {
  ttlSeconds: number;
}

export class AIOptimizer {
  private static readonly DEFAULT_TTL = 3600; // 1 hour

  /**
   * Generates a stable hash for a prompt string to be used as a cache key.
   */
  private static hashPrompt(prompt: string): string {
    return createHash('sha256').update(prompt).digest('hex');
  }

  /**
   * Attempts to retrieve a cached AI response.
   */
  static async getCachedResponse(prompt: string): Promise<string | null> {
    const hash = this.hashPrompt(prompt);
    const key = RedisOptimizer.generateNamespacedKey('ai-cache', hash);
    const cached = await RedisOptimizer.getCompressed<{ response: string }>(key);

    if (cached) {
      LoggerService.debug('AI Prompt Cache Hit', { hash });
      return cached.response;
    }

    return null;
  }

  /**
   * Caches an AI response for future identical prompts.
   */
  static async cacheResponse(
    prompt: string,
    response: string,
    config?: AICacheConfig
  ): Promise<void> {
    const hash = this.hashPrompt(prompt);
    const key = RedisOptimizer.generateNamespacedKey('ai-cache', hash);
    const ttl = config?.ttlSeconds || this.DEFAULT_TTL;

    await RedisOptimizer.setCompressed(key, { response }, ttl);
    LoggerService.debug('AI Prompt Cached', { hash, ttl });
  }

  /**
   * Compresses conversational context to stay within token limits optimally.
   * Simple heuristic: keeps the system prompt and the N most recent messages.
   */
  static compressContext<T>(messages: T[], maxHistory: number = 10): T[] {
    if (messages.length <= maxHistory) return messages;

    // Assume first message is System Prompt, keep it.
    const systemPrompt = messages[0] as T;
    const recentMessages = messages.slice(-(maxHistory - 1));

    return [systemPrompt, ...recentMessages];
  }
}
