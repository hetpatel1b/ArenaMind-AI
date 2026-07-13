import { GeoLocation } from '../maps/maps.interface';

export interface WeatherConditions {
  temperatureCelsius: number;
  humidityPercentage: number;
  windSpeedKmh: number;
  description: string;
  isSevere: boolean;
}

export interface IWeatherProvider {
  /**
   * Retrieves current weather conditions for a specific coordinate.
   */
  getCurrentConditions(location: GeoLocation): Promise<WeatherConditions>;
}
