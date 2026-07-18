export interface JobData {
  id: string;
  type: string;
  payload: any;
  priority: number; // 1 = High, 10 = Low
  retryCount?: number;
  maxRetries?: number;
}

export class AIJobQueueService {
  private queue: JobData[] = [];
  private deadLetterQueue: JobData[] = [];
  private processing = 0;
  private readonly MAX_CONCURRENCY = 5;

  // Future architecture points to Redis-backed BullMQ.
  // This is an in-memory polyfill for the hackathon/current infra constraints.

  public async add(job: JobData): Promise<void> {
    job.retryCount = job.retryCount || 0;
    job.maxRetries = job.maxRetries || 3;

    this.queue.push(job);
    this.queue.sort((a, b) => a.priority - b.priority); // Highest priority (lowest number) first

    // eslint-disable-next-line no-console
    console.log(
      `[AIJobQueue] Job ${job.id} added (Priority ${job.priority}). Queue length: ${this.queue.length}`
    );
    this.processQueue();
  }

  private async processQueue() {
    if (this.processing >= this.MAX_CONCURRENCY || this.queue.length === 0) {
      return;
    }

    this.processing++;
    const job = this.queue.shift();

    if (!job) {
      this.processing--;
      return;
    }

    try {
      await this.executeJob(job);
    } catch (error) {
      console.error(`[AIJobQueue] Job ${job.id} failed:`, error);
      if (job.retryCount! < job.maxRetries!) {
        job.retryCount!++;
        // eslint-disable-next-line no-console
        console.log(
          `[AIJobQueue] Re-queueing job ${job.id} (Attempt ${job.retryCount}/${job.maxRetries})`
        );
        this.queue.push(job); // Add back to queue (could implement exponential delay here)
      } else {
        console.warn(`[AIJobQueue] Job ${job.id} moved to dead-letter queue.`);
        this.deadLetterQueue.push(job);
      }
    } finally {
      this.processing--;
      this.processQueue(); // Process next
    }
  }

  private async executeJob(job: JobData): Promise<void> {
    // Abstract execution logic
    // This could route to different background agents or evaluation tasks
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Job Timeout')), 30000);

      // Simulated processing
      setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, 500);
    });
  }

  public getDeadLetterQueue() {
    return this.deadLetterQueue;
  }
}

export const aiJobQueueService = new AIJobQueueService();
