'use client';

import { useEffect, useRef } from 'react';

export type IncidentCategory =
  | 'Crowd Congestion'
  | 'Medical Emergency'
  | 'Security Threat'
  | 'Fire Alarm'
  | 'Suspicious Object'
  | 'Lost Child'
  | 'VIP Escort Issue'
  | 'Transport Delay'
  | 'Equipment Failure'
  | 'Power Outage'
  | 'Weather Alert'
  | 'Communication Failure';

export type IncidentPhase =
  | 'Detected'
  | 'Verified'
  | 'Analyzing'
  | 'AI Recommendation'
  | 'Awaiting Approval'
  | 'Resources Assigned'
  | 'Contained'
  | 'Resolved';

export type IncidentSeverity = 'Critical' | 'Warning' | 'Information' | 'Resolved';

export interface AIRecommendation {
  id: string;
  action: string;
  confidence: number;
  impact: string;
  eta: string;
  requiresApproval: boolean;
}

export interface Incident {
  id: string;
  category: IncidentCategory;
  phase: IncidentPhase;
  severity: IncidentSeverity;
  x: number;
  y: number;
  zone: string;
  confidence: number;
  detectedAt: Date;
  resolvedAt?: Date;
  assignedResources: string[];
  recommendations: AIRecommendation[];
  radius: number; // impact radius
}

import { DemoState } from '@/lib/demo/DemoState';
import { useDemoState } from '@/lib/demo/useDemoState';
import { useMemo } from 'react';

export function useIncidentEngine() {
  const demoState = useDemoState();

  // Re-map globalIncidents dynamically when demoState changes
  const mappedIncidents: Incident[] = useMemo(
    () =>
      demoState.incidents.map((inc, i) => ({
        id: inc.id,
        category:
          inc.type === 'Medical'
            ? 'Medical Emergency'
            : inc.type === 'Security'
              ? 'Security Threat'
              : inc.type === 'Crowd Control'
                ? 'Crowd Congestion'
                : 'Lost Child',
        phase: inc.status === 'resolved' ? 'Resolved' : 'Analyzing',
        severity:
          inc.severity === 'critical'
            ? 'Critical'
            : inc.severity === 'high'
              ? 'Warning'
              : 'Information',
        x: i === 0 ? 400 : i === 1 ? 750 : 200,
        y: i === 0 ? 200 : i === 1 ? 600 : 300,
        zone: inc.location,
        confidence: 95,
        detectedAt: new Date(),
        assignedResources: inc.status === 'resolved' ? ['Med-1'] : [],
        radius: inc.type === 'Medical' ? 80 : 40,
        recommendations:
          inc.status === 'resolved'
            ? []
            : [
                {
                  id: `REC-${inc.id}-1`,
                  action: demoState.copilot.recommendations[0] || 'Dispatch Team',
                  confidence: 94,
                  impact: 'High',
                  eta: '3m',
                  requiresApproval: true,
                },
              ],
      })),
    [demoState.incidents, demoState.copilot.recommendations]
  );

  const incidentsRef = useRef<Incident[]>(mappedIncidents);

  // Keep ref up to date for the simulation loop
  useEffect(() => {
    incidentsRef.current = mappedIncidents;
  }, [mappedIncidents]);

  useEffect(() => {
    let animationId: number;
    let lastTick = performance.now();
    let tickCount = 0;

    const simulate = (time: number) => {
      // Deterministic loop for simulation
      if (time - lastTick > 1000) {
        lastTick = time;
        tickCount++;

        incidentsRef.current.forEach((inc) => {
          // Deterministic phase progression every 5 seconds for active incidents
          if (inc.phase !== 'Resolved' && tickCount % 5 === 0) {
            if (inc.phase === 'Detected') inc.phase = 'Verified';
            else if (inc.phase === 'Verified') inc.phase = 'Analyzing';
            else if (inc.phase === 'Analyzing') inc.phase = 'AI Recommendation';
            else if (inc.phase === 'AI Recommendation') inc.phase = 'Awaiting Approval';
          }
        });
      }

      animationId = requestAnimationFrame(simulate);
    };

    animationId = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return { incidentsRef };
}

// Keep export for non-React files that might import it, although it won't be perfectly reactive there.
// Components should use the hook.
export const globalIncidents = DemoState.incidents.map((inc, i) => ({
  id: inc.id,
  category:
    inc.type === 'Medical'
      ? 'Medical Emergency'
      : inc.type === 'Security'
        ? 'Security Threat'
        : inc.type === 'Crowd Control'
          ? 'Crowd Congestion'
          : 'Lost Child',
  phase: inc.status === 'resolved' ? 'Resolved' : 'Analyzing',
  severity:
    inc.severity === 'critical' ? 'Critical' : inc.severity === 'high' ? 'Warning' : 'Information',
  x: i === 0 ? 400 : i === 1 ? 750 : 200,
  y: i === 0 ? 200 : i === 1 ? 600 : 300,
  zone: inc.location,
  confidence: 95,
  detectedAt: new Date(),
  assignedResources: inc.status === 'resolved' ? ['Med-1'] : [],
  radius: inc.type === 'Medical' ? 80 : 40,
  recommendations:
    inc.status === 'resolved'
      ? []
      : [
          {
            id: `REC-${inc.id}-1`,
            action: DemoState.copilot.recommendations[0] || 'Dispatch Team',
            confidence: 94,
            impact: 'High',
            eta: '3m',
            requiresApproval: true,
          },
        ],
}));
