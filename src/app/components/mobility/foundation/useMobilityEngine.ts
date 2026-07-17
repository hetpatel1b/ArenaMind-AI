import { useQuery } from '@tanstack/react-query';
import { mobilityApi } from '@/lib/api-client/features/mobility';
import { useEffect } from 'react';
export function useMobilityEngine() {
  const { data } = useQuery({
    queryKey: ['mobility', 'engine'],
    queryFn: () => mobilityApi.getState({ matchId: '123e4567-e89b-12d3-a456-426614174000' }),
    refetchInterval: 5000,
  });

  const defaultHealth = { status: 'NOMINAL', progress: 100, trend: 'neutral', capacity: 100, health: 100, sparkline: [100, 100] };

  return {
    metrics: data?.metrics || {
      metroHealth: 100,
      busCapacity: 100,
      parkingOccupancy: 0,
      trafficLoad: 0,
      emergencyRoutes: 'CLEAR',
      vipRoutes: 'CLEAR',
      averageETA: '15m',
      congestionIndex: 0,
      predictedDelay: '0m',
      networkAvailability: 100,
      fleetReadiness: 100,
      signalHealth: 100,
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
    predictions: data?.predictions || {
      m15: { id: 'm15', timeframe: '+15m', predictedCongestion: {}, confidence: 95, aiRecommendation: 'Nominal' },
      m30: { id: 'm30', timeframe: '+30m', predictedCongestion: {}, confidence: 90, aiRecommendation: 'Nominal' },
      m60: { id: 'm60', timeframe: '+60m', predictedCongestion: {}, confidence: 85, aiRecommendation: 'Nominal' }
    },
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
