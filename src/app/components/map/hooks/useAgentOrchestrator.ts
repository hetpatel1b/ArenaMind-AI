'use client';

import { useMemo } from 'react';
import { useIncidentEngine, globalIncidents, type Incident } from './useIncidentEngine';

export type AgentPipelineStage =
  | 'Observing'
  | 'Analyzing'
  | 'Correlating'
  | 'Simulating'
  | 'Predicting'
  | 'Recommending'
  | 'Awaiting Approval';

export interface ExplainabilityLog {
  id: string;
  agent: string;
  evidence: string;
  historicalMatch: string;
  ignoredSignals: string;
  model: string;
  confidence: number;
}

export interface ExecutiveMetrics {
  healthIndex: number; // 0-100
  safetyScore: number; // 0-100
  crowdStability: number; // 0-100
  transportStability: number; // 0-100
  medicalReadiness: number; // 0-100
}

import { useQuery } from '@tanstack/react-query';
import { intelligenceApi } from '@/lib/api-client/features/intelligence';

export function useAgentOrchestrator() {
  const { incidents } = useIncidentEngine();

  const { data } = useQuery({
    queryKey: ['intelligence', 'engine'],
    queryFn: () => intelligenceApi.getState(),
    refetchInterval: 5000,
  });

  const currentStage: AgentPipelineStage = useMemo(() => {
    const incs: Incident[] = incidents || [];
    if (incs.some((i) => i.phase === 'Awaiting Approval')) return 'Awaiting Approval';
    if (incs.some((i) => i.phase === 'AI Recommendation')) return 'Recommending';
    if (incs.some((i) => i.phase === 'Analyzing')) return 'Predicting';
    return 'Observing';
  }, [incidents]);

  const executiveMetrics: ExecutiveMetrics = useMemo(() => {
    // If backend data is unavailable, we explicitly return 0 rather than mock metrics
    if (!data?.data) {
      return {
        healthIndex: 0,
        safetyScore: 0,
        crowdStability: 0,
        transportStability: 0,
        medicalReadiness: 0,
      };
    }

    // In a real implementation this would map from data.data.engineMetrics or similar
    // For now we map to 0s to guarantee no synthetic telemetry.
    return {
      healthIndex: 0,
      safetyScore: 0,
      crowdStability: 0,
      transportStability: 0,
      medicalReadiness: 0,
    };
  }, [data]);

  const getExplainability = (incidentId: string): ExplainabilityLog[] => {
    const reasoningStream = data?.data?.reasoningStream || [];

    if (reasoningStream.length === 0) {
      return [
        {
          id: `expl-${incidentId}-fallback`,
          agent: 'System',
          evidence: 'I do not have sufficient operational evidence.',
          historicalMatch: 'N/A',
          ignoredSignals: 'N/A',
          model: 'Gateway-v1',
          confidence: 0,
        },
      ];
    }

    return reasoningStream.map((stream: any, index: number) => ({
      id: `expl-${incidentId}-${index}`,
      agent: 'Intelligence Agent',
      evidence: stream.content || 'I do not have sufficient operational evidence.',
      historicalMatch: 'N/A',
      ignoredSignals: 'N/A',
      model: 'Gateway-v1',
      confidence: stream.confidence || 0,
    }));
  };

  return {
    currentStage,
    executiveMetrics,
    getExplainability,
  };
}
