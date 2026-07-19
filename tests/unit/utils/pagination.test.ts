import { describe, it, expect } from 'vitest';
import { calculatePaginationMeta, getOffset } from '../../../src/lib/utils/pagination';

describe('Pagination Utilities', () => {
  describe('calculatePaginationMeta', () => {
    it('calculates correct metadata for a basic case', () => {
      const meta = calculatePaginationMeta(100, 1, 10);
      expect(meta).toEqual({
        page: 1,
        limit: 10,
        totalCount: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('calculates correct metadata for the last page', () => {
      const meta = calculatePaginationMeta(100, 10, 10);
      expect(meta).toEqual({
        page: 10,
        limit: 10,
        totalCount: 100,
        totalPages: 10,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it('handles empty results', () => {
      const meta = calculatePaginationMeta(0, 1, 10);
      expect(meta).toEqual({
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });

  describe('getOffset', () => {
    it('returns 0 for page 1', () => {
      expect(getOffset(1, 10)).toBe(0);
    });

    it('calculates offset correctly for subsequent pages', () => {
      expect(getOffset(2, 10)).toBe(10);
      expect(getOffset(5, 20)).toBe(80);
    });
  });
});
