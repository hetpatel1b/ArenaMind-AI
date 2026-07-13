export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  exponential: boolean;
}

/**
 * Retries an asynchronous function based on the provided options.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = { maxRetries: 3, baseDelayMs: 1000, exponential: true }
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > options.maxRetries) {
        throw error;
      }

      const delay = options.exponential
        ? options.baseDelayMs * Math.pow(2, attempt - 1)
        : options.baseDelayMs;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
