import { IWeatherProvider, WeatherConditions } from './weather.interface';
import { GeoLocation } from '../maps/maps.interface';

export class MockWeatherProvider implements IWeatherProvider {
  async getCurrentConditions(location: GeoLocation): Promise<WeatherConditions> {
    return {
      temperatureCelsius: 22,
      humidityPercentage: 45,
      windSpeedKmh: 12,
      description: 'Clear Skies',
      isSevere: false,
    };
  }
}

export const weatherProvider: IWeatherProvider = new MockWeatherProvider();
