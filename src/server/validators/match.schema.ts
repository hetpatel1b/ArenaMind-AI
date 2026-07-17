import { z } from 'zod';
import { MatchStatus, MatchPhase } from '@prisma/client';

export const createMatchSchema = z.object({
  organizationId: z.string().uuid(),
  venueId: z.string().uuid(),
  matchNumber: z.number().int().positive(),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  scheduledAt: z.string().datetime(),
  expectedAttendance: z.number().int().nonnegative().optional(),
});

export const updateMatchSchema = z.object({
  currentPhase: z.nativeEnum(MatchPhase).optional(),
  matchStatus: z.nativeEnum(MatchStatus).optional(),
  actualAttendance: z.number().int().nonnegative().optional(),
  kickoffAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});
