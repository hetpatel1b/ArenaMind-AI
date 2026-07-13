import { logger } from './logger';

export class MetricsRegistry {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();

  incrementCounter(name: string, value: number = 1, tags?: Record<string, string>) {
    const key = this.buildKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
    logger.debug('Metric Incremented', { metric: 'counter', name, value, tags });
  }

  setGauge(name: string, value: number, tags?: Record<string, string>) {
    const key = this.buildKey(name, tags);
    this.gauges.set(key, value);
    logger.debug('Metric Gauge Set', { metric: 'gauge', name, value, tags });
  }

  recordHistogram(name: string, valueMs: number, tags?: Record<string, string>) {
    // In memory, we just log the histogram event.
    // An external system like DataDog Agent aggregates this into buckets.
    logger.info('Histogram Record', { metric: 'histogram', name, valueMs, tags });
  }

  private buildKey(name: string, tags?: Record<string, string>) {
    if (!tags) return name;
    return `${name}_${JSON.stringify(tags)}`;
  }
}

export const metrics = new MetricsRegistry();
