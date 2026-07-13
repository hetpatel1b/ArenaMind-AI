import { CircuitBreaker } from '@/lib/infrastructure/utils/circuit-breaker';
import { withRetry } from '@/lib/infrastructure/utils/retry';
import { logger } from '@/lib/observability/logger';
import { errorTracker, ErrorSeverity } from '@/lib/observability/error-tracker';

export interface HttpClientOptions {
  timeoutMs?: number;
  retries?: number;
  circuitBreaker?: boolean;
}

export class HttpClient {
  private circuitBreaker = new CircuitBreaker(5, 30000);

  async request<T>(url: string, init?: RequestInit, opts?: HttpClientOptions): Promise<T> {
    const timeout = opts?.timeoutMs || 10000;
    const maxRetries = opts?.retries ?? 3;
    const useCircuitBreaker = opts?.circuitBreaker ?? true;

    const execute = async () => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...init,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        return (await response.json()) as T;
      } finally {
        clearTimeout(id);
      }
    };

    const action = () => withRetry(execute, { maxRetries, baseDelayMs: 1000, exponential: true });

    try {
      if (useCircuitBreaker) {
        return await this.circuitBreaker.execute(action);
      }
      return await action();
    } catch (error: any) {
      errorTracker.captureException(error, ErrorSeverity.WARNING, {
        url,
        method: init?.method || 'GET',
      });
      throw error;
    }
  }
}

export const httpClient = new HttpClient();
