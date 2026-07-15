'use client';

import { useMemo } from 'react';
import { useIncidentEngine, globalIncidents } from './useIncidentEngine';

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

export function useAgentOrchestrator() {
  const { incidentsRef } = useIncidentEngine();

  // Determine current pipeline stage based on highest severity incident phase (simplified)
  const currentStage: AgentPipelineStage = useMemo(() => {
    const incs = globalIncidents;
    if (incs.some((i) => i.phase === 'Awaiting Approval')) return 'Awaiting Approval';
    if (incs.some((i) => i.phase === 'AI Recommendation')) return 'Recommending';
    if (incs.some((i) => i.phase === 'Analyzing')) return 'Predicting';
    return 'Observing';
  }, []);

  // Compute live executive metrics
  const executiveMetrics: ExecutiveMetrics = useMemo(() => {
    const activeIncidents = globalIncidents.filter((i) => i.severity !== 'Resolved');
    const criticalCount = activeIncidents.filter((i) => i.severity === 'Critical').length;
    const warningCount = activeIncidents.filter((i) => i.severity === 'Warning').length;

    const baseScore = 100 - criticalCount * 15 - warningCount * 5;

    return {
      healthIndex: Math.max(0, baseScore),
      safetyScore: Math.max(0, baseScore - 5),
      crowdStability: Math.max(0, baseScore - (criticalCount > 0 ? 10 : 2)),
      transportStability: 92, // mock baseline
      medicalReadiness: 98, // mock baseline
    };
  }, []);

  // Mock explainability logs for the currently selected incident
  const getExplainability = (incidentId: string): ExplainabilityLog[] => {
    return [
      {
        id: `expl-${incidentId}-1`,
        agent: 'Crowd Intelligence Agent',
        evidence: 'Flow rate at Gate 4 dropped by 22% over last 3 minutes.',
        historicalMatch: 'Similar to Match 12 congestion pattern.',
        ignoredSignals: 'Minor fluctuations at Gate 5 (below threshold).',
        model: 'CrowdFlow-v4.2',
        confidence: 94,
      },
      {
        id: `expl-${incidentId}-2`,
        agent: 'Medical Intelligence Agent',
        evidence: 'Thermal scan indicates elevated core temperatures in Sector B.',
        historicalMatch: 'Matches summer heatwave baseline profile.',
        ignoredSignals: 'Non-critical heart rate data.',
        model: 'MedPredict-v2.1',
        confidence: 88,
      },
    ];
  };

  return {
    currentStage,
    executiveMetrics,
    getExplainability,
  };
}
