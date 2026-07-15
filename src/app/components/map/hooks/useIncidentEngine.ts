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

// Global store
export const globalIncidents: Incident[] = [
  {
    id: 'INC-2948',
    category: 'Crowd Congestion',
    phase: 'Awaiting Approval',
    severity: 'Warning',
    x: 400,
    y: 200,
    zone: 'Gate A',
    confidence: 94,
    detectedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    assignedResources: [],
    radius: 40,
    recommendations: [
      {
        id: 'REC-1',
        action: 'Deploy Security Team',
        confidence: 92,
        impact: 'High',
        eta: '3m',
        requiresApproval: true,
      },
      {
        id: 'REC-2',
        action: 'Open Emergency Exit 2',
        confidence: 85,
        impact: 'Medium',
        eta: 'Immediate',
        requiresApproval: true,
      },
      {
        id: 'REC-3',
        action: 'Create Crowd Diversion',
        confidence: 78,
        impact: 'Low',
        eta: '5m',
        requiresApproval: false,
      },
    ],
  },
  {
    id: 'INC-9932',
    category: 'Medical Emergency',
    phase: 'Analyzing',
    severity: 'Critical',
    x: 750,
    y: 600,
    zone: 'South Concourse',
    confidence: 99,
    detectedAt: new Date(Date.now() - 1000 * 60 * 1), // 1 min ago
    assignedResources: [],
    radius: 80,
    recommendations: [
      {
        id: 'REC-4',
        action: 'Dispatch Med-Evac Cart',
        confidence: 98,
        impact: 'Critical',
        eta: '1m',
        requiresApproval: true,
      },
      {
        id: 'REC-5',
        action: 'Clear Path Sector 4',
        confidence: 95,
        impact: 'High',
        eta: 'Immediate',
        requiresApproval: true,
      },
    ],
  },
];

export function useIncidentEngine() {
  const incidentsRef = useRef<Incident[]>(globalIncidents);

  useEffect(() => {
    let animationId: number;
    let lastTick = performance.now();

    const simulate = (time: number) => {
      // Run slower simulation loop (e.g. every 1 second)
      if (time - lastTick > 1000) {
        lastTick = time;

        // Randomly progress phases (very slow)
        incidentsRef.current.forEach((inc) => {
          if (inc.phase === 'Detected' && Math.random() > 0.8) inc.phase = 'Verified';
          else if (inc.phase === 'Verified' && Math.random() > 0.8) inc.phase = 'Analyzing';
          else if (inc.phase === 'Analyzing' && Math.random() > 0.8)
            inc.phase = 'AI Recommendation';
          else if (inc.phase === 'AI Recommendation' && Math.random() > 0.5)
            inc.phase = 'Awaiting Approval';
          // After resources assigned, we move to Contained, etc. (handled in UI actions usually, but we simulate some)
          else if (inc.phase === 'Resources Assigned' && Math.random() > 0.9)
            inc.phase = 'Contained';
          else if (inc.phase === 'Contained' && Math.random() > 0.9) {
            inc.phase = 'Resolved';
            inc.severity = 'Resolved';
            inc.resolvedAt = new Date();
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
