import { Incident, IncidentStatus } from '@prisma/client';

/**
 * Deterministic factory for creating an Incident object.
 */
export const createIncident = (overrides?: Partial<Incident>): Incident => {
  return {
    id: 'inc_00000000000000000000000000',
    title: 'Test Incident',
    description: 'A deterministic incident description used for testing.',
    severityTier: 4,
    status: IncidentStatus.open,
    matchId: 'mtc_00000000000000000000000000',
    venueId: 'ven_00000000000000000000000000',
    reportedBy: 'usr_00000000000000000000000000',
    resolvedAt: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    deletedAt: null,
    zoneId: null,
    incidentTypeId: null,
    assignedTo: null,
    locationDetail: null,
    aiType: null,
    aiTier: null,
    aiConfidence: null,
    aiClassificationAt: null,
    humanOverrideType: null,
    resolvedBy: null,
    resolutionNotes: null,
    tags: [],
    metadata: {},
    ...overrides,
  };
};
