'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useMotionValue } from 'framer-motion';
import { DigitalTwinMap } from './widgets/digital-twin/DigitalTwinMap';
import { Mission, useCommandCenter } from '@/lib/contexts/CommandCenterContext';
import { GlobalStatusBar } from './widgets/command-center/GlobalStatusBar';
import { CommandQueue } from './widgets/command-center/CommandQueue';
import { UnifiedWorkspace } from './widgets/command-center/UnifiedWorkspace';
import { MissionTimeline } from './widgets/command-center/MissionTimeline';
import { CommandPalette } from './shell/CommandPalette';
import { QuickActionBar } from './widgets/command-center/QuickActionBar';
import { PinnedItemsStrip } from './shell/PinnedItemsStrip';
import { SmartOnboarding } from './shell/SmartOnboarding';

// Defining a rough shape of the heavy payload to ensure strong typing down the tree
export interface DashboardMatchPayload {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  currentPhase: string;
  venue: { name: string; capacity: number; zones?: SafeAny[] };
  incidents: SafeAny[];
  aiRecommendations: SafeAny[];
  kpiSnapshots: SafeAny[];
  healthScores: SafeAny[];
  zones: SafeAny[];
  resources: SafeAny[];
}

export function CommandCenterDashboard({ matchData }: { matchData: DashboardMatchPayload }) {
  const shouldReduceMotion = useReducedMotion();
  const zonesToUse = matchData.zones?.length ? matchData.zones : matchData.venue.zones || [];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <GlobalStatusBar />
      <PinnedItemsStrip />
      <InnerDashboardGrid
        matchData={matchData}
        zonesToUse={zonesToUse}
        shouldReduceMotion={shouldReduceMotion || false}
      />
      <CommandPalette />
      <QuickActionBar />
      <SmartOnboarding />
    </div>
  );
}

function InnerDashboardGrid({
  matchData,
  zonesToUse,
  shouldReduceMotion,
}: {
  matchData: SafeAny;
  zonesToUse: SafeAny;
  shouldReduceMotion: boolean;
}) {
  const { globalMetrics, dispatch, isQueueCollapsed, isWorkspaceCollapsed, focusMode } =
    useCommandCenter();

  useEffect(() => {
    const handleSearch = (e: SafeAny) => {
      // Upon global search, switch context to inspector
      dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: null } });
      dispatch({ type: 'SET_WORKSPACE_MODE', payload: { mode: 'INSPECTOR' } });
    };
    window.addEventListener('arenamind_search', handleSearch);
    return () => window.removeEventListener('arenamind_search', handleSearch);
  }, [dispatch]);

  const leftWidth = useMotionValue(280);
  const rightWidth = useMotionValue(320);

  // Dynamic ambient lighting based on emergency level
  const ambientColor = focusMode
    ? 'rgba(0,0,0,0.8)'
    : globalMetrics.emergencyLevel === 'CRITICAL'
      ? 'rgba(255, 69, 58, 0.05)'
      : globalMetrics.emergencyLevel === 'WARNING'
        ? 'rgba(255, 159, 10, 0.04)'
        : 'rgba(10,132,255,0.03)';

  return (
    <div
      className="dashboard-grid"
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        padding: focusMode ? 'var(--space-2)' : 'var(--space-6)',
        flex: 1,
        minHeight: 0,
        width: '100%',
        maxWidth: focusMode ? '100%' : '2200px',
        margin: '0 auto',
        backgroundImage: `radial-gradient(circle at 50% 50%, ${ambientColor} 0%, transparent 70%)`,
        transition: 'all 1s ease',
      }}
    >
      {/* Left Col: Command Queue */}
      <motion.div
        layout
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, width: isQueueCollapsed ? 48 : undefined }}
        transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, duration: 0.25 }}
        style={{
          width: isQueueCollapsed ? 48 : leftWidth,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        {isQueueCollapsed ? (
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(5,5,5,0.5)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <button
              onClick={() => dispatch({ type: 'TOGGLE_QUEUE_COLLAPSE' })}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </button>
          </div>
        ) : (
          <CommandQueue />
        )}
      </motion.div>

      {/* Drag Handle 1 */}
      {!isQueueCollapsed && !focusMode && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(e, info) => {
            leftWidth.set(Math.max(240, Math.min(450, leftWidth.get() + info.delta.x)));
          }}
          style={{ width: 8, cursor: 'col-resize', backgroundColor: 'transparent', zIndex: 10 }}
        />
      )}

      {/* Center: Digital Twin & Timeline */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          minWidth: 400,
        }}
      >
        <motion.div
          layout
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            layout: { type: 'spring', stiffness: 300, damping: 30 },
            duration: 0.25,
            delay: 0.1,
          }}
          style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
        >
          <DigitalTwinMap
            zones={zonesToUse}
            incidents={matchData.incidents || []}
            resources={matchData.resources || []}
          />
        </motion.div>

        {/* Bottom Center: Mission Timeline (hidden in focus mode) */}
        {!focusMode && (
          <motion.div
            layout
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              layout: { type: 'spring', stiffness: 300, damping: 30 },
              duration: 0.25,
              delay: 0.1,
            }}
            style={{
              height: 220,
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              style={{
                backgroundColor: 'transparent',
                padding: '0 var(--space-4)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <MissionTimeline />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Drag Handle 2 */}
      {!isWorkspaceCollapsed && !focusMode && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(e, info) => {
            rightWidth.set(Math.max(300, Math.min(600, rightWidth.get() - info.delta.x)));
          }}
          style={{ width: 8, cursor: 'col-resize', backgroundColor: 'transparent', zIndex: 10 }}
        />
      )}

      {/* Right Col: Unified Workspace */}
      {!focusMode && (
        <motion.div
          layout
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, width: isWorkspaceCollapsed ? 48 : undefined }}
          transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, duration: 0.25 }}
          style={{
            width: isWorkspaceCollapsed ? 48 : rightWidth,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          {isWorkspaceCollapsed ? (
            <div
              style={{
                flex: 1,
                backgroundColor: 'rgba(5,5,5,0.5)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <button
                onClick={() => dispatch({ type: 'TOGGLE_WORKSPACE_COLLAPSE' })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
              </button>
            </div>
          ) : (
            <UnifiedWorkspace />
          )}
        </motion.div>
      )}
    </div>
  );
}
