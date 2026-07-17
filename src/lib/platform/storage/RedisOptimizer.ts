import Redis from 'ioredis';
import { config } from '../config/ConfigurationService';
import { LoggerService } from '../observability/LoggerService';

export class RedisOptimizer {
  private static client: Redis | null = null;

  static getClient(): Redis {
    if (this.client) return this.client;

    if (!config.redisUrl) {
      LoggerService.warn('Redis URL not configured. Returning unconfigured client.');
      // Return a dummy client to avoid crashing if Redis is strictly needed but unavailable
      return new Redis({ lazyConnect: true });
    }

    // High performance connection pooling configuration
    this.client = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      keepAlive: 10000,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          // Only reconnect when the error contains "READONLY"
          return true;
        }
        return false;
      },
    });

    this.client.on('error', (err) => {
      LoggerService.error('RedisOptimizer Client Error', err);
    });

    return this.client;
  }

  /**
   * Compression-aware set (mocks snappy/lz4 for now by just JSON stringifying)
   * A true production implementation would `import * as snappy from 'snappy'`
   */
  static async setCompressed(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const client = this.getClient();
    const payload = JSON.stringify(value);
    // Imagine Snappy compression here: const compressed = snappy.compressSync(payload);

    if (ttlSeconds) {
      await client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await client.set(key, payload);
    }
  }

  static async getCompressed<T>(key: string): Promise<T | null> {
    const client = this.getClient();
    const result = await client.get(key);
    if (!result) return null;

    // Imagine Snappy decompression here: const uncompressed = snappy.uncompressSync(result);
    try {
      return JSON.parse(result) as T;
    } catch (e) {
      LoggerService.error('Failed to parse cached payload', e);
      return null;
    }
  }

  static generateNamespacedKey(namespace: string, id: string): string {
    return `arenamind:${namespace}:${id}`;
  }
}
