'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AiWorkforceBriefing } from './widgets/AiWorkforceBriefing';
import { OperationalCapacityOverview } from './widgets/OperationalCapacityOverview';
import { InteractiveWorkforceMap } from './widgets/InteractiveWorkforceMap';
import { TeamStatusBoard } from './widgets/TeamStatusBoard';
import { ResourceAllocationPanel } from './widgets/ResourceAllocationPanel';
import { AvailabilityForecast } from './widgets/AvailabilityForecast';
import { AiOptimizationRecommendations } from './widgets/AiOptimizationRecommendations';
import { ShiftTimeline } from './widgets/ShiftTimeline';
import { WorkforcePersistentCopilot } from './widgets/WorkforcePersistentCopilot';

export interface WorkforceMatchPayload {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  currentPhase: string;
  stadium: { name: string; capacity: number; zones: any[] };
  resources: any[];
  aiRecommendations: any[]; // specifically filtered for resource_suggestions
  phaseTransitions: any[];
}

export function WorkforceCommandWorkspace({ matchData }: { matchData: WorkforceMatchPayload }) {
  const shouldReduceMotion = useReducedMotion();

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
      {/* Section 1: AI Workforce Briefing (Hero) spans top 12 cols */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <AiWorkforceBriefing
          stadiumName={matchData.stadium.name}
          currentPhase={matchData.currentPhase}
          resources={matchData.resources}
          primaryRecommendation={primaryRecommendation}
        />
      </motion.div>

      {/* Section 2 & 3: Overview and Map (Span 4 and 8) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <OperationalCapacityOverview resources={matchData.resources} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{ gridColumn: 'span 8' }}
      >
        <InteractiveWorkforceMap zones={matchData.stadium.zones} resources={matchData.resources} />
      </motion.div>

      {/* Sections 4, 5, 6: Team Status (Span 6), Allocation (Span 3), Forecast (Span 3) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        style={{ gridColumn: 'span 6' }}
      >
        <TeamStatusBoard resources={matchData.resources} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 3' }}
      >
        <ResourceAllocationPanel resources={matchData.resources} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        style={{ gridColumn: 'span 3' }}
      >
        <AvailabilityForecast resources={matchData.resources} />
      </motion.div>

      {/* Sections 7 & 8: Recommendations (Span 8) and Timeline (Span 4) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
        style={{ gridColumn: 'span 8' }}
      >
        <AiOptimizationRecommendations recommendations={matchData.aiRecommendations} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <ShiftTimeline phaseTransitions={matchData.phaseTransitions} />
      </motion.div>

      {/* Section 9: Persistent Copilot */}
      <WorkforcePersistentCopilot />
    </main>
  );
}
