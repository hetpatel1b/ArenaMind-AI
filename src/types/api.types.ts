/**
 * Standardized API response wrappers.
 */

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  dev_message?: string;
}

export interface ApiResult<T> {
  data?: T;
  error?: ApiError;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}
