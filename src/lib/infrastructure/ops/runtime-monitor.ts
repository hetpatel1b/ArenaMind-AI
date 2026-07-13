export class RuntimeMonitor {
  getMemoryUsage() {
    const mem = process.memoryUsage();
    return {
      rssMb: Math.round(mem.rss / 1024 / 1024),
      heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      externalMb: Math.round(mem.external / 1024 / 1024),
    };
  }

  getCpuUsage() {
    const usage = process.cpuUsage();
    return {
      userMs: Math.round(usage.user / 1000),
      systemMs: Math.round(usage.system / 1000),
    };
  }

  getUptimeSeconds() {
    return Math.round(process.uptime());
  }

  getSnapshot() {
    return {
      memory: this.getMemoryUsage(),
      cpu: this.getCpuUsage(),
      uptimeSeconds: this.getUptimeSeconds(),
      timestamp: new Date().toISOString(),
    };
  }
}

export const runtimeMonitor = new RuntimeMonitor();
