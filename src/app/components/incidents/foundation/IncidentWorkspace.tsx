'use client';

import React from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { IncidentProvider } from './IncidentContext';
import { ExecutiveIncidentBanner, ExecutiveBannerProps } from './ExecutiveIncidentBanner';
import { PriorityQueue } from './PriorityQueue';
import { IncidentWorkspaceCenter } from './IncidentWorkspaceCenter';
import { IncidentTimeline } from './IncidentTimeline';
import { IncidentCopilot } from './IncidentCopilot';
import { Incident } from './IncidentTypes';
import { useIncidentEngine } from './useIncidentEngine';
import { ExecutiveNotificationCenter } from './ExecutiveNotificationCenter';

export interface IncidentWorkspaceProps {
  initialMetrics: ExecutiveBannerProps['metrics'];
  initialIncidents: Incident[];
}

function WorkspaceLayout({ initialMetrics, initialIncidents }: IncidentWorkspaceProps) {
  const shouldReduceMotion = useReducedMotion();
  const { incidents, resources, departments, chatMessages, notifications, metrics } =
    useIncidentEngine(initialIncidents);

  const [isTimelineExpanded, setIsTimelineExpanded] = React.useState(false);
  const [isQueueExpanded, setIsQueueExpanded] = React.useState(false);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        minWidth: 0,
        background: 'var(--bg-default, #0D0F12)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ExecutiveNotificationCenter notifications={notifications} />

      {/* Top Hero Banner - 18% height approximate */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ flex: '0 0 auto', zIndex: 10, minWidth: 0 }}
      >
        <ExecutiveIncidentBanner metrics={metrics} />
      </motion.div>

      {/* Main Content Area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Priority Queue (Left Column - Collapsible) */}
        <motion.div
          initial={false}
          animate={{ width: isQueueExpanded ? 320 : 72 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          style={{
            flexShrink: 0,
            height: '100%',
            zIndex: 5,
            overflow: 'hidden',
            borderRight: '1px solid rgba(255,255,255,0.02)',
          }}
        >
          <PriorityQueue
            incidents={incidents}
            isExpanded={isQueueExpanded}
            onToggle={() => setIsQueueExpanded(!isQueueExpanded)}
          />
        </motion.div>

        {/* Center Workspace (60%) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, zIndex: 1 }}
        >
          <IncidentWorkspaceCenter
            incidents={incidents}
            resources={resources}
            departments={departments}
            chatMessages={chatMessages}
          />
        </motion.div>

        {/* Adaptive Copilot (Overlay) */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, zIndex: 20 }}>
          <IncidentCopilot incidents={incidents} />
        </div>
      </div>

      {/* Bottom Timeline Drawer */}
      <motion.div
        initial={false}
        animate={{ height: isTimelineExpanded ? '120px' : '32px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          flex: '0 0 auto',
          zIndex: 10,
          background: 'var(--bg-surface-elevated, #1A1D24)',
          borderTop: '1px solid rgba(255,255,255,0.02)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
          style={{
            background: 'transparent',
            border: 'none',
            width: '100%',
            padding: '4px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            height: '32px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
            }}
          />
        </button>
        <div
          style={{
            flex: 1,
            opacity: isTimelineExpanded ? 1 : 0,
            transition: 'opacity 0.2s',
            paddingBottom: '8px',
          }}
        >
          <IncidentTimeline incidents={incidents} />
        </div>
      </motion.div>
    </main>
  );
}

export function IncidentWorkspace({ initialMetrics, initialIncidents }: IncidentWorkspaceProps) {
  return (
    <IncidentProvider initialContext={{ selectedIncident: initialIncidents[0]?.id || null }}>
      <WorkspaceLayout initialMetrics={initialMetrics} initialIncidents={initialIncidents} />
    </IncidentProvider>
  );
}
