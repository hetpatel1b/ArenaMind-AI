export interface IRunnableJob<T = unknown> {
  name: string;
  execute(data: T): Promise<void>;
  onSuccess?(data: T): void;
  onFailure?(error: Error, data: T): void;
}
