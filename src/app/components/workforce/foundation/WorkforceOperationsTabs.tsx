'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';
import { WorkforceMode } from './WorkforceTypes';
import { WorkforceDeploymentWorkspace } from './WorkforceDeploymentWorkspace';
import { WorkforceDeploymentConsole } from './WorkforceDeploymentConsole';
import { WorkforceShiftCommand } from './WorkforceShiftCommand';
import { WorkforceCommunicationFeed } from './WorkforceCommunicationFeed';
import { WorkforceExecutiveReport } from './WorkforceExecutiveReport';

export function WorkforceOperationsTabs() {
  const { state, dispatch } = useWorkforceWorkspace();

  const tabs = [
    { id: WorkforceMode.DEPLOYMENT, label: 'Deployment' },
    { id: WorkforceMode.MISSIONS, label: 'Missions' },
    { id: WorkforceMode.SHIFTS, label: 'Shifts' },
    { id: WorkforceMode.BREAKS, label: 'Breaks' },
    { id: WorkforceMode.COMMUNICATIONS, label: 'Communications' },
    { id: WorkforceMode.ANALYTICS, label: 'Analytics' },
    { id: WorkforceMode.REPORTS, label: 'Reports' },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#080A0C',
      }}
    >
      {/* Navigation Header */}
      <div
        role="tablist"
        aria-label="Workforce Operations Views"
        style={{
          height: '48px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: '24px',
          background: 'rgba(13, 15, 18, 0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 20,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={state.workspaceMode === tab.id}
            onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: tab.id })}
            style={{
              background: 'transparent',
              border: 'none',
              color: state.workspaceMode === tab.id ? '#38BDF8' : '#64748B',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '16px 0',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s',
            }}
          >
            {tab.label}
            {state.workspaceMode === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#38BDF8',
                  boxShadow: '0 -2px 10px rgba(56,189,248,0.5)',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Viewport content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state.workspaceMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
          >
            {state.workspaceMode === WorkforceMode.DEPLOYMENT && <WorkforceDeploymentConsole />}
            {state.workspaceMode === WorkforceMode.MISSIONS && (
              <WorkforceDeploymentWorkspace />
            )}{' '}
            {/* Reusing map as mission board for now */}
            {state.workspaceMode === WorkforceMode.SHIFTS && (
              <WorkforceShiftCommand type="shifts" />
            )}
            {state.workspaceMode === WorkforceMode.BREAKS && (
              <WorkforceShiftCommand type="breaks" />
            )}
            {state.workspaceMode === WorkforceMode.COMMUNICATIONS && <WorkforceCommunicationFeed />}
            {state.workspaceMode === WorkforceMode.ANALYTICS && (
              <div style={{ padding: '24px', color: '#64748B' }}>Full Analytics Dashboard</div>
            )}
            {state.workspaceMode === WorkforceMode.REPORTS && <WorkforceExecutiveReport />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
