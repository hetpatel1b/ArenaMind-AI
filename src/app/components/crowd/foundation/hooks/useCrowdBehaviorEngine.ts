import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { crowdApi, incidentApi, workforceApi } from '@/lib/api-client';

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

// --- Initial Fallback State (used while loading) ---
const FALLBACK_STATE: CrowdBehaviorState = {
  zones: [],
  queues: [],
  flow: { ingressRate: 0, egressRate: 0, netFlow: 0, bottleneckCount: 0 },
  missions: [],
  resources: [],
  notifications: [],
  global: {
    totalPopulation: 0,
    averageDensity: 0,
    peakDensity: 0,
    highestRiskZoneId: null,
    overallStatus: 'normal',
  },
  copilot: null,
};

export function useCrowdBehaviorEngine(matchId: string = '123e4567-e89b-12d3-a456-426614174000') {
  // Fetch real data from the backend APIs
  const { data: crowdData, isLoading: isCrowdLoading } = useQuery({
    queryKey: ['crowd', matchId],
    queryFn: () => crowdApi.getState({ matchId }),
    refetchInterval: 5000,
  });

  const { data: incidentsData } = useQuery({
    queryKey: ['incidents', matchId],
    queryFn: () => incidentApi.getState({ matchId }),
    refetchInterval: 10000,
  });

  const { data: workforceData } = useQuery({
    queryKey: ['workforce'],
    queryFn: () => workforceApi.getState(),
    refetchInterval: 15000,
  });

  // Transform backend data to perfectly match the frozen frontend interfaces
  const state = useMemo((): CrowdBehaviorState => {
    if (!crowdData?.data) return FALLBACK_STATE;

    const zones: ZoneTelemetryExt[] = crowdData.data.map((snapshot: SafeAny) => {
      const risk =
        snapshot.densityPct > 90 ? 'critical' : snapshot.densityPct > 75 ? 'high' : 'low';
      return {
        id: snapshot.zoneId,
        name: snapshot.zoneId.toUpperCase().replace('-', ' '),
        population: snapshot.population,
        capacity: snapshot.capacity,
        densityPct: snapshot.densityPct,
        flowRate: snapshot.flowRate,
        riskLevel: risk,
        trend: 'stable',
        status: risk === 'critical' ? 'action_required' : 'safe',
        historicalDensity: [{ time: snapshot.timestamp || 0, value: snapshot.densityPct }],
        mood: 90 - snapshot.densityPct / 2,
        compressionScore: Math.min(100, snapshot.densityPct * 1.1),
      };
    });

    const missions: MissionTelemetry[] = (incidentsData?.data || []).map((inc: SafeAny) => ({
      id: inc.id,
      priority: inc.severityTier === 1 ? 'high' : 'medium',
      title: inc.title,
      assignedUnits: ['Unit 1'],
      eta: '2 mins',
      status: inc.status === 'open' ? 'Detected' : 'Dispatched',
      progress: 50,
      riskReduction: 'Medium',
    }));

    const resources: ResourceTelemetry[] = (workforceData?.data || []).map((wf: SafeAny) => ({
      id: wf.id,
      type: wf.role.charAt(0).toUpperCase() + wf.role.slice(1),
      name: wf.name,
      status: wf.status === 'available' ? 'available' : 'busy',
      distance: '0.2 mi',
      eta: '1 min',
      currentAssignment: 'Patrol',
      health: wf.batteryLevel,
      workload: 30,
    }));

    const totalPop = zones.reduce((sum, z) => sum + z.population, 0);
    const totalCap = zones.reduce((sum, z) => sum + z.capacity, 0);
    const peakZone =
      zones.length > 0
        ? zones.reduce(
            (prev, curr) => (curr.densityPct > (prev?.densityPct || 0) ? curr : prev),
            zones[0]
          )
        : null;

    const globalStatus = peakZone && peakZone.densityPct > 90 ? 'critical' : 'normal';

    return {
      zones,
      queues: [], // Queues not yet modeled in DB, keeping empty
      flow: {
        ingressRate: 500,
        egressRate: 200,
        netFlow: 300,
        bottleneckCount: zones.filter((z) => z.riskLevel === 'critical').length,
      },
      missions,
      resources,
      notifications: [], // To be added from notification service
      global: {
        totalPopulation: totalPop,
        averageDensity: totalCap > 0 ? (totalPop / totalCap) * 100 : 0,
        peakDensity: peakZone ? peakZone.densityPct : 0,
        highestRiskZoneId: peakZone ? peakZone.id : null,
        overallStatus: globalStatus,
      },
      copilot:
        peakZone && peakZone.densityPct > 85
          ? {
              isActive: true,
              observation: `${peakZone.name} is reaching critical capacity.`,
              reasoning: ['Density exceeds 85% threshold.'],
              prediction: 'Potential crush risk in 10 minutes.',
              recommendation: 'Deploy security to regulate flow.',
              expectedOutcome: 'Density normalized to 75%.',
              confidence: 90,
            }
          : null,
    };
  }, [crowdData, incidentsData, workforceData]);

  return {
    state,
    executeCommand: (cmd: string) => {
      // In a real implementation, this would trigger a POST to /api/v1/incidents
    },
    takeAction: (actionId: string) => {},
  };
}
