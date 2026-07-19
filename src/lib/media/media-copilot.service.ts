import { ReasoningStep } from '../../app/components/workforce/foundation/WorkforceTypes';

export class MediaCopilotService {
  private static instance: MediaCopilotService;

  private constructor() {}

  public static getInstance(): MediaCopilotService {
    if (!MediaCopilotService.instance) {
      MediaCopilotService.instance = new MediaCopilotService();
    }
    return MediaCopilotService.instance;
  }

  public async generatePressBriefing(matchId: string): Promise<string> {
    return `AI Generated Briefing for Match ${matchId}: Key insights, predicted attendance, and designated media opportunities have been compiled.`;
  }

  public analyzeCongestion(zoneId: string, occupancyPct: number): ReasoningStep[] {
    if (occupancyPct > 85) {
      return [
        {
          id: `reason-${Date.now()}-1`,
          phase: 'Observation',
          content: `Media zone ${zoneId} is exceeding safe capacity (${occupancyPct}%).`,
          confidence: 0.95,
        },
        {
          id: `reason-${Date.now()}-2`,
          phase: 'Recommendation',
          content: 'Deploy additional media security and open overflow mixed zone.',
          confidence: 0.88,
        },
      ];
    }
    return [];
  }
}

export const mediaCopilotService = MediaCopilotService.getInstance();
