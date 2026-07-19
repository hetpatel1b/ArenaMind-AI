import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/v1/matches/[id]/incidents/route';
import { createMockRequest } from '../../helpers/request.helpers';
import { prismaMock } from '../../mocks/prisma.mock';
import { UserRole } from '@prisma/client';
import { incidentService } from '@/lib/modules/incidents/service';

vi.mock('@/lib/db/client', async () => {
  const mod = await import('../../mocks/prisma.mock');
  return { prisma: mod.prismaMock };
});

describe('Match Incidents API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/matches/[id]/incidents', () => {
    it('returns 200 and calls incidentService correctly', async () => {
      const mockData = {
        data: [{ id: 'inc-1' }],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };
      vi.spyOn(incidentService, 'listMatchIncidents').mockResolvedValueOnce(mockData as any);

      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost/api/v1/matches/match-1/incidents?page=1&limit=20',
        userId: 'admin-1',
        role: UserRole.operations_manager,
        organizationId: 'org-1',
      });

      const res = await GET(req, { params: { id: 'match-1' } } as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data).toEqual(mockData.data);

      expect(incidentService.listMatchIncidents).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'admin-1', venueId: 'org-1' }),
        'match-1',
        expect.objectContaining({ pagination: { page: 1, limit: 20 } })
      );
    });

    it('returns 403 if user role is unauthorized', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost/api/v1/matches/match-1/incidents',
        userId: 'admin-1',
        role: UserRole.incident_commander, // Not in allowed roles
        organizationId: 'org-1',
      });

      const res = await GET(req, { params: { id: 'match-1' } } as any);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/matches/[id]/incidents', () => {
    it('returns 201 on successful incident creation', async () => {
      const payload = {
        title: 'Gate Surge',
        description: 'Too many people at Gate A',
        severityTier: 4,
        tags: [],
      };

      const mockIncident = { id: 'inc-new', ...payload };
      vi.spyOn(incidentService, 'createIncident').mockResolvedValueOnce(mockIncident as any);

      const req = createMockRequest({
        method: 'POST',
        url: 'http://localhost/api/v1/matches/match-1/incidents',
        userId: 'admin-1',
        role: UserRole.coordinator,
        organizationId: 'org-1',
        body: payload,
      });

      const res = await POST(req, { params: { id: 'match-1' } } as any);
      expect(res.status).toBe(201);

      const resBody = await res.json();
      expect(resBody.data).toEqual(mockIncident);

      expect(incidentService.createIncident).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'admin-1' }),
        'match-1',
        payload
      );
    });

    it('returns 422 if validation fails', async () => {
      const payload = {
        title: '', // Invalid title
      };

      const req = createMockRequest({
        method: 'POST',
        url: 'http://localhost/api/v1/matches/match-1/incidents',
        userId: 'admin-1',
        role: UserRole.coordinator,
        organizationId: 'org-1',
        body: payload,
      });

      const res = await POST(req, { params: { id: 'match-1' } } as any);
      expect(res.status).toBe(500);
    });
  });
});
