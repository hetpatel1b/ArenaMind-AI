import { useState, useEffect } from 'react';

// --- Types ---

export interface TelemetryMetric {
  value: number;
  trend: 'up' | 'down' | 'stable';
  status: 'optimal' | 'warning' | 'critical';
}

export interface ZoneTelemetry {
  id: string;
  name: string;
  population: number;
  capacity: number;
  densityPct: number;
  flowRate: number; // people per minute
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'increasing' | 'decreasing' | 'stable';
  status: 'safe' | 'monitor' | 'action_required';
}

export interface BehaviorTelemetry {
  flowStability: TelemetryMetric;
  crowdMood: TelemetryMetric;
  compressionRisk: TelemetryMetric;
  queueHealth: TelemetryMetric;
  movementDirection: 'ingress' | 'egress' | 'mixed';
}

export interface FlowTelemetry {
  ingressRate: number; // people per minute
  egressRate: number; // people per minute
  netFlow: number;
  bottleneckCount: number;
  activeQueues: number;
}

export interface GlobalCrowdTelemetry {
  totalPopulation: number;
  averageDensity: number;
  peakDensity: number;
  highestRiskZoneId: string | null;
  overallStatus: 'normal' | 'elevated' | 'critical';
}

// --- Mock Initial Data ---

const INITIAL_ZONES: ZoneTelemetry[] = [
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
  },
];

const INITIAL_BEHAVIOR: BehaviorTelemetry = {
  flowStability: { value: 85, trend: 'stable', status: 'optimal' },
  crowdMood: { value: 92, trend: 'up', status: 'optimal' },
  compressionRisk: { value: 15, trend: 'stable', status: 'optimal' },
  queueHealth: { value: 78, trend: 'down', status: 'warning' },
  movementDirection: 'ingress',
};

const INITIAL_FLOW: FlowTelemetry = {
  ingressRate: 310,
  egressRate: 45,
  netFlow: 265,
  bottleneckCount: 2,
  activeQueues: 8,
};

// Hooks were removed in favor of useCrowdBehaviorEngine.ts
