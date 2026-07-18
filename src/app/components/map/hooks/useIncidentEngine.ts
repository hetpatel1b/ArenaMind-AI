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

import { useQuery } from '@tanstack/react-query';
import { incidentApi } from '@/lib/api-client/features/incident';

import { useMemo } from 'react';

export function useIncidentEngine() {
  const matchId = '123e4567-e89b-12d3-a456-426614174000'; // Default match id for now

  const { data, isLoading, isError } = useQuery({
    queryKey: ['incidents', matchId],
    queryFn: () => incidentApi.getState({ matchId }),
    refetchInterval: 5000,
  });

  // Map backend response or fallback to empty array safely using useMemo
  const incidents = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const incidentsRef = useRef<Incident[]>(incidents);

  useEffect(() => {
    incidentsRef.current = incidents;
  }, [incidents]);

  return { incidents, incidentsRef, isLoading, isError };
}

// Fallback for non-React files that previously imported this.
// They should be refactored to use the hook, but this prevents crashes.
export const globalIncidents: Incident[] = [];
