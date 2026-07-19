import { describe, it, expect } from 'vitest';
import {
  StatusMapper,
  SeverityMapper,
  ScoreMapper,
  DensityMapper,
  PriorityMapper,
} from '../../../src/lib/utils/mappers';
import { ThemeTokens } from '../../../src/lib/constants/theme';

describe('Mappers', () => {
  describe('StatusMapper', () => {
    it('returns success color for positive statuses', () => {
      const statuses = [
        'active',
        'online',
        'deployed',
        'open',
        'normal',
        'available',
        'ACTIVE',
        'Online',
      ];
      statuses.forEach((s) => {
        expect(StatusMapper.getColor(s)).toBe(ThemeTokens.colors.success.default);
      });
    });

    it('returns warning color for warning statuses', () => {
      const statuses = ['warning', 'delayed', 'investigating', 'dispatched', 'WARNING'];
      statuses.forEach((s) => {
        expect(StatusMapper.getColor(s)).toBe(ThemeTokens.colors.warning.default);
      });
    });

    it('returns danger color for negative statuses', () => {
      const statuses = ['critical', 'offline', 'error', 'closed', 'busy', 'CRITICAL'];
      statuses.forEach((s) => {
        expect(StatusMapper.getColor(s)).toBe(ThemeTokens.colors.danger.default);
      });
    });

    it('returns muted color for neutral or unknown statuses', () => {
      const statuses = [
        'standby',
        'idle',
        'resolved',
        'paused',
        'unknown',
        'random_string',
        '',
        undefined as any,
      ];
      statuses.forEach((s) => {
        expect(StatusMapper.getColor(s)).toBe(ThemeTokens.colors.text.muted);
      });
    });
  });

  describe('SeverityMapper', () => {
    it('returns primary color for low/info', () => {
      const severities = ['low', 'info', 'LOW'];
      severities.forEach((s) => {
        expect(SeverityMapper.getColor(s)).toBe(ThemeTokens.colors.brand.primary);
      });
    });

    it('returns warning color for medium/warning', () => {
      const severities = ['medium', 'warning', 'Medium'];
      severities.forEach((s) => {
        expect(SeverityMapper.getColor(s)).toBe(ThemeTokens.colors.warning.default);
      });
    });

    it('returns danger color for high/critical/severe/error', () => {
      const severities = ['high', 'critical', 'severe', 'error', 'HIGH'];
      severities.forEach((s) => {
        expect(SeverityMapper.getColor(s)).toBe(ThemeTokens.colors.danger.default);
      });
    });

    it('returns muted color for unknown severities', () => {
      const severities = ['unknown', 'random_string', '', undefined as any];
      severities.forEach((s) => {
        expect(SeverityMapper.getColor(s)).toBe(ThemeTokens.colors.text.muted);
      });
    });
  });

  describe('PriorityMapper', () => {
    it('aliases SeverityMapper.getColor', () => {
      expect(PriorityMapper.getColor('high')).toBe(SeverityMapper.getColor('high'));
      expect(PriorityMapper.getColor('low')).toBe(SeverityMapper.getColor('low'));
    });
  });

  describe('ScoreMapper', () => {
    it('returns success color for scores >= 90', () => {
      expect(ScoreMapper.getColor(90)).toBe(ThemeTokens.colors.success.default);
      expect(ScoreMapper.getColor(100)).toBe(ThemeTokens.colors.success.default);
      expect(ScoreMapper.getColor(95.5)).toBe(ThemeTokens.colors.success.default);
    });

    it('returns warning color for scores between 70 and 89.9', () => {
      expect(ScoreMapper.getColor(70)).toBe(ThemeTokens.colors.warning.default);
      expect(ScoreMapper.getColor(89.9)).toBe(ThemeTokens.colors.warning.default);
      expect(ScoreMapper.getColor(80)).toBe(ThemeTokens.colors.warning.default);
    });

    it('returns danger color for scores < 70', () => {
      expect(ScoreMapper.getColor(69.9)).toBe(ThemeTokens.colors.danger.default);
      expect(ScoreMapper.getColor(0)).toBe(ThemeTokens.colors.danger.default);
      expect(ScoreMapper.getColor(-10)).toBe(ThemeTokens.colors.danger.default);
    });
  });

  describe('DensityMapper', () => {
    it('returns danger color for density > 0.85', () => {
      expect(DensityMapper.getColor(0.86)).toBe(ThemeTokens.colors.danger.default);
      expect(DensityMapper.getColor(1.0)).toBe(ThemeTokens.colors.danger.default);
    });

    it('returns warning color for density between 0.61 and 0.85', () => {
      expect(DensityMapper.getColor(0.61)).toBe(ThemeTokens.colors.warning.default);
      expect(DensityMapper.getColor(0.85)).toBe(ThemeTokens.colors.warning.default);
      expect(DensityMapper.getColor(0.7)).toBe(ThemeTokens.colors.warning.default);
    });

    it('returns success color for density <= 0.6', () => {
      expect(DensityMapper.getColor(0.6)).toBe(ThemeTokens.colors.success.default);
      expect(DensityMapper.getColor(0.5)).toBe(ThemeTokens.colors.success.default);
      expect(DensityMapper.getColor(0)).toBe(ThemeTokens.colors.success.default);
    });
  });
});
