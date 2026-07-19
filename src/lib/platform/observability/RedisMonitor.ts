import Redis from 'ioredis';
import { config } from '../config/ConfigurationService';

let redisClient: Redis | null = null;
if (config.redisUrl) {
  redisClient = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
  });
  redisClient.on('error', () => {});
}

export class RedisMonitor {
  static async getStats() {
    if (!redisClient) {
      return { status: 'UNCONFIGURED' };
    }

    try {
      const info = await redisClient.info();

      // Basic manual parsing of redis info string
      const parseValue = (key: string) => {
        const match = info?.match(new RegExp(`${key}:([0-9.]+)`));
        return match ? parseFloat(match[1] || '0') : 0;
      };

      const connections = parseValue('connected_clients');
      const memory = parseValue('used_memory');
      const hits = parseValue('keyspace_hits');
      const misses = parseValue('keyspace_misses');
      const evictions = parseValue('evicted_keys');

      const totalOps = hits + misses;
      const hitRate = totalOps > 0 ? (hits / totalOps) * 100 : 0;
      const missRate = totalOps > 0 ? (misses / totalOps) * 100 : 0;

      // Ping for latency
      const start = Date.now();
      await redisClient.ping();
      const latency = Date.now() - start;

      return {
        connections,
        memory,
        keys: 0, // Would require scanning or specific db size check
        hitRate,
        missRate,
        evictions,
        latency,
      };
    } catch (e) {
      return { status: 'ERROR', error: String(e) };
    }
  }
}
