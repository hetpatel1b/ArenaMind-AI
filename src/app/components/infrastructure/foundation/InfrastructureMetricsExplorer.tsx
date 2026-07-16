'use client';

import React, { useState } from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import { motion, AnimatePresence } from 'framer-motion';

export const InfrastructureMetricsExplorer: React.FC = React.memo(() => {
  const { state } = useInfrastructureWorkspace();
  const [metric, setMetric] = useState('CPU');

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#050505',
        padding: '16px',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 400, color: '#fff' }}>
          Metrics Explorer
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['CPU', 'RAM', 'GPU', 'LATENCY'].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              style={{
                backgroundColor: metric === m ? '#00ffcc' : 'rgba(255,255,255,0.05)',
                color: metric === m ? '#000' : '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 12px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px',
          backgroundColor: 'rgba(255,255,255,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={metric}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '48px', color: '#fff', fontWeight: 300 }}>
              {metric === 'CPU'
                ? state.metrics.cpuUsage.toFixed(1) + '%'
                : metric === 'RAM'
                  ? state.metrics.ramUsage.toFixed(1) + '%'
                  : metric === 'GPU'
                    ? state.metrics.gpuUsage.toFixed(1) + '%'
                    : state.metrics.gatewayLatency.toFixed(0) + 'ms'}
            </div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>Global Average</div>

            <svg width="400" height="150" viewBox="0 0 400 150" style={{ marginTop: '32px' }}>
              <polyline
                points="0,100 50,120 100,90 150,110 200,60 250,80 300,40 350,60 400,20"
                fill="none"
                stroke="#00ffcc"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

InfrastructureMetricsExplorer.displayName = 'InfrastructureMetricsExplorer';
