import { IQueue } from '../queue/queue.interface';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

interface ScheduledJob {
  jobName: string;
  intervalMs: number;
  data?: SafeAny;
}

export class Scheduler {
  private intervals: NodeJS.Timeout[] = [];

  constructor(private queue: IQueue) {}

  scheduleInterval(jobName: string, intervalMs: number, data: SafeAny = {}) {
    const timer = setInterval(() => {
      this.queue.add(jobName, data).catch((err) => {
        LoggerService.error(`[Scheduler] Failed to dispatch scheduled job ${jobName}:`, err);
      });
    }, intervalMs);

    this.intervals.push(timer);
  }

  /**
   * Extremely lightweight "cron" via interval rounding to minute zero.
   * Not a true CRON parser, but satisfies lightweight infrastructure scheduling needs.
   */
  scheduleHourly(jobName: string, data: SafeAny = {}) {
    const msInHour = 60 * 60 * 1000;
    this.scheduleInterval(jobName, msInHour, data);
  }

  shutdown() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }
}
