import { useQuery } from '@tanstack/react-query';
import { mobilityApi } from '@/lib/api-client/features/mobility';
import { useEffect } from 'react';
export function useMobilityEngine() {
  const { data } = useQuery({
    queryKey: ['mobility', 'engine'],
    queryFn: () => mobilityApi.getState({ matchId: '123e4567-e89b-12d3-a456-426614174000' }),
    refetchInterval: 5000,
  });

  const defaultHealth = {
    status: 'OFFLINE',
    progress: 0,
    trend: 'neutral',
    capacity: 0,
    health: 0,
    sparkline: [],
  };

  return {
    metrics: data?.metrics || {
      metroHealth: 0,
      busCapacity: 0,
      parkingOccupancy: 0,
      trafficLoad: 0,
      emergencyRoutes: 'UNKNOWN',
      vipRoutes: 'UNKNOWN',
      averageETA: 'N/A',
      congestionIndex: 0,
      predictedDelay: '0m',
      networkAvailability: 0,
      fleetReadiness: 0,
      signalHealth: 0,
      activeRoutes: 0,
      fleetStatus: 0,
      transitCapacity: 0,
      carbonOffset: 0,
    },
    activeAlerts: data?.alerts || [],
    copilotReasoning: data?.reasoningStream || [],
    sidebarData: data?.sidebarData || {
      metro: defaultHealth,
      bus: defaultHealth,
      road: defaultHealth,
      parking: defaultHealth,
      rideShare: defaultHealth,
      emergency: defaultHealth,
      accessibility: defaultHealth,
    },
    predictions: data?.predictions || {},
    missions: data?.missions || [],
    dispatchResources: data?.dispatchResources || [],
    whatIfScenarios: data?.whatIfScenarios || [],
    transitLines: data?.transitLines || [],
    parkingLots: data?.parkingLots || [],
    routes: data?.routes || [],
    fleetUnits: data?.fleetUnits || [],
    operationalMemory: data?.operationalMemory || [],
    operators: data?.operators || [],
    vehicles: data?.vehicles || [],
    tick: data?.tick || 0,
  };
}
