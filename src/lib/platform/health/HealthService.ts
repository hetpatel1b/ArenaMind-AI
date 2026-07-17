import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { config } from '../config/ConfigurationService';
import fs from 'fs';
import path from 'path';

// Instantiate clients here if they are only for health checks,
// or import the global instances.
import { prisma } from '@/lib/db/client';

let redisClient: Redis | null = null;
if (config.redisUrl) {
  redisClient = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: () => null, // Don't retry endlessly for health check
  });
}

export type HealthStatus = 'up' | 'down' | 'degraded';

export interface HealthCheckResult {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  components: {
    database: { status: HealthStatus; latencyMs?: number; error?: string };
    redis: { status: HealthStatus; latencyMs?: number; error?: string };
    storage: { status: HealthStatus; path: string; error?: string };
    aiProviders: {
      grok: { status: HealthStatus; model: string };
      gemini: { status: HealthStatus; model: string };
    };
  };
  metrics: {
    memory: NodeJS.MemoryUsage;
    cpu: NodeJS.CpuUsage;
  };
}

export class HealthService {
  /**
   * Performs a comprehensive health check on all critical infrastructure components.
   */
  static async checkHealth(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    const [dbResult, redisResult, storageResult] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkStorage(),
    ]);

    const grokStatus = config.grokApiKey ? 'up' : 'down';
    const geminiStatus = config.geminiApiKey ? 'up' : 'down';

    // Determine overall status
    let overallStatus: HealthStatus = 'up';
    if (dbResult.status === 'down' || redisResult.status === 'down') {
      overallStatus = 'down';
    } else if (
      storageResult.status === 'down' ||
      grokStatus === 'down' ||
      geminiStatus === 'down'
    ) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp,
      uptime,
      components: {
        database: dbResult,
        redis: redisResult,
        storage: storageResult,
        aiProviders: {
          grok: { status: grokStatus, model: config.grokModel },
          gemini: { status: geminiStatus, model: config.geminiModel },
        },
      },
      metrics: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
    };
  }

  private static async checkDatabase(): Promise<{
    status: HealthStatus;
    latencyMs?: number;
    error?: string;
  }> {
    const start = Date.now();
    try {
      // Execute a simple query
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'up', latencyMs: Date.now() - start };
    } catch (error) {
      return { status: 'down', error: error instanceof Error ? error.message : String(error) };
    }
  }

  private static async checkRedis(): Promise<{
    status: HealthStatus;
    latencyMs?: number;
    error?: string;
  }> {
    if (!redisClient) {
      return { status: 'down', error: 'Redis URL not configured' };
    }
    const start = Date.now();
    try {
      const response = await redisClient.ping();
      if (response !== 'PONG') throw new Error('Invalid Redis response');
      return { status: 'up', latencyMs: Date.now() - start };
    } catch (error) {
      return { status: 'down', error: error instanceof Error ? error.message : String(error) };
    }
  }

  private static async checkStorage(): Promise<{
    status: HealthStatus;
    path: string;
    error?: string;
  }> {
    const storagePath = path.resolve(config.storagePath);
    try {
      if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, { recursive: true });
      }
      // Check write access
      fs.accessSync(storagePath, fs.constants.W_OK | fs.constants.R_OK);
      return { status: 'up', path: storagePath };
    } catch (error) {
      return {
        status: 'down',
        path: storagePath,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
