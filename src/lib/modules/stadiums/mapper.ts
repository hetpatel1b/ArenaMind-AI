import { Stadium } from '@prisma/client';
import { StadiumDto } from './dto';

export function toStadiumDto(stadium: Stadium): StadiumDto {
  return {
    id: stadium.id,
    name: stadium.name,
    shortName: stadium.shortName,
    city: stadium.city,
    country: stadium.country,
    capacity: stadium.capacity,
    timezone: stadium.timezone,
    zoneCount: stadium.zoneCount,
    surfaceAreaSqm: stadium.surfaceAreaSqm,
    isActive: stadium.isActive,
    // explicitly NOT returning metadata, createdAt, updatedAt
  };
}
