'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MobilityWorkspaceProvider, useMobilityContext } from './MobilityContext';
import { ExecutiveMobilityRibbon, MobilityMetricsProps } from './ExecutiveMobilityRibbon';
import { MobilityMetricRibbon, MobilityMetrics } from './MobilityMetricRibbon';
import { MobilityTimeline } from './MobilityTimeline';
import { MobilityContentWorkspace } from './MobilityContentWorkspace';
import { TransportHealth } from './MobilitySidebar';
import { MobilityNotificationCenter } from './MobilityNotificationCenter';
import { MobilityPersistentCopilot } from '../widgets/MobilityPersistentCopilot';

import { useMobilityEngine } from './useMobilityEngine';

function WorkspaceLayout() {
  const shouldReduceMotion = useReducedMotion();
  const { state, actions } = useMobilityContext();
  const engine = useMobilityEngine();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        minWidth: 0,
        background: 'var(--bg-default, #0D0F12)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <MobilityNotificationCenter alerts={engine.activeAlerts} />

      {/* Top Executive Ribbon */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ flex: '0 0 auto', zIndex: 10, minWidth: 0 }}
      >
        <ExecutiveMobilityRibbon
          metrics={{
            currentMatchPhase: 'PRE-EVENT',
            networkStatus:
              engine.metrics.networkAvailability > 95
                ? 'NOMINAL'
                : engine.metrics.networkAvailability > 80
                  ? 'DEGRADED'
                  : 'CRITICAL',
            criticalAlert: engine.activeAlerts[0]?.title ?? null,
            primaryRecommendation:
              engine.copilotReasoning[0]?.recommendation || 'Maintain monitoring.',
            expectedRecovery: 'On Schedule',
            executiveApprovalNeeded: false,
            aiReadiness: 99,
            confidence: 96,
          }}
        />
      </motion.div>

      {/* Operational KPI Ribbon */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        style={{ flex: '0 0 auto', zIndex: 9, minWidth: 0 }}
      >
        <MobilityMetricRibbon
          metrics={{
            ...engine.metrics,
            averageETA: engine.metrics.averageETA,
            predictedDelay: engine.metrics.predictedDelay,
          }}
        />
      </motion.div>

      {/* Main Content Area */}
      <MobilityContentWorkspace sidebarData={engine.sidebarData} engine={engine} />

      {/* Bottom Timeline Drawer */}
      <MobilityTimeline isExpanded={state.timelineExpanded} onToggle={actions.toggleTimeline} />

      <MobilityPersistentCopilot />
    </div>
  );
}

export function MobilityWorkspace() {
  return (
    <MobilityWorkspaceProvider>
      <WorkspaceLayout />
    </MobilityWorkspaceProvider>
  );
}
