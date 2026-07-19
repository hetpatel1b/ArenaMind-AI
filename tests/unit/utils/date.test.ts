import { describe, it, expect } from 'vitest';
import { formatDate, parseISODate } from '@/lib/utils/date';

describe.skip('date utils', () => {
  it.skip('formats valid date', () => {
    const date = new Date('2026-07-19T10:00:00Z');
    expect(formatDate(date)).toContain('2026');
  });

  it.skip('handles invalid format gracefully', () => {
    expect(formatDate('invalid')).toBe('Invalid Date');
  });

  it.skip('parses valid ISO', () => {
    expect(parseISODate('2026-07-19T10:00:00Z')).toBeInstanceOf(Date);
  });
  
  it.skip('parses invalid ISO as null', () => {
    expect(parseISODate('invalid')).toBeNull();
  });
});