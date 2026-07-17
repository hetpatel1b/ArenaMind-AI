import { Prisma } from '@prisma/client';

export interface ScenarioMeta {
  id: string;
  name: string;
  description: string;
  healthScore: number;
}

export interface ScenarioMatch {
  homeTeam: string;
  awayTeam: string;
  matchNumber: number;
  expectedAttendance: number;
  actualAttendance: number;
  weatherSummary: string;
  currentPhase: string;
  // Expressed as minutes relative to NOW (e.g. -45 means kickoff was 45 mins ago)
  kickoffOffsetMinutes: number;
}

export interface ScenarioZone {
  id: string; // Logical ID used for relations in the template
  name: string;
  shortCode: string;
  capacity: number;
  safeCapacity: number;
  metadata: any;
  crowd: {
    fanCount: number;
    densityPct: number;
    ingressRate: number;
    egressRate: number;
  };
}

export interface ScenarioIncident {
  id: string; // Logical ID
  title: string;
  description: string;
  severityTier: number;
  status: string;
  zoneRef: string; // Matches ScenarioZone.id
  aiType: string;
  aiTier: number;
  aiConfidence: number;
  typeRef: string; // Name of Incident Type
}

export interface ScenarioResource {
  name: string;
  typeRef: string; // Name of Resource Type
  status: string;
  zoneRef: string;
}

export interface ScenarioAiRecommendation {
  incidentRef?: string;
  featureName: string;
  modelName: string;
  promptVersion: string;
  confidenceScore: number;
  data: {
    reason: string;
    suggestedAction: string;
    priority: string;
    evidence?: string;
    humanApprovalRequired: boolean;
  };
  expiresInMinutes: number;
}

export interface ScenarioNotification {
  type: string;
  title: string;
  body: string;
}

export interface ScenarioTemplate {
  meta: ScenarioMeta;
  venue: {
    name: string;
    shortName: string;
    city: string;
    country: string;
    capacity: number;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  match: ScenarioMatch;
  zones: ScenarioZone[];
  incidents: ScenarioIncident[];
  resources: ScenarioResource[];
  aiRecommendations: ScenarioAiRecommendation[];
  notifications: ScenarioNotification[];
}
