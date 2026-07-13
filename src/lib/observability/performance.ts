import { metrics } from './metrics';
import { logger } from './logger';
import { tracer } from './tracer';

export class PerformanceMonitor {
  async trackExecution<T>(
    name: string,
    thresholdMs: number,
    executionFn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const span = tracer.startSpan(name);
    const start = Date.now();

    try {
      const result = await executionFn();
      return result;
    } finally {
      const duration = Date.now() - start;
      span.end();

      metrics.recordHistogram(name, duration, tags);

      if (duration > thresholdMs) {
        logger.warn(`Execution exceeded performance threshold`, {
          name,
          duration,
          thresholdMs,
          tags,
          spanId: span.spanId,
          traceId: span.traceId,
        });
      }
    }
  }
}

export const performance = new PerformanceMonitor();
