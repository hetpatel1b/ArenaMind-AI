import { FanContext, FanRecommendation } from '../types';
import { fanContextService } from '../context/fan-context.service';

export class FanRecommendationsService {
  private static instance: FanRecommendationsService;

  private constructor() {}

  public static getInstance(): FanRecommendationsService {
    if (!FanRecommendationsService.instance) {
      FanRecommendationsService.instance = new FanRecommendationsService();
    }
    return FanRecommendationsService.instance;
  }

  public async getRecommendations(context?: FanContext): Promise<FanRecommendation[]> {
    const ctx = context || fanContextService.getContext();
    const isAccessible =
      ctx.visitorType.includes('WHEELCHAIR') || ctx.visitorType.includes('MEDICAL');

    // Simulate recommendation engine output
    const recommendations: FanRecommendation[] = [
      {
        id: 'rec-1',
        type: 'FOOD',
        title: 'Short Queue: Burger Stand',
        description: 'Less than 2 minutes wait time.',
        distanceMinutes: 3,
        queueTimeMinutes: 2,
        isAccessible: true,
      },
      {
        id: 'rec-2',
        type: 'RESTROOM',
        title: 'Nearest Restroom',
        description: 'Located in Section 112 Concourse.',
        distanceMinutes: 1,
        queueTimeMinutes: 5,
        isAccessible: true,
      },
    ];

    if (!isAccessible) {
      recommendations.push({
        id: 'rec-3',
        type: 'MERCHANDISE',
        title: 'Merchandise Express Kiosk',
        description: 'Fast lane available.',
        distanceMinutes: 4,
        queueTimeMinutes: 3,
        isAccessible: false,
      });
    }

    return recommendations;
  }
}

export const fanRecommendationsService = FanRecommendationsService.getInstance();
