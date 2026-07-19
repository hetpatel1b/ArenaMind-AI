import { describe, it, expect, vi, beforeEach } from 'vitest';
import { incidentRepository } from '@/lib/modules/incidents/repository';
import { prisma } from '@/lib/db/client';

vi.mock('@/lib/db/client', () => ({
  prisma: {
    incident: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(async (cb) => {
      // Execute the callback with a mock transaction object
      return cb({
        incident: {
          create: vi.fn().mockResolvedValue({ id: 'inc-1' }),
          update: vi.fn().mockResolvedValue({ id: 'inc-1', status: 'resolved' }),
        },
        incidentAction: {
          create: vi.fn().mockResolvedValue({ id: 'act-1' }),
        },
      });
    }),
  },
}));

describe('IncidentRepository Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an incident with action in a transaction', async () => {
    const payload = {
      title: 'Test Incident',
      description: 'Desc',
      zoneId: 'zone-1',
      incidentTypeId: 'type-1',
      locationDetail: 'Gate A',
      severityTier: 1,
      tags: ['medical'],
    };

    const incident = await incidentRepository.createIncidentWithAction(
      'match-1',
      'venue-1',
      'user-1',
      payload
    );

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(incident).toEqual({ id: 'inc-1' });
  });

  it('updates an incident with action in a transaction', async () => {
    const payload = {
      status: 'resolved',
      description: 'Updated desc',
    };

    const incident = await incidentRepository.updateIncidentWithAction(
      'inc-1',
      'user-1',
      payload
    );

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(incident).toEqual({ id: 'inc-1', status: 'resolved' });
  });
});
