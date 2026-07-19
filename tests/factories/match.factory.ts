import { Match, MatchPhase, MatchStatus } from '@prisma/client';

/**
 * Deterministic factory for creating a Match object.
 */
export const createMatch = (overrides?: Partial<Match>): Match => {
  return {
    id: 'mtc_00000000000000000000000000',
    organizationId: 'org_00000000000000000000000000',
    homeTeam: 'Home FC',
    awayTeam: 'Away FC',
    venueId: 'ven_00000000000000000000000000',
    currentPhase: MatchPhase.planning,
    matchStatus: MatchStatus.scheduled,
    scheduledAt: new Date('2026-01-01T15:00:00Z'),
    kickoffAt: null,
    endedAt: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    deletedAt: null,
    matchNumber: 1,
    expectedAttendance: null,
    actualAttendance: null,
    weatherSummary: null,
    riskLevel: null,
    securityLevel: null,
    aiStatus: null,
    matchConfiguration: {},
    notes: null,
    metadata: {},
    ...overrides,
  };
};
