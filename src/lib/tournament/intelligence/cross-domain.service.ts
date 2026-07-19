import { CrossDomainCorrelation } from '../types';

export class CrossDomainIntelligenceService {
  private static instance: CrossDomainIntelligenceService;

  private constructor() {}

  public static getInstance(): CrossDomainIntelligenceService {
    if (!CrossDomainIntelligenceService.instance) {
      CrossDomainIntelligenceService.instance = new CrossDomainIntelligenceService();
    }
    return CrossDomainIntelligenceService.instance;
  }

  public getCorrelations(): CrossDomainCorrelation[] {
    return [
      {
        id: 'cd-1',
        primaryDomain: 'Crowd',
        secondaryDomain: 'Mobility',
        relationship: 'Congestion -> Transport Delay',
        narrative:
          'Crowd congestion at Education City (C) increased transport emissions by 11% due to idling shuttles.',
        dataPoints: ['Crowd density +42%', 'Shuttle idle time +18m', 'Carbon footprint +11%'],
      },
      {
        id: 'cd-2',
        primaryDomain: 'Accessibility',
        secondaryDomain: 'Fan Experience',
        relationship: 'Routing -> Throughput',
        narrative:
          'Redirecting wheelchair visitors to priority elevators reduced general queue times by 37%.',
        dataPoints: [
          'Elevator utilization +90%',
          'Gate C queue -37%',
          'Accessibility score 99/100',
        ],
      },
    ];
  }
}

export const crossDomainIntelligenceService = CrossDomainIntelligenceService.getInstance();
