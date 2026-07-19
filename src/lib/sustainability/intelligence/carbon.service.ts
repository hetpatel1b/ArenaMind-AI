import { sustainabilityTelemetryService } from '../telemetry.service';
import { CarbonMetrics } from '../types';

export class CarbonIntelligenceService {
  private static instance: CarbonIntelligenceService;
  private constructor() {}
  public static getInstance(): CarbonIntelligenceService {
    if (!CarbonIntelligenceService.instance)
      CarbonIntelligenceService.instance = new CarbonIntelligenceService();
    return CarbonIntelligenceService.instance;
  }
  public async getCarbonInsights(): Promise<CarbonMetrics> {
    return sustainabilityTelemetryService.getCarbonTelemetry();
  }
}
export const carbonIntelligenceService = CarbonIntelligenceService.getInstance();
