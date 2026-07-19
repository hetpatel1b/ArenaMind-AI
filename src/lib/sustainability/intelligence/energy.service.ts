import { sustainabilityTelemetryService } from '../telemetry.service';
import { EnergyMetrics } from '../types';

export class EnergyIntelligenceService {
  private static instance: EnergyIntelligenceService;
  private constructor() {}
  public static getInstance(): EnergyIntelligenceService {
    if (!EnergyIntelligenceService.instance)
      EnergyIntelligenceService.instance = new EnergyIntelligenceService();
    return EnergyIntelligenceService.instance;
  }
  public async getEnergyInsights(): Promise<EnergyMetrics> {
    return sustainabilityTelemetryService.getEnergyTelemetry();
  }
}
export const energyIntelligenceService = EnergyIntelligenceService.getInstance();
