import { useState, useEffect, useRef } from 'react';

// --- Types ---
export interface TrendDataPoint {
  time: number;
  value: number;
}

export interface QueueTelemetry {
  id: string;
  name: string;
  currentWait: number; // minutes
  predictedWait: number; // minutes
  health: 'optimal' | 'warning' | 'critical';
  throughput: number; // people per minute
  capacity: number; // max throughput
  trend: TrendDataPoint[];
}

export interface ZoneTelemetryExt {
  id: string;
  name: string;
  population: number;
  capacity: number;
  densityPct: number;
  flowRate: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'increasing' | 'decreasing' | 'stable';
  status: 'safe' | 'monitor' | 'action_required';
  historicalDensity: TrendDataPoint[];
  mood: number; // 0-100
  compressionScore: number; // 0-100
  aiRecommendation?: string;
}

export interface MissionTelemetry {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  assignedUnits: string[];
  eta: string;
  status:
    | 'Detected'
    | 'Verified'
    | 'Analyzing'
    | 'Recommendation'
    | 'Approval Required'
    | 'Dispatched'
    | 'Execution'
    | 'Verification'
    | 'Resolved';
  progress: number;
  riskReduction: string;
}

export interface ResourceTelemetry {
  id: string;
  type: 'Security' | 'Medical' | 'Police' | 'Volunteer' | 'Transport';
  name: string;
  status: 'available' | 'en_route' | 'busy' | 'offline';
  distance: string;
  eta: string;
  currentAssignment: string;
  health: number;
  workload: number;
}

export interface NotificationTelemetry {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'info';
  message: string;
  time: string;
  zoneId?: string;
}

export interface CrowdBehaviorState {
  zones: ZoneTelemetryExt[];
  queues: QueueTelemetry[];
  flow: {
    ingressRate: number;
    egressRate: number;
    netFlow: number;
    bottleneckCount: number;
  };
  missions: MissionTelemetry[];
  resources: ResourceTelemetry[];
  notifications: NotificationTelemetry[];
  global: {
    totalPopulation: number;
    averageDensity: number;
    peakDensity: number;
    highestRiskZoneId: string | null;
    overallStatus: 'normal' | 'elevated' | 'critical';
  };
  copilot: {
    observation: string;
    reasoning: string[];
    prediction: string;
    recommendation: string;
    expectedOutcome: string;
    confidence: number;
    isActive: boolean;
  } | null;
}

// --- Initial State ---
const INITIAL_ZONES: ZoneTelemetryExt[] = [
  {
    id: 'z-north',
    name: 'North Gate',
    population: 1200,
    capacity: 5000,
    densityPct: 24,
    flowRate: 45,
    riskLevel: 'low',
    trend: 'increasing',
    status: 'safe',
    historicalDensity: [],
    mood: 90,
    compressionScore: 10,
  },
  {
    id: 'z-south',
    name: 'South Gate',
    population: 4500,
    capacity: 5000,
    densityPct: 90,
    flowRate: 120,
    riskLevel: 'critical',
    trend: 'increasing',
    status: 'action_required',
    historicalDensity: [],
    mood: 45,
    compressionScore: 85,
  },
  {
    id: 'z-vip',
    name: 'VIP Entrance',
    population: 200,
    capacity: 500,
    densityPct: 40,
    flowRate: 10,
    riskLevel: 'low',
    trend: 'stable',
    status: 'safe',
    historicalDensity: [],
    mood: 95,
    compressionScore: 5,
  },
  {
    id: 'z-east',
    name: 'East Concourse',
    population: 3100,
    capacity: 4000,
    densityPct: 77.5,
    flowRate: 85,
    riskLevel: 'high',
    trend: 'increasing',
    status: 'monitor',
    historicalDensity: [],
    mood: 65,
    compressionScore: 60,
  },
  {
    id: 'z-west',
    name: 'West Plaza',
    population: 1800,
    capacity: 6000,
    densityPct: 30,
    flowRate: 50,
    riskLevel: 'low',
    trend: 'decreasing',
    status: 'safe',
    historicalDensity: [],
    mood: 88,
    compressionScore: 15,
  },
];

const INITIAL_QUEUES: QueueTelemetry[] = [
  {
    id: 'q-sg',
    name: 'South Gate Queue',
    currentWait: 12,
    predictedWait: 18,
    health: 'critical',
    throughput: 110,
    capacity: 150,
    trend: [],
  },
  {
    id: 'q-ng',
    name: 'North Gate Queue',
    currentWait: 3,
    predictedWait: 4,
    health: 'optimal',
    throughput: 45,
    capacity: 150,
    trend: [],
  },
  {
    id: 'q-vip',
    name: 'VIP Queue',
    currentWait: 1,
    predictedWait: 1,
    health: 'optimal',
    throughput: 10,
    capacity: 50,
    trend: [],
  },
];

const INITIAL_RESOURCES: ResourceTelemetry[] = [
  {
    id: 'r1',
    type: 'Security',
    name: 'Crowd Control Unit 4',
    status: 'available',
    distance: '0.4 mi',
    eta: '3 mins',
    currentAssignment: 'Standby - West Plaza',
    health: 95,
    workload: 10,
  },
  {
    id: 'r2',
    type: 'Medical',
    name: 'Med Response Alpha',
    status: 'available',
    distance: '0.1 mi',
    eta: '1 min',
    currentAssignment: 'Standby - North Gate',
    health: 100,
    workload: 5,
  },
  {
    id: 'r3',
    type: 'Security',
    name: 'Quick Response Team 2',
    status: 'busy',
    distance: '1.2 mi',
    eta: '8 mins',
    currentAssignment: 'East Concourse Patrol',
    health: 80,
    workload: 75,
  },
  {
    id: 'r4',
    type: 'Police',
    name: 'Metro Police Liaison',
    status: 'available',
    distance: '0.8 mi',
    eta: '5 mins',
    currentAssignment: 'Transit Hub',
    health: 90,
    workload: 40,
  },
];

const INITIAL_NOTIFICATIONS: NotificationTelemetry[] = [
  {
    id: 'n1',
    type: 'info',
    message: 'Pre-Match Ingress phase initiated.',
    time: '19:00',
    zoneId: 'z-north',
  },
];

export function useCrowdBehaviorEngine(tickRateMs: number = 2000) {
  const [state, setState] = useState<CrowdBehaviorState>({
    zones: INITIAL_ZONES,
    queues: INITIAL_QUEUES,
    flow: { ingressRate: 310, egressRate: 45, netFlow: 265, bottleneckCount: 1 },
    missions: [],
    resources: INITIAL_RESOURCES,
    notifications: INITIAL_NOTIFICATIONS,
    global: {
      totalPopulation: 0,
      averageDensity: 0,
      peakDensity: 0,
      highestRiskZoneId: null,
      overallStatus: 'normal',
    },
    copilot: null,
  });

  const tickRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++;
      const now = Date.now();

      setState((prev) => {
        let totalPop = 0;
        let totalCap = 0;
        let peakDensity = 0;
        let highestRiskZoneId: string | null = null;
        let criticalCount = 0;
        let totalIngress = 0;

        // 1. Simulate Zones
        const newZones = prev.zones.map((zone) => {
          // Surge logic for South Gate
          let popDelta = 0;
          if (zone.id === 'z-south') {
            popDelta = 10 + Math.floor(Math.random() * 20); // Continually increasing
          } else if (zone.id === 'z-east') {
            // Multi-Zone Sync: South Gate spillover
            const southZone = prev.zones.find((z) => z.id === 'z-south');
            if (southZone && southZone.densityPct > 85) {
              popDelta = 5 + Math.floor(Math.random() * 10);
            } else {
              popDelta = Math.floor(Math.random() * 11) - 5;
            }
          } else {
            popDelta = Math.floor(Math.random() * 11) - 5;
          }

          const newPop = Math.max(0, Math.min(zone.capacity, zone.population + popDelta));
          const density = Number(((newPop / zone.capacity) * 100).toFixed(1));

          let risk: ZoneTelemetryExt['riskLevel'] = 'low';
          let status: ZoneTelemetryExt['status'] = 'safe';

          if (density >= 90) {
            risk = 'critical';
            status = 'action_required';
            criticalCount++;
          } else if (density >= 75) {
            risk = 'high';
            status = 'monitor';
            criticalCount++;
          } else if (density >= 60) {
            risk = 'medium';
            status = 'monitor';
          }

          if (density > peakDensity) {
            peakDensity = density;
            highestRiskZoneId = zone.id;
          }

          totalPop += newPop;
          totalCap += zone.capacity;
          totalIngress += Math.max(0, popDelta) * 3; // roughly map to ingress rate

          // Trend history (keep last 20)
          const newHistory = [...zone.historicalDensity, { time: now, value: density }].slice(-20);

          // Compression score mapping linearly to density > 60
          const compression = density > 60 ? Math.min(100, (density - 60) * 2.5) : 5;
          const mood = Math.max(0, 100 - compression * 0.8);

          let aiRec = undefined;
          if (risk === 'critical') {
            aiRec = 'Deploy Unit 4';
          } else if (risk === 'high') {
            aiRec = 'Monitor Flow';
          }

          return {
            ...zone,
            population: newPop,
            densityPct: density,
            riskLevel: risk,
            status,
            compressionScore: Math.round(compression),
            mood: Math.round(mood),
            trend: (popDelta > 0
              ? 'increasing'
              : popDelta < 0
                ? 'decreasing'
                : 'stable') as ZoneTelemetryExt['trend'],
            historicalDensity: newHistory,
            aiRecommendation: aiRec,
          };
        });

        // 2. Simulate Queues
        const newQueues = prev.queues.map((q) => {
          let waitDelta = 0;
          if (q.id === 'q-sg')
            waitDelta = 0.5 + Math.random() * 1; // Growing
          else waitDelta = Math.random() * 0.4 - 0.2;

          const newWait = Math.max(1, q.currentWait + waitDelta);
          const newHistory = [...q.trend, { time: now, value: newWait }].slice(-20);

          return {
            ...q,
            currentWait: Number(newWait.toFixed(1)),
            predictedWait: Number((newWait * 1.4).toFixed(1)), // Simple prediction
            health: (newWait > 15
              ? 'critical'
              : newWait > 8
                ? 'warning'
                : 'optimal') as QueueTelemetry['health'],
            trend: newHistory,
          };
        });

        // 3. Update Flow & Global
        const avgDensity = totalCap > 0 ? Number(((totalPop / totalCap) * 100).toFixed(1)) : 0;
        const globalStatus =
          criticalCount >= 2 || peakDensity >= 95
            ? 'critical'
            : criticalCount >= 1
              ? 'elevated'
              : 'normal';

        // 4. Copilot Reasoning Engine
        let copilot = prev.copilot;
        if (peakDensity > 85) {
          const zoneObj = newZones.find((z) => z.id === highestRiskZoneId);
          copilot = {
            isActive: true,
            observation: `${zoneObj?.name} density has reached ${peakDensity}%. Ingress rate remains high causing localized compression.`,
            reasoning: [
              `Transit arrivals at ${zoneObj?.name} exceeded forecast by 22%.`,
              `Queue wait times currently at ${newQueues.find((q) => q.name.includes(zoneObj?.name || ''))?.currentWait || 12} mins.`,
              `Compression score is ${zoneObj?.compressionScore}/100.`,
            ],
            prediction: `Density will breach safe thresholds (95%+) within 6 minutes. Queue will collapse into concourse.`,
            recommendation: `Deploy Crowd Control Unit 4 to ${zoneObj?.name} and redirect incoming foot traffic to East Concourse.`,
            expectedOutcome: `Density reduction to ~78% within 12 mins. Queue stabilization.`,
            confidence: 94,
          };
        } else if (peakDensity < 70) {
          copilot = null;
        }

        const newNotifications = [...prev.notifications];
        if (
          peakDensity > 90 &&
          !newNotifications.find((n) => n.message.includes('Critical Density'))
        ) {
          newNotifications.unshift({
            id: 'n-crit-' + Date.now(),
            type: 'critical',
            message:
              'Critical Density Alert at ' + newZones.find((z) => z.id === highestRiskZoneId)?.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            zoneId: highestRiskZoneId || undefined,
          });
          if (newNotifications.length > 10) newNotifications.pop();
        }

        return {
          zones: newZones,
          queues: newQueues,
          flow: {
            ingressRate: 280 + totalIngress,
            egressRate: 45 + Math.floor(Math.random() * 10),
            netFlow: 280 + totalIngress - 45,
            bottleneckCount: criticalCount,
          },
          missions: prev.missions,
          resources: prev.resources,
          notifications: newNotifications,
          global: {
            totalPopulation: totalPop,
            averageDensity: avgDensity,
            peakDensity,
            highestRiskZoneId,
            overallStatus: globalStatus,
          },
          copilot,
        };
      });
    }, tickRateMs);

    return () => clearInterval(interval);
  }, [tickRateMs]);

  return state;
}
