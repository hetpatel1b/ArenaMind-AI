import { Venue } from '@prisma/client';

/**
 * Deterministic factory for creating a Venue object.
 */
export const createVenue = (overrides?: Partial<Venue>): Venue => {
  return {
    id: 'ven_00000000000000000000000000',
    organizationId: 'org_00000000000000000000000000',
    name: 'ArenaMind Test Stadium',
    shortName: 'ATS',
    city: 'Testing City',
    country: 'Qatar',
    capacity: 50000,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    deletedAt: null,
    latitude: null,
    longitude: null,
    timezone: 'Asia/Riyadh',
    zoneCount: 0,
    surfaceAreaSqm: null,
    metadata: {},
    isActive: true,
    ...overrides,
  };
};
