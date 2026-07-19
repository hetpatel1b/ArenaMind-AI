export interface CarbonMetrics {
  currentScore: number; // 0-100
  totalEmissionsKg: number;
  reductionGoalPct: number;
  trend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
  breakdown: {
    energy: number;
    transport: number;
    waste: number;
    operations: number;
  };
}

export interface EnergyMetrics {
  currentDemandKw: number;
  peakDemandKw: number;
  renewablePct: number;
  hvacEfficiency: number;
  lightingEfficiency: number;
}

export interface WasteMetrics {
  totalWasteKg: number;
  recycledPct: number;
  foodWasteKg: number;
  plasticWasteKg: number;
  binsNearOverflow: number;
}

export interface WaterMetrics {
  consumptionLiters: number;
  recycledLiters: number;
  leakAnomalies: number;
  restroomDemandScore: number; // 0-100
}

export interface SustainabilityRecommendation {
  id: string;
  category: 'CARBON' | 'ENERGY' | 'WASTE' | 'WATER' | 'TRANSPORT';
  title: string;
  reasoning: string;
  confidence: number; // 0-100
  expectedImpact: string;
  estimatedSavings: string;
  environmentalBenefit: string;
  businessBenefit: string;
  isActionable: boolean;
}
