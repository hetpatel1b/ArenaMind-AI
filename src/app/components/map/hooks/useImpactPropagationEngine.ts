'use client';

import { useMemo } from 'react';

export interface ImpactNode {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timeDelay: string; // e.g., '+15m'
}

export function useImpactPropagationEngine() {
  const impactWaves: ImpactNode[] = useMemo(
    () => [
      {
        id: 'prop-1',
        sourceId: 'AIR-1', // Airport
        targetId: 'METRO-3', // City Center Metro
        label: 'Passenger Surge',
        severity: 'HIGH',
        timeDelay: '+25m',
      },
      {
        id: 'prop-2',
        sourceId: 'METRO-1', // Stadium North
        targetId: 'INC-9932', // Stadium Gate Congestion
        label: 'Arrival Bottleneck',
        severity: 'MEDIUM',
        timeDelay: '+10m',
      },
      {
        id: 'prop-3',
        sourceId: 'INC-9932',
        targetId: 'HOSP-1', // Hospital
        label: 'Medical Routing Delay',
        severity: 'HIGH',
        timeDelay: '+5m',
      },
    ],
    []
  );

  return {
    impactWaves,
  };
}
