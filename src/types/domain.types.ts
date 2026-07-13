/**
 * Core domain types used across services and repositories.
 */

export type ITransaction = unknown;

export type SortOrder = 'asc' | 'desc';

export interface SortOptions<T = string> {
  field: T;
  order: SortOrder;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Common filter operators.
 */
export type FilterOperator =
  'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'notIn' | 'isNull' | 'isNotNull';

export interface FilterCondition<TField = string> {
  field: TField;
  operator: FilterOperator;
  value?: unknown;
}
