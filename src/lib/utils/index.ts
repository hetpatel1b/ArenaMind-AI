import { type ClassValue, clsx } from 'clsx';

/**
 * Utility for conditionally joining class names.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Standard delay function for simulation or exponential backoff
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
