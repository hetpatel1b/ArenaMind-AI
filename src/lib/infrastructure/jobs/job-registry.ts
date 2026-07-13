import { IRunnableJob } from './job.interface';

export class JobRegistry {
  private jobs: Map<string, IRunnableJob> = new Map();

  register(job: IRunnableJob): void {
    if (this.jobs.has(job.name)) {
      throw new Error(`Job with name ${job.name} is already registered.`);
    }
    this.jobs.set(job.name, job);
  }

  getJob(name: string): IRunnableJob | undefined {
    return this.jobs.get(name);
  }

  getAllRegisteredNames(): string[] {
    return Array.from(this.jobs.keys());
  }
}

export const jobRegistry = new JobRegistry();
