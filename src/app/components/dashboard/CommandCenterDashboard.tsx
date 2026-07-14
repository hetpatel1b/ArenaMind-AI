'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AiOperationalBriefing } from './widgets/AiOperationalBriefing';
import { TournamentTimeline } from './widgets/TournamentTimeline';
import { OperationalHealthOverview } from './widgets/OperationalHealthOverview';
import { InteractiveStadiumMap } from './widgets/InteractiveStadiumMap';
import { TopAiRecommendations } from './widgets/TopAiRecommendations';
import { OperationalActivityFeed } from './widgets/OperationalActivityFeed';
import { AiCopilotWidget } from './widgets/AiCopilotWidget';

// Defining a rough shape of the heavy payload to ensure strong typing down the tree
export interface DashboardMatchPayload {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  currentPhase: string;
  stadium: { name: string; capacity: number; zones?: any[] };
  incidents: any[];
  aiRecommendations: any[];
  kpiSnapshots: any[];
  healthScores: any[];
  zones: any[];
  resources: any[];
}

export function CommandCenterDashboard({ matchData }: { matchData: DashboardMatchPayload }) {
  const shouldReduceMotion = useReducedMotion();

  // Extract the highest priority recommendation
  const primaryRecommendation =
    matchData.aiRecommendations.length > 0 ? matchData.aiRecommendations[0] : null;

  const currentHealth =
    matchData.healthScores.length > 0
      ? matchData.healthScores[0]
      : { score: 100, crowdScore: 100, incidentScore: 100, resourceScore: 100 };

  const currentKpi = matchData.kpiSnapshots.length > 0 ? matchData.kpiSnapshots[0] : null;

  // Fallback to stadium zones if top level matchData.zones is empty (based on our prisma query structure)
  const zonesToUse = matchData.zones?.length ? matchData.zones : matchData.stadium.zones || [];

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
      {/* Section 1: AI Operational Briefing (Hero) spans top 12 cols */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <AiOperationalBriefing
          stadiumName={matchData.stadium.name}
          matchTitle={`${matchData.homeTeam} vs ${matchData.awayTeam}`}
          tournamentPhase={`Match ${matchData.matchNumber}`}
          currentPhase={matchData.currentPhase}
          healthScore={currentHealth.score}
          primaryRecommendation={primaryRecommendation}
        />
      </motion.div>

      {/* Section 2: Timeline (span 12) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <TournamentTimeline currentPhase={matchData.currentPhase} />
      </motion.div>

      {/* Section 3 & 5: Operational Health Snapshot Cards (span 12) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <OperationalHealthOverview
          healthScore={currentHealth.score}
          incidentScore={currentHealth.incidentScore}
          crowdScore={currentHealth.crowdScore}
          resourceScore={currentHealth.resourceScore}
          kpiSnapshot={currentKpi}
        />
      </motion.div>

      {/* Section 4: Interactive Stadium Map (span 8) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        style={{ gridColumn: 'span 8' }}
      >
        <InteractiveStadiumMap
          zones={zonesToUse}
          incidents={matchData.incidents}
          resources={matchData.resources}
        />
      </motion.div>

      {/* Section 6 & 7: Recommendations and Activity (span 4 right col) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        style={{
          gridColumn: 'span 4',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ flex: 1 }}>
          <TopAiRecommendations recommendations={matchData.aiRecommendations} />
        </div>
        <div style={{ flex: 1 }}>
          <OperationalActivityFeed incidents={matchData.incidents} />
        </div>
      </motion.div>

      {/* Section 8: Persistent AI Copilot Context Integration */}
      <AiCopilotWidget
        scenarioContext={{
          stadiumName: matchData.stadium.name,
          phase: matchData.currentPhase,
          healthScore: currentHealth.score,
          activeIncidentCount: matchData.incidents.filter(
            (i) => i.status !== 'resolved' && i.status !== 'closed'
          ).length,
        }}
        recommendations={matchData.aiRecommendations}
      />
    </main>
  );
}
