import { ExecutiveBriefing } from '../types';

export class BriefingService {
  private static instance: BriefingService;

  private constructor() {}

  public static getInstance(): BriefingService {
    if (!BriefingService.instance) {
      BriefingService.instance = new BriefingService();
    }
    return BriefingService.instance;
  }

  public getBriefings(): ExecutiveBriefing[] {
    return [
      {
        id: 'brf-1',
        type: 'MORNING',
        title: 'Morning Tournament Brief',
        content: [
          'Tournament operating at 96% efficiency.',
          'Weather is clear. No transport disruptions expected before 18:00.',
          'Volunteer distribution is balanced across all 3 venues.',
        ],
        timestamp: new Date().toISOString(),
      },
      {
        id: 'brf-2',
        type: 'SUSTAINABILITY',
        title: 'Executive Sustainability Report',
        content: [
          'Renewable utilization peaked at 42% across the tournament today.',
          'AI HVAC optimizations saved 2.1 MW in Venue A.',
          'Waste routing efficiency increased by 14%.',
        ],
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'brf-3',
        type: 'MATCHDAY',
        title: 'Matchday Summary: Venue B',
        content: [
          'Pre-match ingress handled 62,000 fans without major delays.',
          'Gate 4 experienced minor bottlenecks; AI redistributed flow to Gate 5.',
          'Concessions operating at peak efficiency.',
        ],
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'brf-4',
        type: 'EMERGENCY',
        title: 'Emergency Brief: Medical Transport',
        content: [
          'Category 2 medical incident resolved in Sector 4 (Venue C).',
          'AI-guided inclusive routing enabled EMT access in 180s.',
          'All gates restored to nominal operations.',
        ],
        timestamp: new Date(Date.now() - 9000000).toISOString(),
      },
      {
        id: 'brf-5',
        type: 'POST_MATCH',
        title: 'Post-Match Egress Briefing',
        content: [
          'Egress completed 12% faster than baseline predictions.',
          'Metro Line Red absorbed 40% of the outgoing capacity successfully.',
          'No significant crowd crush risks detected.',
        ],
        timestamp: new Date(Date.now() - 14400000).toISOString(),
      },
    ];
  }
}

export const briefingService = BriefingService.getInstance();
