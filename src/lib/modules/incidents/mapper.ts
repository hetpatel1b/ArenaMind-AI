import { Incident } from '@prisma/client';
import { IncidentDto } from './dto';

export function toIncidentDto(incident: Incident): IncidentDto {
  return {
    id: incident.id,
    matchId: incident.matchId,
    stadiumId: incident.stadiumId,
    zoneId: incident.zoneId,
    incidentTypeId: incident.incidentTypeId,
    title: incident.title,
    description: incident.description,
    locationDetail: incident.locationDetail,
    severityTier: incident.severityTier,
    status: incident.status,
    tags: incident.tags,
    reportedBy: incident.reportedBy,
    assignedTo: incident.assignedTo,
    aiType: incident.aiType,
    aiTier: incident.aiTier,
    // converting Decimal to number safely for DTO
    aiConfidence: incident.aiConfidence ? Number(incident.aiConfidence) : null,
    resolvedAt: incident.resolvedAt,
    resolvedBy: incident.resolvedBy,
  };
}
