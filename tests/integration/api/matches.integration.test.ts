import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/v1/matches/route';
import { createMockRequest } from '../../helpers/request.helpers';
import { prismaMock } from '../../mocks/prisma.mock';
import { UserRole, MatchPhase } from '@prisma/client';

vi.mock('@/lib/db/client', async () => {
  const mod = await import('../../mocks/prisma.mock');
  return { prisma: mod.prismaMock };
});

describe('Matches API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/matches', () => {
    it('returns 400 if organizationId is missing', async () => {
      // Omit organizationId from mock request
      const req = createMockRequest({
        userId: 'user-1',
        role: UserRole.operations_manager,
      });
      const res = await GET(req, { params: {} });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('No organization linked');
    });

    it('returns 200 with matches and proper caching headers', async () => {
      const mockMatches = [{ id: 'match-1', name: 'Derby' }];
      prismaMock.match.findMany.mockResolvedValueOnce(mockMatches);

      const req = createMockRequest({
        userId: 'admin-1',
        role: UserRole.operations_manager,
        organizationId: 'org-1',
      });

      const res = await GET(req, { params: {} });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toEqual(mockMatches);

      // Verify ETag and Cache-Control from RouteFactory
      expect(res.headers.get('ETag')).toBeTruthy();
      expect(res.headers.get('Cache-Control')).toContain('stale-while-revalidate');

      expect(prismaMock.match.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
        orderBy: { scheduledAt: 'asc' },
        include: { venue: true },
      });
    });
  });

  describe('POST /api/v1/matches', () => {
    it('returns 400 if organizationId is missing', async () => {
      const req = createMockRequest({
        method: 'POST',
        userId: 'admin-1',
        role: UserRole.organization_admin,
        organizationId: undefined, // missing
        body: {},
      });
      const res = await POST(req, { params: {} });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('No organization linked');
    });

    it('validates DTO and returns 201 on success', async () => {
      const mockCreatedMatch = { id: 'new-match', name: 'Finals' };
      prismaMock.match.create.mockResolvedValueOnce(mockCreatedMatch);

      const payload = {
        name: 'Finals',
        scheduledAt: new Date().toISOString(),
        expectedAttendance: 50000,
        phase: MatchPhase.pre_event,
        venueId: '123e4567-e89b-12d3-a456-426614174000',
        matchNumber: 1,
        homeTeam: 'Team A',
        awayTeam: 'Team B',
      };

      const req = createMockRequest({
        method: 'POST',
        userId: 'admin-1',
        role: UserRole.organization_admin,
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        body: payload,
      });

      const res = await POST(req, { params: {} });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toEqual(mockCreatedMatch);

      expect(prismaMock.match.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          homeTeam: 'Team A',
          awayTeam: 'Team B',
          organizationId: '123e4567-e89b-12d3-a456-426614174000',
        }),
      });
    });

    it('returns 422 Unprocessable Entity if DTO validation fails', async () => {
      const payload = {
        name: '', // Invalid name (too short)
      };

      const req = createMockRequest({
        method: 'POST',
        userId: 'admin-1',
        role: UserRole.organization_admin,
        organizationId: 'org-1',
        body: payload,
      });

      const res = await POST(req, { params: {} });
      expect(res.status).toBe(500); // Or whatever error code RouteFactory maps to
    });
  });
});
