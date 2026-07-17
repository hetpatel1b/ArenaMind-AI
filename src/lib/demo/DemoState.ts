export const DemoState = {
  global: {
    venue: 'ArenaMind National Stadium',
    capacity: 75000,
    attendance: 68430,
    match: 'Championship Final',
    home: 'Arena FC',
    away: 'United FC',
    kickoff: '19:30',
    currentTime: '20:46',
    matchPhase: 'Second Half',
    minute: "71'",
    weather: '28°C',
    humidity: '63%',
    wind: '8 km/h',
    status: 'LIVE',
    vips: 'Present',
    medicalTeams: 'Active',
    police: 'Active',
    security: 'High',
    emergencyLevel: 'Normal',
  },
  incidents: [
    {
      id: 'INC-7102',
      type: 'Medical',
      severity: 'high',
      status: 'resolved',
      location: 'Sector B, Row 12',
      description: 'Medical response completed for dehydration.',
      timestamp: '20:42',
      resolvedAt: '20:45',
    },
    {
      id: 'INC-7103',
      type: 'Security',
      severity: 'medium',
      status: 'active',
      location: 'Gate B',
      description: 'Minor dispute at concession stand. Security patrol reassigned.',
      timestamp: '20:44',
    },
    {
      id: 'INC-7104',
      type: 'Lost Child',
      severity: 'critical',
      status: 'resolved',
      location: 'Family Zone',
      description: 'Lost child reunited with parents.',
      timestamp: '20:30',
      resolvedAt: '20:35',
    },
  ],
  mobility: {
    parking: {
      lot1: { capacity: 5000, occupied: 4800, status: 'near_full' },
      lot2: { capacity: 3000, occupied: 3000, status: 'full' },
      lot3: { capacity: 4000, occupied: 1200, status: 'available' },
    },
    metro: { status: 'delay', delayMinutes: 10, description: 'Metro delay on Blue Line' },
    traffic: { congestion: 'high', speed: '12 km/h' },
  },
  crowd: {
    gateB: { occupancy: 92, status: 'exceeded_90' },
    overallDensity: 'high',
    flowRate: 'moderate',
    heatmaps: [
      { id: 'zone-1', lat: 34.0522, lng: -118.2437, weight: 0.9 },
      { id: 'zone-2', lat: 34.0523, lng: -118.2438, weight: 0.8 },
      { id: 'zone-3', lat: 34.0521, lng: -118.2436, weight: 0.5 },
    ],
  },
  workforce: {
    activePatrols: 42,
    medicalUnits: 12,
    cleaningStaff: 28,
    fatigueAlerts: 2,
    recentDispatch: 'Security patrol reassigned to Gate B',
  },
  cameras: {
    total: 240,
    active: 239,
    offline: ['CAM-18'],
    detections: { crowd: 68430, vehicles: 4800, incidents: 1 },
  },
  infrastructure: {
    cpu: 42,
    memory: 68,
    latency: 12,
    status: 'healthy',
  },
  governance: {
    compliance: 'SOC2, ISO 27001, GDPR',
    activeUsers: 14,
    recentAudits: 'Passed',
  },
  copilot: {
    currentObservations:
      'Gate B occupancy has exceeded 90%. Security incident INC-7103 is active nearby. Medical incident INC-7102 was recently resolved. Metro delay of 10 minutes reported.',
    reasoning:
      'High density at Gate B combined with a minor dispute increases the risk of crowd crush. Reassigning overflow to Gate C will alleviate pressure.',
    recommendations: [
      'Reroute crowd from Gate B to Gate C',
      'Dispatch additional security to Gate B concession stand',
    ],
    confidence: 94,
    executiveSummary:
      'Match is in the 71st minute. Attendance is 68,430. Operations are normal, but Gate B requires immediate load balancing due to high occupancy and a minor dispute.',
    historicalComparison:
      'Similar density in the 2024 Semi-Finals led to a 15-minute egress delay. Proactive routing is advised.',
    missingInformation: 'Awaiting visual confirmation from CAM-18 (currently offline).',
    alternativeStrategies: ['Hold concession operations at Gate B temporarily'],
  },
  notifications: [
    { id: '1', message: 'Medical response completed', time: '20:45', type: 'info' },
    { id: '2', message: 'VIP convoy entering', time: '20:43', type: 'info' },
    { id: '3', message: 'Gate B occupancy exceeded 90%', time: '20:44', type: 'warning' },
    { id: '4', message: 'Camera 18 offline', time: '20:30', type: 'error' },
    { id: '5', message: 'Metro delay', time: '20:40', type: 'warning' },
    { id: '6', message: 'Parking lot 2 full', time: '20:00', type: 'warning' },
    { id: '7', message: 'Lost child reunited', time: '20:35', type: 'success' },
  ],
};

export type DemoStateType = typeof DemoState;

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const demoStateEmitter = {
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  emit: () => {
    listeners.forEach((l) => l());
  },
  mutate: (updater: (state: DemoStateType) => void) => {
    updater(DemoState);
    demoStateEmitter.emit();
  },
};
