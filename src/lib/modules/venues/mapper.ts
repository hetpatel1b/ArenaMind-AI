import { Venue } from '@prisma/client';
import { StadiumDto } from './dto';

export function toStadiumDto(venue: Venue): StadiumDto {
  return {
    id: venue.id,
    name: venue.name,
    shortName: venue.shortName,
    city: venue.city,
    country: venue.country,
    capacity: venue.capacity,
    timezone: venue.timezone,
    zoneCount: venue.zoneCount,
    surfaceAreaSqm: venue.surfaceAreaSqm,
    isActive: venue.isActive,
    // explicitly NOT returning metadata, createdAt, updatedAt
  };
}
