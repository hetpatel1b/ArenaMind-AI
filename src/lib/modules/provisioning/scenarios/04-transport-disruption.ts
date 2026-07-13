import { ScenarioTemplate } from '../types';

export const transportDisruption: ScenarioTemplate = {
  meta: {
    id: '04_transport_disruption',
    name: 'Transport Disruption',
    description: 'Halftime scenario with a major metro line failure affecting expected egress.',
    healthScore: 79,
  },
  stadium: {
    name: 'AT&T Stadium',
    shortName: 'ATT',
    city: 'Dallas',
    country: 'USA',
    capacity: 80000,
    latitude: 32.7473,
    longitude: -97.0945,
    timezone: 'America/Chicago',
  },
  match: {
    homeTeam: 'USA',
    awayTeam: 'Argentina',
    matchNumber: 60, // Quarter Final
    expectedAttendance: 80000,
    actualAttendance: 79900,
    weatherSummary: 'Humid, 30°C',
    currentPhase: 'halftime',
    kickoffOffsetMinutes: -50,
  },
  zones: [
    {
      id: 'z_bowl',
      name: 'Main Bowl',
      shortCode: 'MB',
      capacity: 80000,
      safeCapacity: 75000,
      metadata: { type: 'seating' },
      crowd: { fanCount: 50000, densityPct: 62, ingressRate: 50, egressRate: 800 }, // Halftime drain
    },
    {
      id: 'z_concourse',
      name: 'Food & Beverage Concourse',
      shortCode: 'FBC',
      capacity: 25000,
      safeCapacity: 22000,
      metadata: { type: 'interior' },
      crowd: { fanCount: 29900, densityPct: 119, ingressRate: 800, egressRate: 50 }, // Overcrowded at HT
    },
    {
      id: 'z_transit',
      name: 'Metro Plaza',
      shortCode: 'MP',
      capacity: 30000,
      safeCapacity: 25000,
      metadata: { type: 'exterior' },
      crowd: { fanCount: 500, densityPct: 1, ingressRate: 0, egressRate: 0 },
    },
  ],
  incidents: [
    {
      id: 'inc_trans',
      title: 'Blue Line Metro Failure',
      description:
        'Power outage on main transit line. 30,000 fans will require alternative egress post-match.',
      severityTier: 2,
      status: 'active',
      zoneRef: 'z_transit',
      typeRef: 'Equipment Failure',
      aiType: 'transport_anomaly',
      aiTier: 2,
      aiConfidence: 1.0,
    },
  ],
  resources: [
    {
      name: 'Transport Coordinator Hub',
      typeRef: 'Technical Support',
      status: 'deployed',
      zoneRef: 'z_transit',
    },
  ],
  aiRecommendations: [
    {
      incidentRef: 'inc_trans',
      featureName: 'executive_summary',
      modelName: 'claude-3-5-sonnet',
      promptVersion: 'v2.1',
      confidenceScore: 0.88,
      expiresInMinutes: 60,
      data: {
        reason: 'Without the Blue Line, post-match egress will exceed plaza capacity by 150%.',
        suggestedAction:
          'Activate emergency shuttle protocol and delay stadium exit gating by 20 minutes post-match.',
        priority: 'High',
        evidence: 'Transport API Webhook',
        humanApprovalRequired: true,
      },
    },
  ],
  notifications: [
    { type: 'warning', title: 'Transit API Alert', body: 'Blue Line status changed to OFFLINE.' },
  ],
};
