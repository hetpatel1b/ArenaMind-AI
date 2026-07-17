export interface RequestStats {
  totalRequests: number;
  activeRequests: number;
  failedRequests: number;
  averageDuration: number;
  requestsPerMinute: number;
  p95Latency: number;
  p99Latency: number;
}

export class RequestMetricsService {
  private static totalRequests = 0;
  private static activeRequests = 0;
  private static failedRequests = 0;
  private static responseTimes: number[] = [];

  // For requests per minute tracking
  private static lastMinuteRequests = 0;
  private static currentMinuteStr = '';

  static startRequest() {
    this.activeRequests++;
    this.totalRequests++;

    const now = new Date();
    const minuteStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
    if (this.currentMinuteStr !== minuteStr) {
      this.currentMinuteStr = minuteStr;
      this.lastMinuteRequests = 0;
    }
    this.lastMinuteRequests++;
  }

  static endRequest(durationMs: number, failed = false) {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (failed) this.failedRequests++;

    this.responseTimes.push(durationMs);

    // Keep only last 1000 response times to avoid memory leaks
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }
  }

  static getStats(): RequestStats {
    const times = [...this.responseTimes].sort((a, b) => a - b);

    let averageDuration = 0;
    let p95Latency = 0;
    let p99Latency = 0;

    if (times.length > 0) {
      averageDuration = times.reduce((a, b) => a + b, 0) / times.length;
      p95Latency = times[Math.floor(times.length * 0.95)] || 0;
      p99Latency = times[Math.floor(times.length * 0.99)] || 0;
    }

    return {
      totalRequests: this.totalRequests,
      activeRequests: this.activeRequests,
      failedRequests: this.failedRequests,
      averageDuration,
      requestsPerMinute: this.lastMinuteRequests,
      p95Latency,
      p99Latency,
    };
  }
}
