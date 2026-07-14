import { IMapsProvider, GeoLocation, RouteEstimate } from './maps.interface';
import { prisma } from '@/lib/db/client';

export class PrismaMapsProvider implements IMapsProvider {
  async getRouteEstimate(origin: GeoLocation, destination: GeoLocation): Promise<RouteEstimate> {
    // Determine distance via Haversine logic (simplified for Prisma layer)
    const toRad = (val: number) => (val * Math.PI) / 180;
    const R = 6371e3; // metres
    const dLat = toRad(destination.latitude - origin.latitude);
    const dLon = toRad(destination.longitude - origin.longitude);
    const lat1 = toRad(origin.latitude);
    const lat2 = toRad(destination.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceMeters = Math.round(R * c);

    // Assuming average pedestrian speed of 1.4 m/s
    const durationSeconds = Math.round(distanceMeters / 1.4);

    return { distanceMeters, durationSeconds };
  }

  async geocode(address: string): Promise<GeoLocation> {
    // Attempt to locate a stadium that matches the address/name
    const stadium = await prisma.stadium.findFirst({
      where: {
        OR: [
          { name: { contains: address, mode: 'insensitive' } },
          { city: { contains: address, mode: 'insensitive' } },
        ],
      },
    });

    if (stadium && stadium.latitude && stadium.longitude) {
      return {
        latitude: Number(stadium.latitude),
        longitude: Number(stadium.longitude),
      };
    }

    // Default to a central geographic point if not found
    return { latitude: 25.2048, longitude: 55.2708 };
  }
}

export const mapsProvider: IMapsProvider = new PrismaMapsProvider();
