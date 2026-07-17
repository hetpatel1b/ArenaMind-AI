import { LoggerService } from './LoggerService';

export interface SystemMetrics {
  uptime: number;
  memory: NodeJS.MemoryUsage;
  cpu: NodeJS.CpuUsage;
  heap: {
    total: number;
    used: number;
    limit: number;
  };
  gc: {
    collections: number;
    duration: number;
  };
}

export class MonitoringService {
  private static gcCollections = 0;
  private static gcDuration = 0;

  static initialize() {
    // In Node.js >= 16, we can use perf_hooks for GC tracking if we want
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PerformanceObserver, performance } = require('perf_hooks');
      const obs = new PerformanceObserver((list: any) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          this.gcCollections++;
          this.gcDuration += entry.duration;
        }
      });
      obs.observe({ entryTypes: ['gc'] });
    } catch (e) {
      LoggerService.debug('GC monitoring not available in this environment');
    }
  }

  static getSystemMetrics(): SystemMetrics {
    const memory = process.memoryUsage();

    // v8 module provides heap statistics
    let heapStats = {
      total_heap_size: memory.heapTotal,
      used_heap_size: memory.heapUsed,
      heap_size_limit: 0,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const v8 = require('v8');
      heapStats = v8.getHeapStatistics();
    } catch (e) {
      // Ignored
    }

    return {
      uptime: process.uptime(),
      memory,
      cpu: process.cpuUsage(),
      heap: {
        total: heapStats.total_heap_size,
        used: heapStats.used_heap_size,
        limit: heapStats.heap_size_limit,
      },
      gc: {
        collections: this.gcCollections,
        duration: this.gcDuration,
      },
    };
  }
}
