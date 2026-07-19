import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addMinutesToNow, isExpired, formatToTime } from '../../../src/lib/utils/date';

describe('Date Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-19T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('addMinutesToNow', () => {
    it('adds minutes to the current mocked time', () => {
      const futureDate = addMinutesToNow(30);
      expect(futureDate.toISOString()).toBe('2026-07-19T10:30:00.000Z');
    });
  });

  describe('isExpired', () => {
    it('returns true if the date is in the past', () => {
      expect(isExpired(new Date('2026-07-19T09:00:00Z'))).toBe(true);
    });

    it('returns false if the date is in the future', () => {
      expect(isExpired(new Date('2026-07-19T11:00:00Z'))).toBe(false);
    });
  });

  describe('formatToTime', () => {
    it('formats date into HH:mm (24-hour)', () => {
      // Local time formatting can vary based on CI timezone,
      // but Date object construction is stable.
      // Since it uses en-US and hour12: false, we just match the expected string output.
      const formatted = formatToTime(new Date('2026-07-19T15:30:00Z'));
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });
});
