import { z } from 'zod';
import { paginationSchema, sortSchema, searchSchema } from '../validation/base.schema';

/**
 * Standard query parameters expected by GET collection endpoints.
 */
export const QueryParamsSchema = z.object({
  pagination: paginationSchema.optional(),
  sort: z.array(sortSchema).optional(),
  search: searchSchema.optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
});

export type QueryParamsDTO = z.infer<typeof QueryParamsSchema>;

/**
 * Parses raw URLSearchParams into the structured QueryParamsDTO.
 */
export function parseQueryParams(searchParams: URLSearchParams): QueryParamsDTO {
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const sortField = searchParams.get('sort');
  const sortOrder = searchParams.get('order');
  const query = searchParams.get('q');

  const filters: Record<string, SafeAny> = {};
  for (const [key, value] of searchParams.entries()) {
    if (!['page', 'limit', 'sort', 'order', 'q'].includes(key)) {
      if (filters[key]) {
        filters[key] = Array.isArray(filters[key])
          ? [...filters[key], value]
          : [filters[key], value];
      } else {
        filters[key] = value;
      }
    }
  }

  return {
    pagination:
      page || limit
        ? {
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
          }
        : undefined,
    sort: sortField
      ? [
          {
            field: sortField,
            order: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'desc',
          },
        ]
      : undefined,
    search: query ? { query } : undefined,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  };
}

/**
 * Safely extracts only the explicitly whitelisted filters from the parsed query.
 * Optionally allows custom transform functions per key (e.g. string to number).
 */
export function extractAllowedFilters(
  rawFilters: Record<string, SafeAny> | undefined,
  allowedKeys: string[],
  transforms?: Record<string, (val: SafeAny) => unknown>
): Record<string, SafeAny> {
  const safeFilters: Record<string, SafeAny> = {};
  if (!rawFilters) return safeFilters;

  for (const key of allowedKeys) {
    if (rawFilters[key] !== undefined) {
      if (transforms && transforms[key]) {
        const transformed = transforms[key](rawFilters[key]);
        if (transformed !== undefined && !Number.isNaN(transformed)) {
          safeFilters[key] = transformed;
        }
      } else {
        safeFilters[key] = rawFilters[key];
      }
    }
  }
  return safeFilters;
}
