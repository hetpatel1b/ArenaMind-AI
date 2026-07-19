import { CarbonMetrics, EnergyMetrics, WasteMetrics, WaterMetrics } from './types';

// Mock telemetry simulation for the AI Command Center
export class SustainabilityTelemetryService {
  private static instance: SustainabilityTelemetryService;

  private constructor() {}

  public static getInstance(): SustainabilityTelemetryService {
    if (!SustainabilityTelemetryService.instance) {
      SustainabilityTelemetryService.instance = new SustainabilityTelemetryService();
    }
    return SustainabilityTelemetryService.instance;
  }

  public async getCarbonTelemetry(): Promise<CarbonMetrics> {
    return {
      currentScore: 82,
      totalEmissionsKg: 14500,
      reductionGoalPct: 15,
      trend: 'IMPROVING',
      breakdown: {
        energy: 45,
        transport: 30,
        operations: 15,
        waste: 10,
      },
    };
  }

  public async getEnergyTelemetry(): Promise<EnergyMetrics> {
    return {
      currentDemandKw: 8500,
      peakDemandKw: 12000,
      renewablePct: 40,
      hvacEfficiency: 78,
      lightingEfficiency: 92,
    };
  }

  public async getWasteTelemetry(): Promise<WasteMetrics> {
    return {
      totalWasteKg: 3200,
      recycledPct: 55,
      foodWasteKg: 800,
      plasticWasteKg: 1200,
      binsNearOverflow: 14,
    };
  }

  public async getWaterTelemetry(): Promise<WaterMetrics> {
    return {
      consumptionLiters: 45000,
      recycledLiters: 12000,
      leakAnomalies: 2,
      restroomDemandScore: 68,
    };
  }
}

export const sustainabilityTelemetryService = SustainabilityTelemetryService.getInstance();
