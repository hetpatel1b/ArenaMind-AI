import { IQueue, IJob } from '../queue/queue.interface';
import { jobRegistry } from './job-registry';
import { jobMetrics } from '../monitoring/job-metrics';
import { withRetry } from '../utils/retry';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export class Worker {
  constructor(private queue: IQueue) {
    this.start();
  }

  private start() {
    this.queue.process(async (job: IJob) => {
      const runnable = jobRegistry.getJob(job.name);
      if (!runnable) {
        LoggerService.error(`[Worker] Unknown job type: ${job.name}. Pushing to DLQ.`);
        jobMetrics.incrementDlq();
        return;
      }

      jobMetrics.incrementActive();

      try {
        const attempts = job.opts?.attempts || 1;
        const delay = job.opts?.backoff?.delay || 1000;
        const exponential = job.opts?.backoff?.type === 'exponential';

        await withRetry(() => runnable.execute(job.data), {
          maxRetries: attempts - 1,
          baseDelayMs: delay,
          exponential,
        });

        jobMetrics.incrementProcessed();
        if (runnable.onSuccess) runnable.onSuccess(job.data);
      } catch (error: SafeAny) {
        LoggerService.error(`[Worker] Job ${job.id} failed entirely. Routing to DLQ.`, error);
        jobMetrics.incrementFailed();
        jobMetrics.incrementDlq();

        if (runnable.onFailure) {
          runnable.onFailure(error instanceof Error ? error : new Error(String(error)), job.data);
        }
        // In a real Redis-backed system, this implies leaving it in the 'failed' sorted set.
      } finally {
        jobMetrics.decrementActive();
      }
    });
  }
}
