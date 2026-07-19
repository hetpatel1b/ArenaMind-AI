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
      {
        id: 'cd-3',
        primaryDomain: 'Media',
        secondaryDomain: 'Crowd',
        relationship: 'Congestion -> Crowd Flow',
        narrative:
          'Mixed zone media overcrowding at Gate E caused a 15% reduction in fan egress throughput.',
        dataPoints: ['Media occupancy +120%', 'Egress delay +8m', 'Fan sentiment -5%'],
      },
      {
        id: 'cd-4',
        primaryDomain: 'Broadcast',
        secondaryDomain: 'Infrastructure',
        relationship: 'Signal Loss -> Executive Alert',
        narrative:
          'Fiber route degradation triggered automatic failover to satellite and alerted match executives.',
        dataPoints: ['Fiber packet loss 12%', 'Failover time 45ms', 'Executive alert triggered'],
      },
      {
        id: 'cd-5',
        primaryDomain: 'Hospitality',
        secondaryDomain: 'Mobility',
        relationship: 'Occupancy -> VIP Transport',
        narrative:
          'Unplanned VIP arrivals at Corporate Box 4 necessitated 3 additional luxury transports, slightly impacting standard shuttle routes.',
        dataPoints: ['Suite occupancy +15%', 'Luxury transport dispatch +3', 'Shuttle wait +2m'],
      },
    ];
  }
}

export const crossDomainIntelligenceService = CrossDomainIntelligenceService.getInstance();
