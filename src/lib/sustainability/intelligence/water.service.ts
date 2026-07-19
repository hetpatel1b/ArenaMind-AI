import { sustainabilityTelemetryService } from '../telemetry.service';
import { WaterMetrics } from '../types';

export class WaterIntelligenceService {
  private static instance: WaterIntelligenceService;
  private constructor() {}
  public static getInstance(): WaterIntelligenceService {
    if (!WaterIntelligenceService.instance)
      WaterIntelligenceService.instance = new WaterIntelligenceService();
    return WaterIntelligenceService.instance;
  }
  public async getWaterInsights(): Promise<WaterMetrics> {
    return sustainabilityTelemetryService.getWaterTelemetry();
  }
}
export const waterIntelligenceService = WaterIntelligenceService.getInstance();
