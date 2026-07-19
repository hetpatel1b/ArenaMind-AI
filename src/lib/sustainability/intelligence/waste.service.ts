import { sustainabilityTelemetryService } from '../telemetry.service';
import { WasteMetrics } from '../types';

export class WasteIntelligenceService {
  private static instance: WasteIntelligenceService;
  private constructor() {}
  public static getInstance(): WasteIntelligenceService {
    if (!WasteIntelligenceService.instance)
      WasteIntelligenceService.instance = new WasteIntelligenceService();
    return WasteIntelligenceService.instance;
  }
  public async getWasteInsights(): Promise<WasteMetrics> {
    return sustainabilityTelemetryService.getWasteTelemetry();
  }
}
export const wasteIntelligenceService = WasteIntelligenceService.getInstance();
