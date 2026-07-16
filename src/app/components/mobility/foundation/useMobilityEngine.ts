'use client';

import { useState, useEffect, useRef } from 'react';
import { MobilityEngineState, TrafficStatus } from './MobilityTypes';

const generateSparkline = (length = 20) => Array.from({ length }, () => 40 + Math.random() * 60);

const initialEngineState: MobilityEngineState = {
  metrics: {
    metroHealth: 94,
    busCapacity: 82,
    parkingOccupancy: 88,
    trafficLoad: 65,
    emergencyRoutes: 'CLEAR',
    vipRoutes: 'CLEAR',
    averageETA: '14m',
    congestionIndex: 4.2,
    predictedDelay: '2m',
    networkAvailability: 99.9,
    fleetReadiness: 91,
    signalHealth: 98,
  },
  sidebarData: {
    metro: {
      status: 'NOMINAL',
      progress: 94,
      trend: 'neutral',
      capacity: 60,
      health: 94,
      sparkline: generateSparkline(),
    },
    bus: {
      status: 'NOMINAL',
      progress: 82,
      trend: 'up',
      capacity: 82,
      health: 82,
      sparkline: generateSparkline(),
    },
    road: {
      status: 'NOMINAL',
      progress: 65,
      trend: 'up',
      capacity: 65,
      health: 90,
      sparkline: generateSparkline(),
    },
    parking: {
      status: 'NOMINAL',
      progress: 88,
      trend: 'up',
      capacity: 88,
      health: 95,
      sparkline: generateSparkline(),
    },
    rideShare: {
      status: 'NOMINAL',
      progress: 75,
      trend: 'neutral',
      capacity: 75,
      health: 88,
      sparkline: generateSparkline(),
    },
    emergency: {
      status: 'NOMINAL',
      progress: 100,
      trend: 'neutral',
      capacity: 20,
      health: 100,
      sparkline: generateSparkline(),
    },
    accessibility: {
      status: 'NOMINAL',
      progress: 95,
      trend: 'neutral',
      capacity: 50,
      health: 95,
      sparkline: generateSparkline(),
    },
  },
  activeAlerts: [],
  copilotReasoning: [
    {
      id: '1',
      observation: 'Traffic Load steadily increasing on I-95 corridor.',
      reasoning: 'Correlates with end of stadium event and scheduled road work on Exit 14.',
      prediction: 'Gridlock likely within 15 minutes if no diversion is implemented.',
      recommendation:
        'Divert VIP convoy to secondary arterial route and increase signal green time by 12s.',
      expectedImpact: 'Prevents 15m delay for VIP and normalizes I-95 egress.',
      confidence: 94,
      timestamp: Date.now(),
    },
  ],
  predictions: {
    m15: {
      id: 'p15',
      timeframe: '+15m',
      predictedCongestion: {},
      confidence: 85,
      aiRecommendation: 'Open express lanes.',
    },
    m30: {
      id: 'p30',
      timeframe: '+30m',
      predictedCongestion: {},
      confidence: 75,
      aiRecommendation: 'Deploy additional buses to sector 4.',
    },
    m60: {
      id: 'p60',
      timeframe: '+60m',
      predictedCongestion: {},
      confidence: 65,
      aiRecommendation: 'Prepare for shift change.',
    },
  },
  missions: [
    {
      id: 'M-782',
      title: 'Metro Overflow Diversion',
      priority: 'CRITICAL',
      commander: 'AI Copilot',
      departments: ['Metro', 'Bus', 'Police'],
      eta: '12m',
      progress: 40,
      recovery: 'On Time',
      confidence: 94,
      health: 'NOMINAL',
      status: 'ACTIVE',
    },
    {
      id: 'M-783',
      title: 'VIP Convoy Route Alpha',
      priority: 'HIGH',
      commander: 'Traffic Cmd',
      departments: ['Traffic', 'Police'],
      eta: '25m',
      progress: 10,
      recovery: 'N/A',
      confidence: 99,
      health: 'NOMINAL',
      status: 'ACTIVE',
    },
  ],
  dispatchResources: [
    {
      id: 'R-101',
      name: 'Metro Team Alpha',
      type: 'Metro',
      availability: 'AVAILABLE',
      distance: '1.2km',
      eta: '4m',
      crew: '4',
      fuel: 100,
      capacity: 100,
      currentAssignment: 'None',
    },
    {
      id: 'R-204',
      name: 'Shuttle Fleet 4',
      type: 'Bus',
      availability: 'DISPATCHED',
      distance: '3.5km',
      eta: '12m',
      crew: '12',
      fuel: 82,
      capacity: 600,
      currentAssignment: 'M-782',
    },
    {
      id: 'R-305',
      name: 'Traffic Unit 7',
      type: 'Police',
      availability: 'AVAILABLE',
      distance: '0.8km',
      eta: '2m',
      crew: '2',
      fuel: 95,
      capacity: 0,
      currentAssignment: 'None',
    },
  ],
  whatIfScenarios: [
    {
      id: 'W-1',
      title: 'Open Overflow Parking',
      action: 'Divert traffic to Zone C',
      predictedTravelTime: '-15m',
      predictedCongestion: 'Reduced by 40%',
      predictedRecoveryTime: '20m',
      resourceCost: 'Medium',
      passengerDelay: '-12m',
      networkHealth: 95,
      confidence: 92,
    },
    {
      id: 'W-2',
      title: 'Close Arterial Road',
      action: 'Lock down 4th Ave',
      predictedTravelTime: '+25m',
      predictedCongestion: 'Gridlock likely',
      predictedRecoveryTime: '1h 20m',
      resourceCost: 'High',
      passengerDelay: '+45m',
      networkHealth: 45,
      confidence: 98,
    },
  ],
  operationalMemory: [
    {
      id: 'OM-1',
      event: 'Post-Concert Gridlock 2025',
      similarity: 94,
      historicalOutcome: 'Severe delay in Sector 4',
      recoveryTime: '1h 45m',
      executiveNotes: 'Shuttles were deployed too late. Pre-deploy next time.',
      successRate: 40,
      previousActions: ['Deployed Shuttles', 'Extended Metro Hours'],
    },
    {
      id: 'OM-2',
      event: 'Stadium Shift Change 2026',
      similarity: 88,
      historicalOutcome: 'Smooth transition',
      recoveryTime: '30m',
      executiveNotes: 'Traffic signal override worked perfectly.',
      successRate: 95,
      previousActions: ['Signal Override', 'VIP Diversion'],
    },
  ],
  operators: [
    {
      id: 'OP-1',
      name: 'Sarah Chen',
      role: 'Traffic Commander',
      avatar: 'SC',
      activeMission: 'M-783',
      mode: 'COMMAND',
    },
    {
      id: 'OP-2',
      name: 'Marcus Fox',
      role: 'Metro Director',
      avatar: 'MF',
      activeMission: 'M-782',
      mode: 'FOLLOW',
    },
    {
      id: 'OP-3',
      name: 'Elena Rostova',
      role: 'Operations Chief',
      avatar: 'ER',
      activeMission: 'None',
      mode: 'WATCH',
    },
  ],
  vehicles: Array.from({ length: 150 }, (_, i) => ({
    id: `v${i}`,
    type: i % 10 === 0 ? 'EMERGENCY' : i % 5 === 0 ? 'BUS' : 'ROAD',
    x: 100 + Math.random() * 800,
    y: 100 + Math.random() * 600,
    rotation: Math.random() * 360,
    speed: 0.5 + Math.random() * 2,
    status: 'NOMINAL' as TrafficStatus,
  })),
  tick: 0,
};

export function useMobilityEngine() {
  const [engineState, setEngineState] = useState<MobilityEngineState>(initialEngineState);
  const requestRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    lastUpdateRef.current = Date.now();

    const updateEngine = () => {
      const now = Date.now();
      const dt = now - lastUpdateRef.current;

      if (dt > 1000) {
        // Every 1 second for react state updates
        setEngineState((prev) => {
          // Mutate values slightly to simulate living data
          const jitter = () => (Math.random() - 0.5) * 2;

          const newSidebarData = { ...prev.sidebarData };
          (Object.keys(newSidebarData) as Array<keyof typeof newSidebarData>).forEach((key) => {
            const v = newSidebarData[key];
            const newVal = Math.max(0, Math.min(100, v.capacity + jitter()));
            newSidebarData[key] = {
              ...v,
              capacity: newVal,
              progress: newVal,
              sparkline: [...v.sparkline.slice(1), newVal],
            };
          });

          return {
            ...prev,
            metrics: {
              ...prev.metrics,
              metroHealth: Math.max(0, Math.min(100, prev.metrics.metroHealth + jitter())),
              busCapacity: Math.max(0, Math.min(100, prev.metrics.busCapacity + jitter())),
              parkingOccupancy: Math.max(
                0,
                Math.min(100, prev.metrics.parkingOccupancy + jitter())
              ),
              trafficLoad: Math.max(0, Math.min(100, prev.metrics.trafficLoad + jitter())),
              congestionIndex: Math.max(
                0,
                Math.min(10, prev.metrics.congestionIndex + jitter() * 0.1)
              ),
            },
            sidebarData: newSidebarData,
            tick: prev.tick + 1,
          };
        });
        lastUpdateRef.current = now;
      }

      requestRef.current = requestAnimationFrame(updateEngine);
    };

    requestRef.current = requestAnimationFrame(updateEngine);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return engineState;
}
