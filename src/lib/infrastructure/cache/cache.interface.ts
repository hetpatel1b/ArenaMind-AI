export interface ICacheOptions {
  ttlSeconds?: number;
}

export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: ICacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
