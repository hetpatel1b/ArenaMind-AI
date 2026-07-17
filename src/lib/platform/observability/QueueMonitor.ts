export class QueueMonitor {
  // Mocked state for in-memory queue metrics until a real queue like BullMQ is integrated
  private static queuedJobs = 0;
  private static runningJobs = 0;
  private static failedJobs = 0;
  private static retryJobs = 0;
  private static totalProcessingTime = 0;
  private static processedJobs = 0;
  private static dlqDepth = 0;
  private static workerActive = true;

  static recordJobQueued() {
    this.queuedJobs++;
  }

  static recordJobStarted() {
    if (this.queuedJobs > 0) this.queuedJobs--;
    this.runningJobs++;
  }

  static recordJobCompleted(processingTimeMs: number) {
    if (this.runningJobs > 0) this.runningJobs--;
    this.processedJobs++;
    this.totalProcessingTime += processingTimeMs;
  }

  static recordJobFailed(willRetry: boolean) {
    if (this.runningJobs > 0) this.runningJobs--;
    if (willRetry) {
      this.retryJobs++;
    } else {
      this.failedJobs++;
      this.dlqDepth++;
    }
  }

  static getStats() {
    const avgProcessingTime =
      this.processedJobs > 0 ? this.totalProcessingTime / this.processedJobs : 0;

    return {
      queuedJobs: this.queuedJobs,
      runningJobs: this.runningJobs,
      failedJobs: this.failedJobs,
      retryJobs: this.retryJobs,
      averageProcessingTime: avgProcessingTime,
      deadLetterQueue: this.dlqDepth,
      workerHealth: this.workerActive ? 'HEALTHY' : 'DOWN',
    };
  }
}
