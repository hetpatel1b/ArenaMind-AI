'use client';

import { useEffect, useRef } from 'react';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';
import {
  DepartmentType,
  PersonnelStatus,
  ShiftStatus,
  ReadinessLevel,
  Unit,
  TimelineEvent,
  ReasoningStep,
  Notification,
} from './WorkforceTypes';

const MOCK_UNITS: Unit[] = [
  {
    id: '1',
    name: 'Alpha Squad',
    department: DepartmentType.SECURITY,
    commander: 'J. Smith',
    status: PersonnelStatus.DEPLOYED,
    shift: ShiftStatus.ACTIVE,
    fatigueRisk: 12,
    readiness: ReadinessLevel.OPTIMAL,
    personnelCount: 42,
    certifications: [],
    trend: [80, 85, 90, 85, 95, 98],
    location: { x: 200, y: 150 },
  },
  {
    id: '2',
    name: 'Med Evac 1',
    department: DepartmentType.MEDICAL,
    commander: 'Dr. A. Chen',
    status: PersonnelStatus.AVAILABLE,
    shift: ShiftStatus.ACTIVE,
    fatigueRisk: 5,
    readiness: ReadinessLevel.OPTIMAL,
    personnelCount: 12,
    certifications: [],
    trend: [100, 100, 100, 100, 100, 100],
    location: { x: 300, y: 250 },
  },
  {
    id: '3',
    name: 'Traffic Control',
    department: DepartmentType.TRAFFIC,
    commander: 'M. Johnson',
    status: PersonnelStatus.IN_TRANSIT,
    shift: ShiftStatus.UPCOMING,
    fatigueRisk: 0,
    readiness: ReadinessLevel.STABLE,
    personnelCount: 24,
    certifications: [],
    trend: [95, 95, 95, 90, 95, 95],
    location: { x: 400, y: 350 },
  },
  {
    id: '4',
    name: 'Fire Engine 4',
    department: DepartmentType.FIRE,
    commander: 'Capt. R. Davis',
    status: PersonnelStatus.DEPLOYED,
    shift: ShiftStatus.ACTIVE,
    fatigueRisk: 25,
    readiness: ReadinessLevel.OPTIMAL,
    personnelCount: 8,
    certifications: [],
    trend: [100, 98, 95, 99, 100, 100],
    location: { x: 500, y: 150 },
  },
  {
    id: '5',
    name: 'VIP Escort',
    department: DepartmentType.VIP_SECURITY,
    commander: 'S. Williams',
    status: PersonnelStatus.DEPLOYED,
    shift: ShiftStatus.ACTIVE,
    fatigueRisk: 40,
    readiness: ReadinessLevel.STABLE,
    personnelCount: 16,
    certifications: [],
    trend: [90, 85, 80, 75, 80, 85],
    location: { x: 600, y: 450 },
  },
];

const INITIAL_REASONING: ReasoningStep[] = [
  {
    id: 'r1',
    phase: 'Observation',
    content: 'Crowd density increasing in Sector 4.',
    confidence: 95,
  },
  {
    id: 'r2',
    phase: 'Correlation',
    content: 'Matches historical egress patterns for Match Phase 3.',
    confidence: 88,
  },
];

export function useWorkforceEngine() {
  const { state, dispatch } = useWorkforceWorkspace();
  const engineRef = useRef<{ tickCount: number; initialized: boolean }>({
    tickCount: 0,
    initialized: false,
  });

  useEffect(() => {
    if (engineRef.current.initialized) return;
    engineRef.current.initialized = true;

    // Initial injection
    dispatch({
      type: 'ENGINE_TICK',
      payload: {
        units: MOCK_UNITS,
        timelineEvents: [
          {
            id: 't1',
            timestamp: '-2h',
            label: 'Alpha Squad Deployed',
            type: 'deployment',
            positionPct: 20,
          },
          {
            id: 't2',
            timestamp: '-1h',
            label: 'Traffic Shift Start',
            type: 'shift',
            positionPct: 40,
          },
          {
            id: 't3',
            timestamp: '+30m',
            label: 'Med Evac 1 Break',
            type: 'break',
            positionPct: 75,
          },
        ],
        reasoningStream: INITIAL_REASONING,
        notifications: [
          {
            id: 'n1',
            type: 'info',
            title: 'Shift Change',
            message: 'Traffic Control shift starting in 45m',
          },
        ],
      },
    });

    const interval = setInterval(() => {
      engineRef.current.tickCount++;
      const tick = engineRef.current.tickCount;

      // Simulate metric fluctuations
      const newMetrics = { ...state.metrics };
      newMetrics.deploymentPct = Math.max(
        80,
        Math.min(100, newMetrics.deploymentPct + (Math.random() * 2 - 1))
      );
      newMetrics.avgResponseMins = Math.max(
        1,
        newMetrics.avgResponseMins + (Math.random() * 0.4 - 0.2)
      );

      // Simulate unit fatigue increases
      const updatedUnits = (state.units.length > 0 ? state.units : MOCK_UNITS).map((u) => ({
        ...u,
        fatigueRisk:
          u.status === PersonnelStatus.DEPLOYED
            ? Math.min(100, u.fatigueRisk + Math.random() * 0.5)
            : Math.max(0, u.fatigueRisk - 1),
        trend: [...u.trend.slice(1), 100 - u.fatigueRisk],
      }));

      const payload: any = {
        metrics: newMetrics,
        units: updatedUnits,
      };

      // Add a notification occasionally
      if (tick % 15 === 0) {
        payload.notifications = [
          ...(state.notifications || []),
          {
            id: `notif-${tick}`,
            type: 'warning',
            title: 'Fatigue Alert',
            message: 'VIP Escort fatigue exceeding stable limits.',
          },
        ].slice(-3);
      }

      // Add reasoning occasionally
      if (tick % 10 === 0) {
        payload.reasoningStream = [
          ...(state.reasoningStream || []),
          {
            id: `rs-${tick}`,
            phase: 'Recommendation',
            content: 'Rotate VIP Escort with Reserve Unit B.',
            confidence: 92,
          },
        ].slice(-5);
      }

      dispatch({ type: 'ENGINE_TICK', payload });
    }, 1000); // 1Hz throttle for React state

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // We omit `state` intentionally to avoid restarting the interval on every tick.
}
