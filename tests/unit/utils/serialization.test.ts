import { describe, it, expect } from 'vitest';
import { serializeToPlainObject } from '../../../src/lib/utils/serialization';

describe('Serialization', () => {
  it('returns null and undefined as is', () => {
    expect(serializeToPlainObject(null)).toBeNull();
    expect(serializeToPlainObject(undefined)).toBeUndefined();
  });

  it('returns primitives as is', () => {
    expect(serializeToPlainObject(42)).toBe(42);
    expect(serializeToPlainObject('hello')).toBe('hello');
    expect(serializeToPlainObject(true)).toBe(true);
  });

  it('converts Date objects to ISO strings', () => {
    const date = new Date('2026-01-01T12:00:00Z');
    const result = serializeToPlainObject(date);
    expect(result).toBe('2026-01-01T12:00:00.000Z');
    expect(typeof result).toBe('string');
  });

  it('converts Prisma Decimal objects to numbers', () => {
    // Mocking Prisma Decimal structure
    const decimalObj = {
      d: [1, 5],
      e: 0,
      s: 1,
      toNumber: () => 1.5,
    };

    const result = serializeToPlainObject(decimalObj);
    expect(result).toBe(1.5);
    expect(typeof result).toBe('number');
  });

  it('recursively serializes arrays', () => {
    const arr = [1, new Date('2026-01-01T12:00:00Z'), { a: new Date('2026-01-02T12:00:00Z') }];
    const result = serializeToPlainObject(arr) as unknown[];

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe('2026-01-01T12:00:00.000Z');
    expect((result[2] as { a: string }).a).toBe('2026-01-02T12:00:00.000Z');
  });

  it('recursively serializes nested objects', () => {
    const obj = {
      id: '123',
      createdAt: new Date('2026-01-01T12:00:00Z'),
      meta: {
        score: {
          d: [9, 9],
          e: 1,
          s: 1,
          toNumber: () => 99,
        },
        isActive: true,
      },
    };

    const result = serializeToPlainObject(obj) as {
      id: string;
      createdAt: string;
      meta: {
        score: number;
        isActive: boolean;
      };
    };

    expect(result.id).toBe('123');
    expect(result.createdAt).toBe('2026-01-01T12:00:00.000Z');
    expect(result.meta.score).toBe(99);
    expect(result.meta.isActive).toBe(true);
  });
});
