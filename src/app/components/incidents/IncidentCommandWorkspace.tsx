'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AiIncidentBriefing } from './widgets/AiIncidentBriefing';
import { PriorityIncidentQueue } from './widgets/PriorityIncidentQueue';
import { InteractiveIncidentMap } from './widgets/InteractiveIncidentMap';
import { IncidentWorkspacePanel } from './widgets/IncidentWorkspacePanel';
import { AiIncidentAnalysis } from './widgets/AiIncidentAnalysis';
import { ResourceCoordination } from './widgets/ResourceCoordination';
import { IncidentTimeline } from './widgets/IncidentTimeline';
import { IncidentActivityFeed } from './widgets/IncidentActivityFeed';
import { IncidentPersistentCopilot } from './widgets/IncidentPersistentCopilot';

export interface IncidentMatchPayload {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  currentPhase: string;
  stadium: { name: string; capacity: number; zones: any[] };
  incidents: any[];
  resources: any[];
  aiRecommendations: any[]; // specifically filtered for incident_resolution
  phaseTransitions: any[];
}

export function IncidentCommandWorkspace({ matchData }: { matchData: IncidentMatchPayload }) {
  const shouldReduceMotion = useReducedMotion();

  // Local state to track which incident is currently selected in the triage queue
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    matchData.incidents.length > 0 ? matchData.incidents[0].id : null
  );

  const selectedIncident =
    matchData.incidents.find((i) => i.id === selectedIncidentId) || matchData.incidents[0];

  // Extract the highest priority recommendation tied to the selected incident (or globally if none tied)
  const primaryRecommendation =
    matchData.aiRecommendations.find((r) => r.data.incidentId === selectedIncidentId) ||
    (matchData.aiRecommendations.length > 0 ? matchData.aiRecommendations[0] : null);

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
      {/* Section 1: AI Incident Briefing (Hero) spans top 12 cols */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <AiIncidentBriefing
          stadiumName={matchData.stadium.name}
          currentPhase={matchData.currentPhase}
          selectedIncident={selectedIncident}
          primaryRecommendation={primaryRecommendation}
        />
      </motion.div>

      {/* Section 2 & 3: Queue and Map (Queue spans 4, Map spans 8) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <PriorityIncidentQueue
          incidents={matchData.incidents}
          selectedIncidentId={selectedIncidentId}
          onSelectIncident={setSelectedIncidentId}
        />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{ gridColumn: 'span 8' }}
      >
        <InteractiveIncidentMap
          zones={matchData.stadium.zones}
          incidents={matchData.incidents}
          selectedIncidentId={selectedIncidentId}
        />
      </motion.div>

      {/* Sections 4, 5, 6: Panel, AI Analysis, Resources (Span 4 each next row) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <IncidentWorkspacePanel incident={selectedIncident} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <AiIncidentAnalysis recommendation={primaryRecommendation} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <ResourceCoordination
          resources={matchData.resources}
          incidentZoneId={selectedIncident?.zoneId}
        />
      </motion.div>

      {/* Sections 7 & 8: Timeline and Activity Feed (Span 6 each) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
        style={{ gridColumn: 'span 6' }}
      >
        <IncidentTimeline incident={selectedIncident} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
        style={{ gridColumn: 'span 6' }}
      >
        <IncidentActivityFeed incidents={matchData.incidents} />
      </motion.div>

      {/* Section 9: Persistent Copilot */}
      <IncidentPersistentCopilot
        scenarioContext={{
          incidentTitle: selectedIncident?.title || 'Unknown',
          incidentSeverity: selectedIncident?.severityTier || 4,
          assignedResourcesCount: selectedIncident?.assignedTo ? 1 : 0,
        }}
      />
    </main>
  );
}
