import { describe, it, expect } from 'vitest';
import { createMatchSchema, updateMatchSchema } from '../../../src/server/validators/match.schema';
import { MatchStatus, MatchPhase } from '@prisma/client';

describe('Match Validators', () => {
  describe('createMatchSchema', () => {
    it('accepts a valid payload', () => {
      const payload = {
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        venueId: '123e4567-e89b-12d3-a456-426614174001',
        matchNumber: 1,
        homeTeam: 'Home',
        awayTeam: 'Away',
        scheduledAt: new Date().toISOString(),
        expectedAttendance: 50000,
      };
      const result = createMatchSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects non-positive match number', () => {
      const payload = {
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        venueId: '123e4567-e89b-12d3-a456-426614174001',
        matchNumber: 0,
        homeTeam: 'Home',
        awayTeam: 'Away',
        scheduledAt: new Date().toISOString(),
      };
      const result = createMatchSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects negative expected attendance', () => {
      const payload = {
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        venueId: '123e4567-e89b-12d3-a456-426614174001',
        matchNumber: 1,
        homeTeam: 'Home',
        awayTeam: 'Away',
        scheduledAt: new Date().toISOString(),
        expectedAttendance: -1,
      };
      const result = createMatchSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects empty team names', () => {
      const payload = {
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        venueId: '123e4567-e89b-12d3-a456-426614174001',
        matchNumber: 1,
        homeTeam: '',
        awayTeam: 'Away',
        scheduledAt: new Date().toISOString(),
      };
      const result = createMatchSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateMatchSchema', () => {
    it('accepts a valid payload with enum values', () => {
      const payload = {
        currentPhase: MatchPhase.match_live,
        matchStatus: MatchStatus.active,
        actualAttendance: 50000,
        notes: 'Test note',
      };
      const result = updateMatchSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects invalid enum values', () => {
      const payload = {
        currentPhase: 'INVALID_PHASE',
      };
      const result = updateMatchSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects negative actual attendance', () => {
      const payload = {
        actualAttendance: -5,
      };
      const result = updateMatchSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects invalid datetime strings', () => {
      const payload = {
        kickoffAt: 'not-a-datetime',
      };
      const result = updateMatchSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
