import { ScenarioTemplate } from '../types';

export const exitFlowSurge: ScenarioTemplate = {
  meta: {
    id: '05_exit_flow_surge',
    name: 'Exit Flow Surge',
    description:
      'Post-match egress phase with a massive surge of fans trying to leave simultaneously.',
    healthScore: 71,
  },
  venue: {
    name: 'Lusail Venue',
    shortName: 'LUS',
    city: 'Lusail',
    country: 'Qatar',
    capacity: 88966,
    latitude: 25.4208,
    longitude: 51.4903,
    timezone: 'Asia/Qatar',
  },
  match: {
    homeTeam: 'France',
    awayTeam: 'Portugal',
    matchNumber: 62, // Semi Final
    expectedAttendance: 88500,
    actualAttendance: 88500,
    weatherSummary: 'Clear, 26°C',
    currentPhase: 'crowd_exit',
    kickoffOffsetMinutes: -125, // Match just ended
  },
  zones: [
    {
      id: 'z_bowl',
      name: 'Main Bowl',
      shortCode: 'MB',
      capacity: 88966,
      safeCapacity: 85000,
      metadata: { type: 'seating' },
      crowd: { fanCount: 60000, densityPct: 67, ingressRate: 0, egressRate: 2500 }, // Leaving rapidly
    },
    {
      id: 'z_east_gate',
      name: 'East Exit Gate',
      shortCode: 'EEG',
      capacity: 15000,
      safeCapacity: 12000,
      metadata: { type: 'exit' },
      crowd: { fanCount: 16500, densityPct: 110, ingressRate: 1500, egressRate: 400 }, // Bottleneck
    },
  ],
  incidents: [
    {
      id: 'inc_exit',
      title: 'Severe Egress Bottleneck',
      description: 'East Gate throughput is dropping while pressure from Bowl increases.',
      severityTier: 1,
      status: 'active',
      zoneRef: 'z_east_gate',
      typeRef: 'Crowd Bottleneck',
      aiType: 'crowd_anomaly',
      aiTier: 1,
      aiConfidence: 0.97,
    },
  ],
  resources: [
    {
      name: 'Mounted Police Unit',
      typeRef: 'Security Squad',
      status: 'available',
      zoneRef: 'z_east_gate',
    },
    {
      name: 'Crowd Flow Stewards',
      typeRef: 'Crowd Control',
      status: 'deployed',
      zoneRef: 'z_east_gate',
    },
  ],
  aiRecommendations: [
    {
      incidentRef: 'inc_exit',
      featureName: 'crowd_recommendations',
      modelName: 'claude-3-5-sonnet',
      promptVersion: 'v2.1',
      confidenceScore: 0.94,
      expiresInMinutes: 15,
      data: {
        reason: 'Egress rate is constrained by narrowed barriers on East perimeter.',
        suggestedAction:
          'Authorize Mounted Police to expand perimeter barriers by 15 meters to relieve pressure.',
        priority: 'Critical',
        evidence: 'Drone Topographical Feed',
        humanApprovalRequired: true,
      },
    },
  ],
  notifications: [
    {
      type: 'critical',
      title: 'Crush Risk Detected',
      body: 'East Gate density is critically high. Egress rates falling.',
    },
  ],
};
