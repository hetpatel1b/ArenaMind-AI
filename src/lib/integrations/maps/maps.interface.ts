export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface RouteEstimate {
  distanceMeters: number;
  durationSeconds: number;
}

export interface IMapsProvider {
  /**
   * Calculates distance and time between two geographic coordinates.
   */
  getRouteEstimate(origin: GeoLocation, destination: GeoLocation): Promise<RouteEstimate>;

  /**
   * Converts an address string into geographic coordinates.
   */
  geocode(address: string): Promise<GeoLocation>;
}
