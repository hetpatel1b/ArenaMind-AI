import { IMapsProvider, GeoLocation, RouteEstimate } from './maps.interface';

export class MockMapsProvider implements IMapsProvider {
  async getRouteEstimate(origin: GeoLocation, destination: GeoLocation): Promise<RouteEstimate> {
    // Mock simulation
    return {
      distanceMeters: 2500,
      durationSeconds: 300, // 5 mins
    };
  }

  async geocode(address: string): Promise<GeoLocation> {
    return {
      latitude: 40.7128,
      longitude: -74.006,
    };
  }
}

export const mapsProvider: IMapsProvider = new MockMapsProvider();
