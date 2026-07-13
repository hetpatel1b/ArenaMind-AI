export interface IJobOptions {
  delay?: number;
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
}

export interface IJob<T = any> {
  id: string;
  name: string;
  data: T;
  opts?: IJobOptions;
}

export interface IQueue<T = any> {
  name: string;
  add(name: string, data: T, opts?: IJobOptions): Promise<IJob<T>>;
  process(handler: (job: IJob<T>) => Promise<void>): void;
}
