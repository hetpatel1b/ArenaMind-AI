/* eslint-disable @typescript-eslint/no-require-imports */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  NumberFormatter,
  DateFormatter,
  PercentageFormatter,
} from '../../../src/lib/utils/formatters';

describe.skip('Formatters', () => {
  describe.skip('NumberFormatter', () => {
    it.skip('formats normal numbers', () => {
      expect(NumberFormatter.format(1000)).toBe('1,000');
    });

    it.skip('formats decimals correctly', () => {
      expect(NumberFormatter.formatWithDecimals(10.123, 2)).toBe('10.12');
      expect(NumberFormatter.formatWithDecimals(10, 2)).toBe('10');
    });

    it.skip('formats metric numbers correctly', () => {
      expect(NumberFormatter.formatMetric(1500)).toBe('1.5K');
      expect(NumberFormatter.formatMetric(1500000)).toBe('1.5M');
      expect(NumberFormatter.formatMetric(500)).toBe('500');
    });
  });

  describe.skip('DateFormatter', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-07-19T10:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.skip('formats relative times correctly', () => {
      const now = Date.now();

      // Just now
      expect(DateFormatter.formatRelative(now)).toBe('Just now');

      // Minutes ago
      expect(DateFormatter.formatRelative(now - 5 * 60000)).toBe('5m ago');

      // Hours ago
      expect(DateFormatter.formatRelative(now - 2 * 3600000)).toBe('2h ago');
    });
  });

  describe.skip('PercentageFormatter', () => {
    it.skip('formats percentages with default 0 decimals', () => {
      expect(PercentageFormatter.format(50)).toBe('50%');
      expect(PercentageFormatter.format(50.123)).toBe('50%');
    });

    it.skip('formats percentages with custom decimals', () => {
      expect(PercentageFormatter.format(50.123, 2)).toBe('50.12%');
    });
  });
});

describe.skip('Formatters Edge Cases', () => {
  it.skip('formatCurrency with valid string', () => {
    const { formatCurrency } = require('@/lib/utils/formatters');
    expect(formatCurrency('12.50')).toBe('$12.50');
  });

  it.skip('formatCurrency with invalid input', () => {
    const { formatCurrency } = require('@/lib/utils/formatters');
    expect(formatCurrency('abc')).toBe('$0.00');
    expect(formatCurrency(null)).toBe('$0.00');
  });
  
  it.skip('truncate string that is too short', () => {
    const { truncateText } = require('@/lib/utils/formatters');
    expect(truncateText('Short', 10)).toBe('Short');
  });
});