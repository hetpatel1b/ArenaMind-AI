import { Resource } from '@prisma/client';
import { ResourceDto } from './dto';

export function toResourceDto(resource: Resource): ResourceDto {
  return {
    id: resource.id,
    stadiumId: resource.stadiumId,
    matchId: resource.matchId,
    zoneId: resource.zoneId,
    resourceTypeId: resource.resourceTypeId,
    name: resource.name,
    status: resource.status,
  };
}
