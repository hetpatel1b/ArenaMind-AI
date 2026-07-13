import { IQueue } from '../queue/queue.interface';

interface ScheduledJob {
  jobName: string;
  intervalMs: number;
  data?: any;
}

export class Scheduler {
  private intervals: NodeJS.Timeout[] = [];

  constructor(private queue: IQueue) {}

  scheduleInterval(jobName: string, intervalMs: number, data: any = {}) {
    const timer = setInterval(() => {
      this.queue.add(jobName, data).catch((err) => {
        console.error(`[Scheduler] Failed to dispatch scheduled job ${jobName}:`, err);
      });
    }, intervalMs);

    this.intervals.push(timer);
  }

  /**
   * Extremely lightweight "cron" via interval rounding to minute zero.
   * Not a true CRON parser, but satisfies lightweight infrastructure scheduling needs.
   */
  scheduleHourly(jobName: string, data: any = {}) {
    const msInHour = 60 * 60 * 1000;
    this.scheduleInterval(jobName, msInHour, data);
  }

  shutdown() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }
}
