import { IQueue, IJob, IJobOptions } from './queue.interface';

export class MemoryQueue<T = any> implements IQueue<T> {
  public name: string;
  private queue: IJob<T>[] = [];
  private processing = false;
  private handler?: (job: IJob<T>) => Promise<void>;

  constructor(name: string) {
    this.name = name;
  }

  async add(name: string, data: T, opts?: IJobOptions): Promise<IJob<T>> {
    const job: IJob<T> = {
      id: crypto.randomUUID(),
      name,
      data,
      opts: { attempts: 3, delay: 0, ...opts },
    };
    this.queue.push(job);
    this.startProcessing();
    return job;
  }

  process(handler: (job: IJob<T>) => Promise<void>): void {
    this.handler = handler;
    this.startProcessing();
  }

  private startProcessing() {
    if (this.processing || !this.handler || this.queue.length === 0) return;
    this.processing = true;

    // Process asynchronously without blocking the event loop natively
    setTimeout(async () => {
      while (this.queue.length > 0) {
        const job = this.queue.shift();
        if (job && this.handler) {
          try {
            await this.handler(job);
          } catch (err) {
            console.error(`[Queue ${this.name}] Job ${job.id} handler error:`, err);
            // Job failure logic handled upstream by the worker wrapping the handler.
          }
        }
      }
      this.processing = false;
    }, 0);
  }
}
