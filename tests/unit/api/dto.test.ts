import { describe, it, expect } from 'vitest';
import { parseQueryParams, extractAllowedFilters, QueryParamsSchema } from '@/lib/api/dto';

describe('DTO Utilities', () => {
  describe('QueryParamsSchema', () => {
    it('validates a valid query params object', () => {
      const result = QueryParamsSchema.safeParse({
        pagination: { page: 1, limit: 10 },
        sort: [{ field: 'createdAt', order: 'desc' }],
        search: { query: 'test' },
        filters: { status: 'active' },
      });
      expect(result.success).toBe(true);
    });

    it('allows partial query params object', () => {
      const result = QueryParamsSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('parseQueryParams', () => {
    it('parses empty search params', () => {
      const params = new URLSearchParams('');
      const parsed = parseQueryParams(params);
      expect(parsed).toEqual({
        pagination: undefined,
        sort: undefined,
        search: undefined,
        filters: undefined,
      });
    });

    it('parses pagination', () => {
      const params = new URLSearchParams('page=2&limit=20');
      const parsed = parseQueryParams(params);
      expect(parsed.pagination).toEqual({ page: 2, limit: 20 });
    });

    it('defaults pagination missing parts', () => {
      let params = new URLSearchParams('page=2');
      let parsed = parseQueryParams(params);
      expect(parsed.pagination).toEqual({ page: 2, limit: 10 });

      params = new URLSearchParams('limit=20');
      parsed = parseQueryParams(params);
      expect(parsed.pagination).toEqual({ page: 1, limit: 20 });
    });

    it('parses sort', () => {
      const params = new URLSearchParams('sort=name&order=asc');
      const parsed = parseQueryParams(params);
      expect(parsed.sort).toEqual([{ field: 'name', order: 'asc' }]);
    });

    it('defaults sort order to desc if invalid or missing', () => {
      const params = new URLSearchParams('sort=name&order=invalid');
      const parsed = parseQueryParams(params);
      expect(parsed.sort).toEqual([{ field: 'name', order: 'desc' }]);
    });

    it('parses search query', () => {
      const params = new URLSearchParams('q=hello');
      const parsed = parseQueryParams(params);
      expect(parsed.search).toEqual({ query: 'hello' });
    });

    it('parses additional filters', () => {
      const params = new URLSearchParams('status=active&type=admin');
      const parsed = parseQueryParams(params);
      expect(parsed.filters).toEqual({ status: 'active', type: 'admin' });
    });

    it('groups multiple filters with same key into array', () => {
      const params = new URLSearchParams('status=active&status=pending');
      const parsed = parseQueryParams(params);
      expect(parsed.filters).toEqual({ status: ['active', 'pending'] });
    });

    it('appends to existing array filter', () => {
      const params = new URLSearchParams('status=active&status=pending&status=closed');
      const parsed = parseQueryParams(params);
      expect(parsed.filters).toEqual({ status: ['active', 'pending', 'closed'] });
    });
  });

  describe('extractAllowedFilters', () => {
    it('returns empty object if rawFilters is undefined', () => {
      const extracted = extractAllowedFilters(undefined, ['status']);
      expect(extracted).toEqual({});
    });

    it('extracts only allowed filters', () => {
      const raw = { status: 'active', secret: 'hidden' };
      const extracted = extractAllowedFilters(raw, ['status']);
      expect(extracted).toEqual({ status: 'active' });
    });

    it('applies transforms if provided', () => {
      const raw = { age: '25' };
      const extracted = extractAllowedFilters(raw, ['age'], {
        age: (val) => parseInt(val as string, 10),
      });
      expect(extracted).toEqual({ age: 25 });
    });

    it('ignores transform if result is NaN', () => {
      const raw = { age: 'invalid' };
      const extracted = extractAllowedFilters(raw, ['age'], {
        age: (val) => parseInt(val as string, 10),
      });
      expect(extracted).toEqual({});
    });

    it('ignores transform if result is undefined', () => {
      const raw = { age: '25' };
      const extracted = extractAllowedFilters(raw, ['age'], {
        age: () => undefined,
      });
      expect(extracted).toEqual({});
    });

    it('handles missing filter in raw payload', () => {
      const raw = { status: 'active' };
      const extracted = extractAllowedFilters(raw, ['status', 'type']);
      expect(extracted).toEqual({ status: 'active' });
    });
  });
});
