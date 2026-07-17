'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AiExecutiveSummary } from './widgets/AiExecutiveSummary';
import { OperationalKpiOverview } from './widgets/OperationalKpiOverview';
import { InteractiveMatchTimeline } from './widgets/InteractiveMatchTimeline';
import { PerformanceAnalytics } from './widgets/PerformanceAnalytics';
import { AiRootCauseAnalysis } from './widgets/AiRootCauseAnalysis';
import { FutureRecommendations } from './widgets/FutureRecommendations';
import { ExportCenter } from './widgets/ExportCenter';
import { IntelligencePersistentCopilot } from './widgets/IntelligencePersistentCopilot';

export interface IntelligenceMatchPayload {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  currentPhase: string;
  venue: { name: string; capacity: number };
  incidents: any[];
  phaseTransitions: any[];
  aiRecommendations: any[];
  kpiSnapshots?: any[];
}

export interface ReportingPayload {
  attendance: number;
  operationalHealth: number;
  incidentSummary: { total: number; resolved: number; avgResponseTime: string };
  crowdFlow: string;
  transportStatus: string;
  kpis: {
    responseEfficiency: number;
    crowdEfficiency: number;
    transportEfficiency: number;
    workforceUtilization: number;
    accessibilityScore: number;
    aiAcceptance: number;
  };
}

interface IntelligenceCommandWorkspaceProps {
  matchData: IntelligenceMatchPayload;
  reportingPayload: ReportingPayload;
}

export function IntelligenceCommandWorkspace({
  matchData,
  reportingPayload,
}: IntelligenceCommandWorkspaceProps) {
  const shouldReduceMotion = useReducedMotion();

  // Extract the highest priority recommendation specifically flagged as an intelligence insight
  const primaryRecommendation =
    matchData.aiRecommendations.length > 0 ? matchData.aiRecommendations[0] : null;

  return (
    <main
      className="dashboard-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        gap: 'var(--space-4)',
        padding: 'var(--space-6)',
        width: '100%',
        maxWidth: '1800px',
        margin: '0 auto',
      }}
    >
      {/* Section 1: AI Executive Summary (Hero) spans top 12 cols */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <AiExecutiveSummary
          matchData={matchData}
          reportingPayload={reportingPayload}
          primaryRecommendation={primaryRecommendation}
        />
      </motion.div>

      {/* Section 2 & 3: KPI Overview and Match Timeline (Span 4 and 8) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <OperationalKpiOverview reportingPayload={reportingPayload} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{ gridColumn: 'span 8' }}
      >
        <InteractiveMatchTimeline
          phaseTransitions={matchData.phaseTransitions}
          incidents={matchData.incidents}
        />
      </motion.div>

      {/* Sections 4, 5, 6: Analytics (Span 4), Root Cause (Span 4), Future Recs (Span 4) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <PerformanceAnalytics kpiSnapshots={matchData.kpiSnapshots || []} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <AiRootCauseAnalysis matchId={matchData.id} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <FutureRecommendations
          matchId={matchData.id}
          initialRecommendations={matchData.aiRecommendations}
        />
      </motion.div>

      {/* Section 7: Export Center (Span 12) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <ExportCenter />
      </motion.div>

      {/* Section 8: Persistent Copilot */}
      <IntelligencePersistentCopilot matchId={matchData.id} />
    </main>
  );
}
