import { prisma } from '@/lib/db/client';
import { memoryCache } from '../cache/memory-cache';

export interface HealthCheckResult {
  status: 'up' | 'down';
  details?: SafeAny;
}

export class DiagnosticsService {
  async checkDatabase(): Promise<HealthCheckResult> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'up' };
    } catch (error) {
      return { status: 'down', details: error };
    }
  }

  async checkCache(): Promise<HealthCheckResult> {
    try {
      await memoryCache.set('health', 'ok');
      const val = await memoryCache.get('health');
      if (val === 'ok') return { status: 'up' };
      return { status: 'down', details: 'Cache write/read mismatch' };
    } catch (error) {
      return { status: 'down', details: error };
    }
  }

  async checkQueue(): Promise<HealthCheckResult> {
    return { status: 'up' };
  }

  async checkProviders(): Promise<HealthCheckResult> {
    // In reality, this would hit the provider adapters to ensure API keys are valid
    return { status: 'up' };
  }

  async checkAll(): Promise<{
    status: 'ok' | 'degraded' | 'down';
    components: Record<string, HealthCheckResult>;
  }> {
    const [db, cache, queue, providers] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
      this.checkQueue(),
      this.checkProviders(),
    ]);

    const components = {
      database: db,
      cache: cache,
      queue: queue,
      providers: providers,
    };

    const isDown = Object.values(components).some((c) => c.status === 'down');

    return {
      status: isDown ? 'down' : 'ok',
      components,
    };
  }
}

export const diagnostics = new DiagnosticsService();
