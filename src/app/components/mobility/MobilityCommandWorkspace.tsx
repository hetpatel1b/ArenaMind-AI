'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AiMobilityBriefing } from './widgets/AiMobilityBriefing';
import { TransportHealthOverview } from './widgets/TransportHealthOverview';
import { InteractiveMobilityMap } from './widgets/InteractiveMobilityMap';
import { TransportNetworkStatus } from './widgets/TransportNetworkStatus';
import { ParkingOperations } from './widgets/ParkingOperations';
import { ArrivalExitForecast } from './widgets/ArrivalExitForecast';
import { AccessibilityMobility } from './widgets/AccessibilityMobility';
import { AiRouteOptimization } from './widgets/AiRouteOptimization';
import { MobilityTimeline } from './widgets/MobilityTimeline';
import { MobilityPersistentCopilot } from './widgets/MobilityPersistentCopilot';

export interface MobilityMatchPayload {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  currentPhase: string;
  stadium: { name: string; capacity: number; zones: any[] };
  aiRecommendations: any[];
  phaseTransitions: any[];
}

export interface MobilityState {
  metro: { status: string; capacity: number; delay: number };
  shuttles: { status: string; capacity: number; delay: number };
  parking: { status: string; occupancy: number; overflowActive: boolean };
  accessibility: { status: string; activeRequests: number; shuttleAvailability: number };
}

interface MobilityCommandWorkspaceProps {
  matchData: MobilityMatchPayload;
  mobilityState: MobilityState;
}

export function MobilityCommandWorkspace({
  matchData,
  mobilityState,
}: MobilityCommandWorkspaceProps) {
  const shouldReduceMotion = useReducedMotion();

  // Extract the highest priority recommendation
  const primaryRecommendation =
    matchData.aiRecommendations.length > 0
      ? matchData.aiRecommendations[0]
      : {
          id: 'mock-rec-1',
          confidenceScore: 0.94,
          data: {
            suggestedAction: 'Increase metro cadence on Blue Line to 2 minutes.',
            reason: 'Post-match egress surge predicted to exceed platform capacity in 15 mins.',
            evidence: 'Historical egress models for 80,000 capacity.',
            expectedBenefit: 'Prevents platform overcrowding and safety hazards.',
            humanApprovalRequired: true,
          },
        }; // Fallback if DB doesn't have mobility_suggestions seeded

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
      {/* Section 1: AI Mobility Briefing (Hero) spans top 12 cols */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <AiMobilityBriefing
          stadiumName={matchData.stadium.name}
          currentPhase={matchData.currentPhase}
          mobilityState={mobilityState}
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
        <TransportHealthOverview mobilityState={mobilityState} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{ gridColumn: 'span 8' }}
      >
        <InteractiveMobilityMap zones={matchData.stadium.zones} />
      </motion.div>

      {/* Sections 4, 5, 6: Network Status (Span 6), Parking (Span 3), Forecast (Span 3) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        style={{ gridColumn: 'span 6' }}
      >
        <TransportNetworkStatus mobilityState={mobilityState} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 3' }}
      >
        <ParkingOperations mobilityState={mobilityState} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        style={{ gridColumn: 'span 3' }}
      >
        <ArrivalExitForecast mobilityState={mobilityState} />
      </motion.div>

      {/* Sections 11, 7, 8: Accessibility (Span 3), Route Opt (Span 5), Timeline (Span 4) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
        style={{ gridColumn: 'span 3' }}
      >
        <AccessibilityMobility mobilityState={mobilityState} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
        style={{ gridColumn: 'span 5' }}
      >
        <AiRouteOptimization recommendations={matchData.aiRecommendations} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <MobilityTimeline phaseTransitions={matchData.phaseTransitions} />
      </motion.div>

      {/* Section 9: Persistent Copilot */}
      <MobilityPersistentCopilot />
    </main>
  );
}
