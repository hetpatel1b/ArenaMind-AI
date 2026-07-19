import { sustainabilityRecommendationsService } from './recommendations.service';
import { sustainabilityTelemetryService } from './telemetry.service';

export class SustainabilityCopilotService {
  private static instance: SustainabilityCopilotService;

  private constructor() {}

  public static getInstance(): SustainabilityCopilotService {
    if (!SustainabilityCopilotService.instance) {
      SustainabilityCopilotService.instance = new SustainabilityCopilotService();
    }
    return SustainabilityCopilotService.instance;
  }

  public async getAnalysisReport(): Promise<string> {
    const carbon = await sustainabilityTelemetryService.getCarbonTelemetry();
    const energy = await sustainabilityTelemetryService.getEnergyTelemetry();
    const recommendations = await sustainabilityRecommendationsService.getLiveRecommendations();

    let report = `The stadium's live carbon score is ${carbon.currentScore}/100. Overall trend is ${carbon.trend.toLowerCase()}.\n`;
    report += `Current energy demand is at ${energy.currentDemandKw} kW with ${energy.renewablePct}% sourced from renewables.\n\n`;

    if (recommendations.length > 0) {
      report += `I have identified ${recommendations.length} optimization opportunities:\n`;
      recommendations.forEach((rec) => {
        report += `- **${rec.title}**: ${rec.reasoning} Expected impact: ${rec.expectedImpact} (${rec.estimatedSavings}).\n`;
      });
    } else {
      report += `Operations are currently highly optimized. No immediate interventions recommended.`;
    }

    return report;
  }
}

export const sustainabilityCopilotService = SustainabilityCopilotService.getInstance();
