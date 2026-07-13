import { PaginatedMeta } from '@/types/api.types';

export function calculatePaginationMeta(
  totalCount: number,
  page: number,
  limit: number
): PaginatedMeta {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    page,
    limit,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
