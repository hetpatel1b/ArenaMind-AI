import { SustainabilityRecommendation } from './types';
import { sustainabilityTelemetryService } from './telemetry.service';

export class SustainabilityRecommendationsService {
  private static instance: SustainabilityRecommendationsService;

  private constructor() {}

  public static getInstance(): SustainabilityRecommendationsService {
    if (!SustainabilityRecommendationsService.instance) {
      SustainabilityRecommendationsService.instance = new SustainabilityRecommendationsService();
    }
    return SustainabilityRecommendationsService.instance;
  }

  public async getLiveRecommendations(): Promise<SustainabilityRecommendation[]> {
    const energy = await sustainabilityTelemetryService.getEnergyTelemetry();
    const waste = await sustainabilityTelemetryService.getWasteTelemetry();
    const water = await sustainabilityTelemetryService.getWaterTelemetry();

    const recommendations: SustainabilityRecommendation[] = [];

    if (energy.currentDemandKw > 8000) {
      recommendations.push({
        id: 'rec-eng-1',
        category: 'ENERGY',
        title: 'Reduce HVAC Zone C Output',
        reasoning:
          'North Concourse occupancy has dropped 42% in the last 15 minutes. Current demand is high.',
        confidence: 94,
        expectedImpact: 'Lower energy consumption during peak window.',
        estimatedSavings: '140 kWh over next 2 hours',
        environmentalBenefit: 'Reduces carbon footprint by 58 kg CO₂',
        businessBenefit: 'Saves approximately $25 in peak energy costs',
        isActionable: true,
      });
    }

    if (waste.binsNearOverflow > 10) {
      recommendations.push({
        id: 'rec-wst-1',
        category: 'WASTE',
        title: 'Optimize Waste Collection Route',
        reasoning: `${waste.binsNearOverflow} bins in the East Plaza are nearing capacity due to high food traffic.`,
        confidence: 88,
        expectedImpact: 'Prevent overflow and maintain hygiene.',
        estimatedSavings: '12 labor hours',
        environmentalBenefit: 'Ensures optimal recycling separation',
        businessBenefit: 'Improves fan experience and prevents cleanup costs',
        isActionable: true,
      });
    }

    if (water.leakAnomalies > 0) {
      recommendations.push({
        id: 'rec-wtr-1',
        category: 'WATER',
        title: 'Investigate Water Anomaly in Sector 4',
        reasoning: `Detected ${water.leakAnomalies} potential leak anomalies based on abnormal flow rates.`,
        confidence: 96,
        expectedImpact: 'Stop potential flooding and water waste.',
        estimatedSavings: 'Up to 500 liters/hr',
        environmentalBenefit: 'Conserves clean water resources',
        businessBenefit: 'Prevents structural damage and high utility bills',
        isActionable: true,
      });
    }

    // Green Transportation recommendation
    recommendations.push({
      id: 'rec-trans-1',
      category: 'TRANSPORT',
      title: 'Promote Walking to Transit Hub B',
      reasoning:
        'Transit Hub A is experiencing high wait times. Weather is clear and Hub B is a short walk.',
      confidence: 92,
      expectedImpact: 'Relieves congestion and reduces required shuttle deployments.',
      estimatedSavings: '2 shuttle trips',
      environmentalBenefit: 'Walking saves 0.9 kg CO₂ per fan',
      businessBenefit: 'Reduces shuttle operational costs and improves exit flow',
      isActionable: true,
    });

    return recommendations;
  }
}

export const sustainabilityRecommendationsService =
  SustainabilityRecommendationsService.getInstance();
