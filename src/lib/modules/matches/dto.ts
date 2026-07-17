import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const MatchDtoSchema = registerSchema(
  'Match',
  z.object({
    id: z.string().uuid(),
    venueId: z.string().uuid(),
    matchNumber: z.number(),
    homeTeam: z.string(),
    awayTeam: z.string(),
    scheduledAt: z.date(),
    kickoffAt: z.date().nullable(),
    endedAt: z.date().nullable(),
    currentPhase: z.string(),
    matchStatus: z.string(),
    expectedAttendance: z.number().nullable(),
    actualAttendance: z.number().nullable(),
    weatherSummary: z.string().nullable(),
  })
);

export type MatchDto = z.infer<typeof MatchDtoSchema>;

export const UpdateMatchDtoSchema = registerSchema(
  'UpdateMatch',
  z.object({
    currentPhase: z
      .enum([
        'pre_event',
        'gate_opening',
        'fan_arrival',
        'pre_kickoff',
        'match_live',
        'halftime',
        'second_half',
        'full_time',
        'crowd_exit',
        'post_event',
      ])
      .optional(),
    matchStatus: z.enum(['scheduled', 'active', 'completed', 'cancelled']).optional(),
    actualAttendance: z.number().int().min(0).optional(),
    notes: z.string().optional(),
  })
);
export type UpdateMatchDto = z.infer<typeof UpdateMatchDtoSchema>;
