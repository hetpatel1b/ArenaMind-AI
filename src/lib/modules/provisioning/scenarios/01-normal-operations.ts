import { ScenarioTemplate } from '../types';

export const normalOperations: ScenarioTemplate = {
  meta: {
    id: '01_normal_operations',
    name: 'Normal Match Operations',
    description: 'Standard fan arrival phase with smooth operational flow and high health score.',
    healthScore: 96,
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
    homeTeam: 'Brazil',
    awayTeam: 'Spain',
    matchNumber: 42,
    expectedAttendance: 85000,
    actualAttendance: 25000, // Still arriving
    weatherSummary: 'Clear, 22°C',
    currentPhase: 'fan_arrival',
    kickoffOffsetMinutes: 120, // Kickoff is in 2 hours
  },
  zones: [
    {
      id: 'z_north',
      name: 'North Fan Zone',
      shortCode: 'NFZ',
      capacity: 15000,
      safeCapacity: 12000,
      metadata: { type: 'exterior' },
      crowd: { fanCount: 4500, densityPct: 30, ingressRate: 250, egressRate: 10 },
    },
    {
      id: 'z_south',
      name: 'South Gate Concourse',
      shortCode: 'SGC',
      capacity: 12000,
      safeCapacity: 9500,
      metadata: { type: 'entrance' },
      crowd: { fanCount: 3800, densityPct: 31, ingressRate: 300, egressRate: 5 },
    },
    {
      id: 'z_vip',
      name: 'VIP Pavilion',
      shortCode: 'VIP',
      capacity: 3000,
      safeCapacity: 2500,
      metadata: { type: 'premium' },
      crowd: { fanCount: 200, densityPct: 6, ingressRate: 15, egressRate: 0 },
    },
    {
      id: 'z_seating',
      name: 'Lower Tier Seating',
      shortCode: 'LTS',
      capacity: 35000,
      safeCapacity: 32000,
      metadata: { type: 'seating' },
      crowd: { fanCount: 16500, densityPct: 47, ingressRate: 400, egressRate: 0 },
    },
  ],
  incidents: [
    {
      id: 'inc_1',
      title: 'Minor Ticketing Issue',
      description: 'Small queue buildup due to faulty scanner at Gate 4.',
      severityTier: 4,
      status: 'monitoring',
      zoneRef: 'z_north',
      typeRef: 'Equipment Failure',
      aiType: 'operational_anomaly',
      aiTier: 4,
      aiConfidence: 0.91,
    },
  ],
  resources: [
    {
      name: 'Security Squad Alpha',
      typeRef: 'Security Squad',
      status: 'deployed',
      zoneRef: 'z_north',
    },
    {
      name: 'Tech Support Team 1',
      typeRef: 'Technical Support',
      status: 'deployed',
      zoneRef: 'z_north',
    },
  ],
  aiRecommendations: [
    {
      incidentRef: 'inc_1',
      featureName: 'incident_recommend',
      modelName: 'claude-3-5-sonnet',
      promptVersion: 'v2.1',
      confidenceScore: 0.95,
      expiresInMinutes: 30,
      data: {
        reason: 'Historical data shows this model of scanner requires a hard reset.',
        suggestedAction: 'Perform hardware reboot on Scanner Node 4B.',
        priority: 'Low',
        evidence: 'Maintenance logs',
        humanApprovalRequired: false,
      },
    },
  ],
  notifications: [
    { type: 'info', title: 'Gates Opened', body: 'Fan arrival phase has officially commenced.' },
  ],
};
