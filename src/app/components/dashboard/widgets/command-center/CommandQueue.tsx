'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandCenter, Mission } from '@/lib/contexts/CommandCenterContext';

export function CommandQueue() {
  const { activeMissions, dispatch } = useCommandCenter();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sort by priority and status
  const sorted = [...activeMissions].sort((a, b) => {
    if (a.phase === 'RESOLVED' && b.phase !== 'RESOLVED') return 1;
    if (a.phase !== 'RESOLVED' && b.phase === 'RESOLVED') return -1;
    if (a.priority === 'Critical' && b.priority !== 'Critical') return -1;
    if (a.priority !== 'Critical' && b.priority === 'Critical') return 1;
    return a.etaMin - b.etaMin;
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        height: '100%',
        overflowY: 'auto',
        paddingRight: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Active Operations
        </h2>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_QUEUE_COLLAPSE' })}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <CommandSkeleton />
              <CommandSkeleton />
              <CommandSkeleton />
            </motion.div>
          ) : sorted.length > 0 ? (
            sorted.map((mission) => <SmartCommandCard key={mission.id} mission={mission} />)
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-tertiary)',
                gap: '16px',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '1px solid var(--ai-accent)',
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '1px solid var(--ai-accent)',
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--ai-accent)',
                    boxShadow: '0 0 10px var(--ai-accent)',
                  }}
                />
              </div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                No Active Operations
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CommandSkeleton() {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          style={{
            height: '12px',
            width: '40%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        />
        <div
          style={{
            height: '16px',
            width: '70%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
          }}
        />
      </motion.div>
    </div>
  );
}

function SmartCommandCard({ mission }: { mission: Mission }) {
  const { focusedMissionId, dispatch } = useCommandCenter();
  const isFocused = focusedMissionId === mission.id;
  const isResolved = mission.phase === 'RESOLVED';

  const getPriorityColor = (priority: string) => {
    if (priority === 'Critical') return 'var(--status-critical)';
    if (priority === 'High') return 'var(--status-warning)';
    return 'var(--ai-accent)';
  };

  const handleFocus = () => {
    if (isFocused) {
      dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: null } });
    } else {
      dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: mission.id } });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isResolved ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, height: 0 }}
      onClick={handleFocus}
      style={{
        background: isFocused
          ? `linear-gradient(90deg, ${getPriorityColor(mission.priority)}15 0%, rgba(255,255,255,0.06) 10%, rgba(255,255,255,0.02) 100%)`
          : 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderLeft: `2px solid ${isFocused ? getPriorityColor(mission.priority) : 'transparent'}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: isFocused ? `0 4px 20px rgba(0,0,0,0.2)` : 'none',
        transition: 'all 0.2s ease',
      }}
      whileHover={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        y: -2,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        transition: { duration: 0.2 },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: getPriorityColor(mission.priority),
              }}
            />
            <span
              style={{
                fontSize: '9px',
                textTransform: 'uppercase',
                color: getPriorityColor(mission.priority),
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              {mission.priority} • {mission.phase}
            </span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{mission.name}</div>
        </div>
        <div
          style={{
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
            {mission.etaMin}m
          </div>
          <div
            style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
          >
            ETA
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '2px solid var(--ai-accent)',
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  color: 'var(--ai-accent)',
                  textTransform: 'uppercase',
                  marginBottom: '2px',
                  letterSpacing: '0.5px',
                }}
              >
                AI Reasoning
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {mission.reasoning}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{ fontSize: '8px', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}
                >
                  SUCCESS PROBABILITY
                </div>
                <div
                  style={{ fontSize: '12px', color: 'var(--status-success)', fontWeight: 'bold' }}
                >
                  {mission.successProbability}%
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{ fontSize: '8px', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}
                >
                  RESOURCES
                </div>
                <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>
                  {mission.assignedResources.length} Units
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
