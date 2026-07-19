import { ReasoningStep } from '../../app/components/workforce/foundation/WorkforceTypes';

export class HospitalityCopilotService {
  private static instance: HospitalityCopilotService;

  private constructor() {}

  public static getInstance(): HospitalityCopilotService {
    if (!HospitalityCopilotService.instance) {
      HospitalityCopilotService.instance = new HospitalityCopilotService();
    }
    return HospitalityCopilotService.instance;
  }

  public analyzeDemand(suiteId: string, currentOccupancy: number): ReasoningStep[] {
    if (currentOccupancy > 15) {
      return [
        {
          id: `hosp-reason-1`,
          phase: 'Observation',
          content: `High VIP occupancy detected in Suite ${suiteId}.`,
          confidence: 0.96,
        },
        {
          id: `hosp-reason-2`,
          phase: 'Recommendation',
          content: `Proactively increase F&B service rotation and ready VIP transport escorts.`,
          confidence: 0.91,
        },
      ];
    }
    return [];
  }
}

export const hospitalityCopilotService = HospitalityCopilotService.getInstance();
