import { useQuery } from '@tanstack/react-query';
import { mobilityApi } from '@/lib/api-client/features/mobility';
import { useEffect } from 'react';
import type {
  TrafficStatus,
  MobilityAlert,
  CopilotReasoningStep,
  MobilityEngineState,
} from './MobilityTypes';
export function useMobilityEngine() {
  const { data } = useQuery({
    queryKey: ['mobility', 'engine'],
    queryFn: () => mobilityApi.getState({ matchId: '123e4567-e89b-12d3-a456-426614174000' }),
    refetchInterval: 5000,
  });

  const defaultHealth = {
    status: 'OFFLINE' as TrafficStatus,
    progress: 0,
    trend: 'neutral' as 'up' | 'down' | 'neutral',
    capacity: 0,
    health: 0,
    sparkline: [] as number[],
  };

  const snapshots = data?.data || [];

  // Safely map paginated DB snapshots to the composite object the UI expects.
  const metroSnapshot = snapshots.find((s: SafeAny) => s.transitMode === 'metro');
  const busSnapshot = snapshots.find((s: SafeAny) => s.transitMode === 'bus');
  const carSnapshot = snapshots.find((s: SafeAny) => s.transitMode === 'car');

  const createSidebarEntry = (snapshot: SafeAny) => ({
    status: (snapshot?.status || 'OFFLINE') as TrafficStatus,
    progress: snapshot ? 100 : 0,
    trend: 'neutral' as 'up' | 'down' | 'neutral',
    capacity: snapshot?.passengerCount || 0,
    health: snapshot ? 100 - snapshot.delayMinutes : 0,
    sparkline: [] as number[],
  });

  return {
    metrics: {
      metroHealth: metroSnapshot ? 100 - metroSnapshot.delayMinutes : 0,
      busCapacity: busSnapshot?.passengerCount || 0,
      parkingOccupancy: carSnapshot?.passengerCount || 0,
      trafficLoad: carSnapshot ? carSnapshot.delayMinutes * 10 : 0,
      emergencyRoutes: (snapshots.length > 0 ? 'CLEAR' : 'IMPACTED') as 'CLEAR' | 'IMPACTED',
      vipRoutes: (snapshots.length > 0 ? 'CLEAR' : 'IMPACTED') as 'CLEAR' | 'IMPACTED',
      averageETA: data?.metrics?.averageETA || 'Unknown',
      congestionIndex: data?.metrics?.congestionIndex ?? 0,
      predictedDelay: data?.metrics?.predictedDelay || 'Unknown',
      networkAvailability: snapshots.length > 0 ? 100 : 0,
      fleetReadiness: data?.metrics?.fleetReadiness ?? 0,
      signalHealth: data?.metrics?.signalHealth ?? 0,
      activeRoutes: data?.metrics?.activeRoutes ?? 0,
      fleetStatus: data?.metrics?.fleetStatus ?? null,
      transitCapacity: data?.metrics?.transitCapacity ?? 0,
      carbonOffset: data?.metrics?.carbonOffset ?? 0,
    },
    activeAlerts: [] as MobilityAlert[],
    copilotReasoning: [] as CopilotReasoningStep[],
    sidebarData: {
      metro: createSidebarEntry(metroSnapshot),
      bus: createSidebarEntry(busSnapshot),
      road: createSidebarEntry(carSnapshot),
      parking: createSidebarEntry(carSnapshot),
      rideShare: defaultHealth,
      emergency: defaultHealth,
      accessibility: defaultHealth,
    },
    predictions: {} as MobilityEngineState['predictions'],
    missions: [],
    dispatchResources: [],
    whatIfScenarios: [],
    transitLines: [],
    parkingLots: [],
    routes: [],
    fleetUnits: [],
    operationalMemory: [],
    operators: [],
    vehicles: [],
    tick: 0,
  };
}
