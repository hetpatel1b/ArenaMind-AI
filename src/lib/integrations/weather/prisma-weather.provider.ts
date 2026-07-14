import { IWeatherProvider, WeatherConditions } from './weather.interface';
import { GeoLocation } from '../maps/maps.interface';
import { prisma } from '@/lib/db/client';

export class PrismaWeatherProvider implements IWeatherProvider {
  async getCurrentConditions(location: GeoLocation): Promise<WeatherConditions> {
    // Attempt to find the most recent weather data for a match roughly near this location
    // Since we don't do geospatial queries here directly yet, we fetch the latest global weather data
    // Or fallback to deterministic default.
    const latestWeather = await prisma.weatherData.findFirst({
      orderBy: { recordedAt: 'desc' },
    });

    if (latestWeather) {
      return {
        temperatureCelsius: Number(latestWeather.temperatureC),
        humidityPercentage: 45, // Assuming constant or add to db if needed
        windSpeedKmh: 12,
        description: latestWeather.weatherCondition,
        isSevere: ['storm', 'hurricane', 'extreme_heat'].includes(
          latestWeather.weatherCondition.toLowerCase()
        ),
      };
    }

    return {
      temperatureCelsius: 22,
      humidityPercentage: 45,
      windSpeedKmh: 12,
      description: 'Clear Skies',
      isSevere: false,
    };
  }
}

export const weatherProvider: IWeatherProvider = new PrismaWeatherProvider();
