import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IncidentService } from '@/lib/modules/incidents/service';
import { IIncidentRepository } from '@/lib/domain/repositories/incident.repository.interface';
import { IMatchRepository } from '@/lib/domain/repositories/match.repository.interface';
import { BusinessContext } from '@/lib/services/business.context';
import { NotFoundError, ValidationError } from '@/lib/errors/http.errors';

describe('IncidentService', () => {
  let incidentService: IncidentService;
  let mockIncidentRepo: vi.Mocked<IIncidentRepository>;
  let mockMatchRepo: vi.Mocked<IMatchRepository>;

  const ctx: BusinessContext = {
    userId: 'user-1',
    venueId: 'venue-1',
    organizationId: 'org-1',
    role: 'ADMIN',
  };

  const mockIncident = {
    id: 'inc-1',
    matchId: 'match-1',
    venueId: 'venue-1',
    title: 'Test Incident',
    status: 'open',
    severityTier: 1,
    reportedBy: 'user-1',
    description: '',
    zoneId: 'zone-1',
    incidentTypeId: 'type-1',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMatch = {
    id: 'match-1',
    venueId: 'venue-1',
    organizationId: 'org-1',
    title: 'Match',
    scheduledAt: new Date(),
    status: 'SCHEDULED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockIncidentRepo = {
      findById: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      createIncidentWithAction: vi.fn(),
      updateIncidentWithAction: vi.fn(),
    } as unknown as vi.Mocked<IIncidentRepository>;

    mockMatchRepo = {
      findById: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as vi.Mocked<IMatchRepository>;

    incidentService = new IncidentService(mockIncidentRepo, mockMatchRepo);
  });

  it('gets incident by id', async () => {
    mockIncidentRepo.findById.mockResolvedValue(mockIncident as any);
    const result = await incidentService.getIncidentById(ctx, 'match-1', 'inc-1');
    expect(result.id).toBe('inc-1');
  });

  it('throws NotFoundError if incident does not exist', async () => {
    mockIncidentRepo.findById.mockResolvedValue(null);
    await expect(incidentService.getIncidentById(ctx, 'match-1', 'inc-1')).rejects.toThrow(NotFoundError);
  });

  it('creates an incident', async () => {
    mockMatchRepo.findById.mockResolvedValue(mockMatch as any);
    mockIncidentRepo.createIncidentWithAction.mockResolvedValue(mockIncident as any);
    
    const result = await incidentService.createIncident(ctx, 'match-1', {
      title: 'Test Incident',
      description: 'Desc',
      zoneId: 'zone-1',
      incidentTypeId: 'type-1',
      severityTier: 1,
      tags: [],
    });
    
    expect(result.id).toBe('inc-1');
    expect(mockIncidentRepo.createIncidentWithAction).toHaveBeenCalled();
  });

  it('updates an incident', async () => {
    mockIncidentRepo.findById.mockResolvedValue(mockIncident as any);
    mockIncidentRepo.updateIncidentWithAction.mockResolvedValue({ ...mockIncident, status: 'resolved' } as any);
    
    const result = await incidentService.updateIncident(ctx, 'match-1', 'inc-1', { status: 'resolved' });
    expect(result.status).toBe('resolved');
  });

  it('throws validation error if modifying resolved incident', async () => {
    mockIncidentRepo.findById.mockResolvedValue({ ...mockIncident, status: 'resolved' } as any);
    
    await expect(
      incidentService.updateIncident(ctx, 'match-1', 'inc-1', { description: 'changed' })
    ).rejects.toThrow(ValidationError);
  });
});
