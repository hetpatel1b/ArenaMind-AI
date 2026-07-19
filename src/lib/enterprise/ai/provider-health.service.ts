import { AIProviderType } from './types';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export interface ProviderHealth {
  status: 'healthy' | 'degraded' | 'down';
  lastSuccess?: number;
  lastFailure?: number;
  totalRequests: number;
  totalFailures: number;
  errorRate: number;
  averageLatencyMs: number;
  consecutiveFailures: number;
}

export class ProviderHealthService {
  private healthState: Map<AIProviderType, ProviderHealth> = new Map();

  // Circuit breaker thresholds
  private readonly MAX_CONSECUTIVE_FAILURES = 5;
  private readonly RECOVERY_TIMEOUT_MS = 60000; // 1 minute

  constructor() {
    this.healthState.set('grok', this.defaultHealth());
    this.healthState.set('gemini', this.defaultHealth());
  }

  private defaultHealth(): ProviderHealth {
    return {
      status: 'healthy',
      totalRequests: 0,
      totalFailures: 0,
      errorRate: 0,
      averageLatencyMs: 0,
      consecutiveFailures: 0,
    };
  }

  public recordSuccess(provider: AIProviderType, latencyMs: number): void {
    const state = this.healthState.get(provider) || this.defaultHealth();

    state.totalRequests++;
    state.lastSuccess = Date.now();
    state.consecutiveFailures = 0;

    // Exponential moving average for latency
    state.averageLatencyMs =
      state.averageLatencyMs === 0 ? latencyMs : state.averageLatencyMs * 0.9 + latencyMs * 0.1;

    state.errorRate = state.totalFailures / state.totalRequests;

    // Auto-recover
    if (state.status === 'down' || state.status === 'degraded') {
      LoggerService.info(`[ProviderHealth] ${provider} recovered and is now healthy.`);
      state.status = 'healthy';
    }

    this.healthState.set(provider, state);
  }

  public recordFailure(provider: AIProviderType): void {
    const state = this.healthState.get(provider) || this.defaultHealth();

    state.totalRequests++;
    state.totalFailures++;
    state.consecutiveFailures++;
    state.lastFailure = Date.now();
    state.errorRate = state.totalFailures / state.totalRequests;

    if (state.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
      if (state.status !== 'down') {
        LoggerService.warn(
          `[ProviderHealth] Circuit breaker tripped for ${provider}. Marking as down.`
        );
        state.status = 'down';
      }
    } else if (state.consecutiveFailures >= 2) {
      state.status = 'degraded';
    }

    this.healthState.set(provider, state);
  }

  public isHealthy(provider: AIProviderType): boolean {
    const state = this.healthState.get(provider) || this.defaultHealth();

    if (state.status === 'down') {
      // Check for recovery timeout
      if (state.lastFailure && Date.now() - state.lastFailure > this.RECOVERY_TIMEOUT_MS) {
        // Half-open state
        LoggerService.info(`[ProviderHealth] Testing recovery for ${provider}...`);
        return true;
      }
      return false;
    }
    return true;
  }

  public getHealth(provider: AIProviderType): ProviderHealth {
    return this.healthState.get(provider) || this.defaultHealth();
  }
}

export const aiProviderHealthService = new ProviderHealthService();
