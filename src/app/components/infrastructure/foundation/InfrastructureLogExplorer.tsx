'use client';

import React, { useState } from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import { motion } from 'framer-motion';

export const InfrastructureLogExplorer: React.FC = React.memo(() => {
  const { state, dispatch } = useInfrastructureWorkspace();
  const [filter, setFilter] = useState('ALL');

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        padding: '16px',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 400, color: '#fff' }}>
          Log Explorer
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                backgroundColor: filter === f ? '#00ffcc' : 'rgba(255,255,255,0.05)',
                color: filter === f ? '#000' : '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_ENGINE' })}
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              marginLeft: '16px',
            }}
          >
            {state.engineRunning ? 'PAUSE' : 'RESUME'}
          </button>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: '#000',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px',
          padding: '16px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {state.timelineEvents
          .filter(
            (e) =>
              filter === 'ALL' ||
              (filter === 'ERROR' && e.type.includes('ALERT')) ||
              filter === 'INFO'
          )
          .map((log, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={log.id + i}
              style={{
                color: log.type.includes('ALERT') ? '#ff3333' : '#bbb',
                display: 'flex',
                gap: '16px',
              }}
            >
              <span style={{ color: '#555', minWidth: '80px' }}>{log.time}</span>
              <span style={{ color: '#00ffcc', minWidth: '100px' }}>[SYSTEM]</span>
              <span>{log.label}</span>
            </motion.div>
          ))}
        {!state.engineRunning && (
          <div style={{ color: '#ffaa00', marginTop: '16px', textAlign: 'center' }}>
            --- STREAM PAUSED ---
          </div>
        )}
      </div>
    </div>
  );
});

InfrastructureLogExplorer.displayName = 'InfrastructureLogExplorer';
