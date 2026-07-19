import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/v1/intelligence/route';
import { createMockRequest } from '../../helpers/request.helpers';
import { prismaMock } from '../../mocks/prisma.mock';
import { UserRole } from '@prisma/client';

vi.mock('@/lib/db/client', async () => {
  const mod = await import('../../mocks/prisma.mock');
  return { prisma: mod.prismaMock };
});

describe('AI Intelligence API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default Prisma mocks for intelligence pipeline
    // Need to provide Prisma schema compatible mocks for incident, camera, workforceUnit
    prismaMock.incident.findMany.mockResolvedValue([]);

    // We add mock implementations to Prisma mock dynamically since it doesn't have camera/workforceUnit by default
    (prismaMock as any).camera = { findMany: vi.fn().mockResolvedValue([]) };
    (prismaMock as any).workforceUnit = { findMany: vi.fn().mockResolvedValue([]) };
  });

  it('aggregates data, builds AI graph, and returns intelligence DTO', async () => {
    const mockIncidents = [
      { id: '1', title: 'Fire', severityTier: 4 },
      { id: '2', title: 'Crowd Surge', severityTier: 3 },
      { id: '3', title: 'Medical', severityTier: 5 },
    ];

    prismaMock.incident.findMany.mockResolvedValueOnce(mockIncidents);

    const req = createMockRequest({
      url: 'http://localhost/api/v1/intelligence?limit=10',
      userId: 'admin-1',
      role: UserRole.operations_manager,
      organizationId: 'org-1',
    });

    const res = await GET(req, { params: {} });
    expect(res.status).toBe(200);

    const resBody = await res.json();
    const data = resBody.data;

    // Verify AI Metrics synthesis
    expect(data.engineMetrics).toBeDefined();
    expect(data.engineMetrics.nodesAnalyzed).toBeGreaterThanOrEqual(0);
    expect(data.threatLevel).toBe('ELEVATED'); // Due to length > 2
    expect(data.overallConfidence).toBe('HIGH');

    // Verify Prisma Calls
    expect(prismaMock.incident.findMany).toHaveBeenCalledTimes(1);
    expect((prismaMock as any).camera.findMany).toHaveBeenCalledTimes(1);
    expect((prismaMock as any).workforceUnit.findMany).toHaveBeenCalledTimes(1);
  });
});
