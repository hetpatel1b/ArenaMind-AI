export interface TournamentHealthIndex {
  overallScore: number;
  dimensions: {
    operations: number;
    fanExperience: number;
    accessibility: number;
    transportation: number;
    safety: number;
    crowd: number;
    sustainability: number;
    emergencyReadiness: number;
    infrastructure: number;
  };
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface VenueState {
  venueId: string;
  name: string;
  pressureScore: number;
  waitTimesMinutes: number;
  sustainabilityScore: number;
  incidentCount: number;
  activeMedical: number;
  volunteerLoad: number;
}

export interface MultiVenueState {
  venues: VenueState[];
  tournamentTotalPressure: number;
}

export interface ExecutiveBriefing {
  id: string;
  type: 'MORNING' | 'MATCHDAY' | 'POST_MATCH' | 'EMERGENCY' | 'SUSTAINABILITY' | 'OPERATIONS';
  title: string;
  content: string[];
  timestamp: string;
}

export interface CrossDomainCorrelation {
  id: string;
  primaryDomain: string;
  secondaryDomain: string;
  relationship: string;
  narrative: string;
  dataPoints: string[];
}

export type JudgeDemoScenario =
  | 'CROWD_SURGE'
  | 'MEDICAL_EMERGENCY'
  | 'HEAVY_RAIN'
  | 'TRANSPORT_DISRUPTION'
  | 'LOST_CHILD'
  | 'ENERGY_SPIKE'
  | 'WASTE_OVERFLOW';

export interface JudgeDemoState {
  activeScenario: JudgeDemoScenario | null;
  logs: string[];
}
