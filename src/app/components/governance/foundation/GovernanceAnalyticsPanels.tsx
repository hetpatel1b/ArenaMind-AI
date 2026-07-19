'use client';

import React, { useMemo } from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

export default function GovernanceAnalyticsPanels() {
  const { state, dispatch } = useGovernanceWorkspace();
  const { panels } = state;

  return (
    <div
      style={{
        width: '100%',
        height: '10rem',
        backgroundColor: '#000',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
        flexShrink: 0,
        position: 'relative',
        zIndex: 20,
      }}
    >
      {panels.map((p, i) => (
        <div
          key={p.title}
          onClick={() => {
            let targetSection = 'INFRASTRUCTURE';
            if (p.title === 'Security Score' || p.title === 'Policy Coverage')
              targetSection = 'POLICIES';
            else if (p.title === 'Compliance') targetSection = 'AUDIT_LOGS';
            else if (p.title === 'AI Providers') targetSection = 'MODEL_REGISTRY';
            else if (p.title === 'Storage Cap.' || p.title === 'Backup Success')
              targetSection = 'BACKUPS';

            dispatch({ type: 'SET_SECTION', payload: targetSection as SafeAny });
          }}
          style={{
            padding: '1rem',
            borderRight: i < panels.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div
            style={{
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '0.5rem',
            }}
          >
            {p.title}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <AnimatedNumber
              value={p.rawValue}
              format={(v) =>
                p.title.includes('Tbps')
                  ? v.toFixed(2)
                  : p.title.includes('%')
                    ? v.toFixed(1)
                    : Math.round(v).toString()
              }
              style={{
                fontSize: '1.5rem',
                fontWeight: 300,
                color: '#fff',
                letterSpacing: '-0.025em',
              }}
            />
            <span
              style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 500 }}
            >
              {p.value.replace(/[\d.,]/g, '')}
            </span>
          </div>

          <div style={{ flex: 1, marginTop: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: '2px' }}>
              {p.sparkline.map((val: number, idx: number) => {
                const max = Math.max(...p.sparkline, 1);
                const min = Math.min(...p.sparkline, 0);
                const range = max - min || 1;
                const normalized = (val - min) / range;
                const height = Math.max(normalized * 100, 5); // min 5%

                const color =
                  p.status === 'critical'
                    ? '#f87171'
                    : p.status === 'warning'
                      ? '#fbbf24'
                      : '#34d399';

                return (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{
                      flex: 1,
                      backgroundColor: color,
                      opacity: 0.8,
                      borderRadius: '2px 2px 0 0',
                    }}
                  />
                );
              })}
            </div>

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #000 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
