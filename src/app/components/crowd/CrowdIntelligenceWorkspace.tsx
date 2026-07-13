'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AiCrowdBriefing } from './widgets/AiCrowdBriefing';
import { InteractiveCrowdHeatmap } from './widgets/InteractiveCrowdHeatmap';
import { ZoneIntelligencePanel } from './widgets/ZoneIntelligencePanel';
import { DensityAnalytics } from './widgets/DensityAnalytics';
import { QueueIntelligence } from './widgets/QueueIntelligence';
import { AiRiskPrediction } from './widgets/AiRiskPrediction';
import { AiCrowdRecommendations } from './widgets/AiCrowdRecommendations';
import { CrowdActivityTimeline } from './widgets/CrowdActivityTimeline';
import { CrowdPersistentCopilot } from './widgets/CrowdPersistentCopilot';

export interface CrowdMatchPayload {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  currentPhase: string;
  stadium: { name: string; capacity: number; zones: any[] };
  queueData: any[];
  phaseTransitions: any[];
  aiRecommendations: any[]; // specifically filtered for crowd_recommendations
  incidents: any[];
  kpiSnapshots: any[];
  healthScores: any[];
}

export function CrowdIntelligenceWorkspace({ matchData }: { matchData: CrowdMatchPayload }) {
  const shouldReduceMotion = useReducedMotion();

  // Determine highest risk zone based on density
  let highestRiskZone: any = null;
  let maxDensity = 0;

  matchData.stadium.zones.forEach((zone) => {
    if (zone.crowdData && zone.crowdData.length > 0) {
      const density = Number(zone.crowdData[0].densityPct);
      if (density > maxDensity) {
        maxDensity = density;
        highestRiskZone = zone;
      }
    }
  });

  // Extract the highest priority recommendation
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
      {/* Section 1: AI Crowd Briefing (Hero) spans top 12 cols */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <AiCrowdBriefing
          stadiumName={matchData.stadium.name}
          currentPhase={matchData.currentPhase}
          highestRiskZone={highestRiskZone}
          maxDensity={maxDensity}
          primaryRecommendation={primaryRecommendation}
        />
      </motion.div>

      {/* Section 2: Interactive Crowd Heatmap */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        style={{ gridColumn: 'span 8' }}
      >
        <InteractiveCrowdHeatmap zones={matchData.stadium.zones} />
      </motion.div>

      {/* Sections 3 & 4: Zone Intelligence & Density Analytics (span 4 right col) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{
          gridColumn: 'span 4',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ flex: 1 }}>
          <ZoneIntelligencePanel zones={matchData.stadium.zones} />
        </div>
        <div>
          <DensityAnalytics kpiSnapshots={matchData.kpiSnapshots} />
        </div>
      </motion.div>

      {/* Section 5 & 6: Queue & Risk Prediction (Span 6 each next row) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        style={{ gridColumn: 'span 6' }}
      >
        <QueueIntelligence queueData={matchData.queueData} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 6' }}
      >
        <AiRiskPrediction currentPhase={matchData.currentPhase} incidents={matchData.incidents} />
      </motion.div>

      {/* Section 7 & 8: Recommendations & Activity Log (Span 6 each next row) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        style={{ gridColumn: 'span 6' }}
      >
        <AiCrowdRecommendations recommendations={matchData.aiRecommendations} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
        style={{ gridColumn: 'span 6' }}
      >
        <CrowdActivityTimeline incidents={matchData.incidents} />
      </motion.div>

      {/* Section 9: Persistent Copilot */}
      <CrowdPersistentCopilot
        scenarioContext={{
          stadiumName: matchData.stadium.name,
          phase: matchData.currentPhase,
          maxDensity: maxDensity,
          highestRiskZoneName: highestRiskZone ? highestRiskZone.name : 'None',
        }}
      />
    </main>
  );
}
