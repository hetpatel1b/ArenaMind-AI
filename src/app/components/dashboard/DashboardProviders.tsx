'use client';

import React from 'react';
import { CommandCenterProvider, Mission } from '@/lib/contexts/CommandCenterContext';
import { OperatorProvider } from '@/lib/contexts/OperatorContext';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    name: 'Gate 4 Congestion Relief',
    priority: 'Critical',
    phase: 'APPROVAL',
    incidentId: 'inc1',
    zoneId: 'z_north',
    etaMin: 3,
    assignedResources: ['Sec-A', 'Crowd-Mgmt-2'],
    successProbability: 92,
    reasoning:
      'Density at Gate 4 has exceeded 90%. Historical data shows 98% correlation with entry delays and trampling risks. Deploying additional crowd management reduces wait times by estimated 12 mins.',
    metrics: { completionPct: 0, riskTrend: 'Stable' },
  },
  {
    id: 'm2',
    name: 'Medical Unit Dispatch (Sector B)',
    priority: 'High',
    phase: 'DISPATCH',
    incidentId: 'inc2',
    zoneId: 'z_east',
    etaMin: 5,
    assignedResources: ['Med-3'],
    successProbability: 99,
    reasoning:
      'Sensor data indicates abnormal temperature and prolonged stationary crowd in Sector B. Pre-emptive medical dispatch recommended.',
    metrics: { completionPct: 25, riskTrend: 'Down' },
  },
  {
    id: 'm3',
    name: 'Perimeter Security Sweep',
    priority: 'Medium',
    phase: 'EXECUTION',
    incidentId: 'inc3',
    zoneId: 'z_ext',
    etaMin: 12,
    assignedResources: ['Sec-C', 'Drone-1'],
    successProbability: 85,
    reasoning: 'Standard pre-match security sweep of the external perimeter.',
    metrics: { completionPct: 60, riskTrend: 'Stable' },
  },
  {
    id: 'm4',
    name: 'Metro Line Redirect',
    priority: 'Low',
    phase: 'RESOLVED',
    incidentId: 'inc4',
    zoneId: 'z_south',
    etaMin: 0,
    assignedResources: ['Traffic-Control'],
    successProbability: 100,
    reasoning: 'Earlier inbound surge from metro line was safely diverted to South entrance.',
    metrics: { completionPct: 100, riskTrend: 'Down' },
  },
];

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <OperatorProvider>
      <CommandCenterProvider initialMissions={INITIAL_MISSIONS}>{children}</CommandCenterProvider>
    </OperatorProvider>
  );
}
