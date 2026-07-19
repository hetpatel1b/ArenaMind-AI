import { ReasoningStep } from '../../app/components/workforce/foundation/WorkforceTypes';

export class BroadcastCopilotService {
  private static instance: BroadcastCopilotService;

  private constructor() {}

  public static getInstance(): BroadcastCopilotService {
    if (!BroadcastCopilotService.instance) {
      BroadcastCopilotService.instance = new BroadcastCopilotService();
    }
    return BroadcastCopilotService.instance;
  }

  public analyzeSignalAnomaly(compoundId: string): ReasoningStep[] {
    return [
      {
        id: `br-reason-1`,
        phase: 'Observation',
        content: `Micro-interruptions detected in Compound ${compoundId} fiber uplink.`,
        confidence: 0.92,
      },
      {
        id: `br-reason-2`,
        phase: 'Recommendation',
        content: `Switch to redundant satellite feed and dispatch technical team to Node B.`,
        confidence: 0.89,
      },
    ];
  }
}

export const broadcastCopilotService = BroadcastCopilotService.getInstance();
