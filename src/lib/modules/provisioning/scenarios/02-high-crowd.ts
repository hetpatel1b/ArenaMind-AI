import { ScenarioTemplate } from '../types';

export const highCrowd: ScenarioTemplate = {
  meta: {
    id: '02_high_crowd',
    name: 'High Crowd Arrival',
    description:
      'Pre-kickoff phase with dangerous crowd density at the South Gate requiring immediate intervention.',
    healthScore: 82,
  },
  venue: {
    name: 'MetLife Venue',
    shortName: 'MET',
    city: 'New York',
    country: 'USA',
    capacity: 82500,
    latitude: 40.8136,
    longitude: -74.0745,
    timezone: 'America/New_York',
  },
  match: {
    homeTeam: 'USA',
    awayTeam: 'England',
    matchNumber: 55,
    expectedAttendance: 82000,
    actualAttendance: 79500,
    weatherSummary: 'Overcast, 18°C',
    currentPhase: 'pre_kickoff',
    kickoffOffsetMinutes: 15, // Kickoff in 15 mins
  },
  zones: [
    {
      id: 'z_north',
      name: 'North Gate',
      shortCode: 'NG',
      capacity: 15000,
      safeCapacity: 12000,
      metadata: { type: 'entrance' },
      crowd: { fanCount: 8000, densityPct: 53, ingressRate: 150, egressRate: 10 },
    },
    {
      id: 'z_south',
      name: 'South Gate Concourse',
      shortCode: 'SGC',
      capacity: 12000,
      safeCapacity: 9500,
      metadata: { type: 'entrance' },
      crowd: { fanCount: 11800, densityPct: 98, ingressRate: 600, egressRate: 50 }, // Dangerously high
    },
    {
      id: 'z_seating',
      name: 'Main Bowl',
      shortCode: 'MB',
      capacity: 55500,
      safeCapacity: 50000,
      metadata: { type: 'seating' },
      crowd: { fanCount: 59700, densityPct: 88, ingressRate: 700, egressRate: 0 }, // Very full
    },
  ],
  incidents: [
    {
      id: 'inc_crowd',
      title: 'Critical Crowd Bottleneck at South Gate',
      description: 'Density exceeding 95%. Crush risk detected.',
      severityTier: 2,
      status: 'active',
      zoneRef: 'z_south',
      typeRef: 'Crowd Bottleneck',
      aiType: 'crowd_anomaly',
      aiTier: 1,
      aiConfidence: 0.98,
    },
  ],
  resources: [
    {
      name: 'Crowd Control Unit 4',
      typeRef: 'Crowd Control',
      status: 'available',
      zoneRef: 'z_north',
    },
    { name: 'Medical Response B', typeRef: 'Medical Team', status: 'deployed', zoneRef: 'z_south' },
  ],
  aiRecommendations: [
    {
      incidentRef: 'inc_crowd',
      featureName: 'crowd_recommendations',
      modelName: 'claude-3-5-sonnet',
      promptVersion: 'v2.1',
      confidenceScore: 0.99,
      expiresInMinutes: 10,
      data: {
        reason: 'Inflow rate is exceeding processing capacity by 400%. Crush risk is imminent.',
        suggestedAction:
          'Deploy Crowd Control Unit 4 from North Gate to South Gate and open overflow lanes.',
        priority: 'Critical',
        evidence: 'Computer Vision Density Analysis',
        humanApprovalRequired: true,
      },
    },
  ],
  notifications: [
    { type: 'alert', title: 'Density Warning', body: 'South Gate has exceeded 95% capacity.' },
  ],
};
