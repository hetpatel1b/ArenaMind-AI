import { ScenarioTemplate } from '../types';

export const medicalEmergency: ScenarioTemplate = {
  meta: {
    id: '03_medical_emergency',
    name: 'Medical Emergency',
    description:
      'First half match play interrupted by a severe medical emergency in the lower tier seating.',
    healthScore: 74,
  },
  stadium: {
    name: 'SoFi Stadium',
    shortName: 'SOF',
    city: 'Los Angeles',
    country: 'USA',
    capacity: 70240,
    latitude: 33.9534,
    longitude: -118.3387,
    timezone: 'America/Los_Angeles',
  },
  match: {
    homeTeam: 'Mexico',
    awayTeam: 'Germany',
    matchNumber: 30,
    expectedAttendance: 70000,
    actualAttendance: 69800,
    weatherSummary: 'Sunny, 28°C',
    currentPhase: 'match_live',
    kickoffOffsetMinutes: -25, // 25 mins into the game
  },
  zones: [
    {
      id: 'z_sec112',
      name: 'Section 112',
      shortCode: 'S112',
      capacity: 1500,
      safeCapacity: 1400,
      metadata: { type: 'seating' },
      crowd: { fanCount: 1450, densityPct: 96, ingressRate: 0, egressRate: 0 },
    },
    {
      id: 'z_concourse',
      name: 'Main Concourse',
      shortCode: 'MC',
      capacity: 20000,
      safeCapacity: 18000,
      metadata: { type: 'interior' },
      crowd: { fanCount: 2000, densityPct: 10, ingressRate: 10, egressRate: 10 },
    },
  ],
  incidents: [
    {
      id: 'inc_med',
      title: 'Cardiac Arrest in Section 112',
      description: 'Fan collapsed. CPR in progress by bystanders.',
      severityTier: 1,
      status: 'active',
      zoneRef: 'z_sec112',
      typeRef: 'Medical Emergency',
      aiType: 'medical_anomaly',
      aiTier: 1,
      aiConfidence: 0.92,
    },
  ],
  resources: [
    {
      name: 'Paramedic Team Alpha',
      typeRef: 'Medical Team',
      status: 'available',
      zoneRef: 'z_concourse',
    },
    {
      name: 'Security Escort 2',
      typeRef: 'Security Squad',
      status: 'available',
      zoneRef: 'z_concourse',
    },
  ],
  aiRecommendations: [
    {
      incidentRef: 'inc_med',
      featureName: 'incident_recommend',
      modelName: 'claude-3-5-sonnet',
      promptVersion: 'v2.1',
      confidenceScore: 0.96,
      expiresInMinutes: 5,
      data: {
        reason: 'Time to defibrillation is critical.',
        suggestedAction:
          'Dispatch Paramedic Team Alpha with Security Escort 2 to clear path to Section 112.',
        priority: 'Critical',
        evidence: 'SOS Request via App',
        humanApprovalRequired: true,
      },
    },
  ],
  notifications: [
    {
      type: 'critical',
      title: 'Tier 1 Medical Emergency',
      body: 'Cardiac event reported in Section 112. Immediate dispatch required.',
    },
  ],
};
