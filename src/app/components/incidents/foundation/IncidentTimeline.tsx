import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IncidentStage, Incident } from './IncidentTypes';
import { useIncidentContext } from './IncidentContext';

export function IncidentTimeline({ incidents }: { incidents: Incident[] }) {
  const { state } = useIncidentContext();
  const activeIncident = incidents.find((i) => i.id === state.selectedIncident);
  const stages: IncidentStage[] = [
    'REPORTED',
    'VERIFIED',
    'ANALYZING',
    'ASSIGNED',
    'DISPATCHED',
    'CONTAINED',
    'RESOLVED',
    'ARCHIVED',
  ];

  if (!activeIncident) {
    return (
      <div
        style={{
          height: '100%',
          padding: '16px 24px',
          background: 'var(--bg-surface-elevated, #1A1D24)',
          borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Waiting for active incident...
        </div>
      </div>
    );
  }

  const activeStageIndex = stages.indexOf(activeIncident.currentStage);

  return (
    <div
      style={{
        height: '100%',
        padding: '16px 24px',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-secondary, #A0A5B1)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '16px',
        }}
      >
        Incident Lifecycle Timeline
      </div>

      <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
        {/* Background track */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '2px',
            background: 'rgba(255,255,255,0.05)',
            transform: 'translateY(-50%)',
            zIndex: 0,
          }}
        />

        {/* Active track */}
        <motion.div
          animate={{ width: `${(Math.max(activeStageIndex, 0) / (stages.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            height: '2px',
            background: '#3e82f7',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', zIndex: 2 }}>
          {stages.map((stage, index) => {
            const isCompleted = index <= activeStageIndex;
            const isActive = index === activeStageIndex;

            return (
              <div
                key={stage}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <motion.div
                  animate={{
                    background: isActive
                      ? '#3e82f7'
                      : isCompleted
                        ? '#3e82f7'
                        : 'var(--bg-surface-elevated, #1A1D24)',
                    borderColor: isActive
                      ? '#3e82f7'
                      : isCompleted
                        ? '#3e82f7'
                        : 'rgba(255,255,255,0.2)',
                    boxShadow: isActive ? '0 0 12px rgba(62,130,247,0.5)' : 'none',
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid',
                  }}
                />
                <motion.div
                  animate={{
                    color: isActive
                      ? '#fff'
                      : isCompleted
                        ? 'rgba(255,255,255,0.8)'
                        : 'var(--text-secondary, #A0A5B1)',
                  }}
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.5px',
                  }}
                >
                  {stage}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
