export class JobMetrics {
  private metrics = {
    processed: 0,
    failed: 0,
    dlq: 0,
    active: 0,
  };

  incrementProcessed() {
    this.metrics.processed++;
  }
  incrementFailed() {
    this.metrics.failed++;
  }
  incrementDlq() {
    this.metrics.dlq++;
  }
  incrementActive() {
    this.metrics.active++;
  }
  decrementActive() {
    this.metrics.active = Math.max(0, this.metrics.active - 1);
  }

  getSnapshot() {
    return { ...this.metrics };
  }
}

export const jobMetrics = new JobMetrics();
