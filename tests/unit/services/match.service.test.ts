import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatchService } from '@/server/services/match.service';
import { prisma } from '@/lib/db/client';
import { AuditService } from '@/server/audit/audit.service';

vi.mock('@/lib/db/client', () => ({
  prisma: {
    match: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/server/audit/audit.service', () => ({
  AuditService: {
    log: vi.fn(),
  },
}));

describe('MatchService', () => {
  const mockOrgId = 'org-123';
  const mockUserId = 'user-123';
  const mockMatch = {
    id: 'match-1',
    organizationId: mockOrgId,
    title: 'Final',
    scheduledAt: new Date(),
    status: 'SCHEDULED',
    venueId: 'venue-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets matches by organization', async () => {
    vi.mocked(prisma.match.findMany).mockResolvedValue([mockMatch]);
    const matches = await MatchService.getMatchesByOrganization(mockOrgId);
    expect(matches).toEqual([mockMatch]);
    expect(prisma.match.findMany).toHaveBeenCalledWith({
      where: { organizationId: mockOrgId },
      include: { venue: true },
      orderBy: { scheduledAt: 'asc' },
    });
  });

  it('gets a single match by id', async () => {
    vi.mocked(prisma.match.findFirst).mockResolvedValue(mockMatch);
    const match = await MatchService.getMatch('match-1', mockOrgId);
    expect(match).toEqual(mockMatch);
    expect(prisma.match.findFirst).toHaveBeenCalledWith({
      where: { id: 'match-1', organizationId: mockOrgId },
      include: { venue: true, incidents: true, resources: true },
    });
  });

  it('creates a match and logs audit', async () => {
    vi.mocked(prisma.match.create).mockResolvedValue(mockMatch);
    
    const data = {
      title: 'Final',
      scheduledAt: mockMatch.scheduledAt.toISOString(),
      status: 'SCHEDULED' as const,
      venueId: 'venue-1',
      organizationId: mockOrgId,
    };

    const match = await MatchService.createMatch(data, mockUserId);
    expect(match).toEqual(mockMatch);
    expect(prisma.match.create).toHaveBeenCalledWith({ data });
    expect(AuditService.log).toHaveBeenCalledWith(expect.objectContaining({
      action: 'CREATE',
      recordId: mockMatch.id,
      userId: mockUserId,
    }));
  });

  it('updates a match and logs audit', async () => {
    vi.mocked(prisma.match.findFirst).mockResolvedValue(mockMatch);
    const updatedMatch = { ...mockMatch, title: 'Updated Final' };
    vi.mocked(prisma.match.update).mockResolvedValue(updatedMatch);
    
    const data = { title: 'Updated Final' };
    const match = await MatchService.updateMatch('match-1', mockOrgId, data, mockUserId);
    
    expect(match).toEqual(updatedMatch);
    expect(prisma.match.update).toHaveBeenCalledWith({
      where: { id: 'match-1' },
      data,
    });
    expect(AuditService.log).toHaveBeenCalledWith(expect.objectContaining({
      action: 'UPDATE',
      recordId: mockMatch.id,
      userId: mockUserId,
      oldData: mockMatch,
      newData: updatedMatch,
    }));
  });

  it('throws error when updating non-existent match', async () => {
    vi.mocked(prisma.match.findFirst).mockResolvedValue(null);
    
    await expect(MatchService.updateMatch('match-1', mockOrgId, { title: 'test' }, mockUserId))
      .rejects.toThrow('Match not found');
  });
});
