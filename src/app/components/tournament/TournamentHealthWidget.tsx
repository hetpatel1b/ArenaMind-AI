'use client';

import React from 'react';
import { TournamentHealthIndex } from '../../../lib/tournament/types';

export default function TournamentHealthWidget({ health }: { health: TournamentHealthIndex }) {
  const getScoreColor = (score: number) =>
    score >= 90 ? '#22c55e' : score >= 75 ? '#eab308' : '#ef4444';

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
          Tournament Health Index
        </h2>
        <div
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: getScoreColor(health.overallScore),
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {health.overallScore}{' '}
          <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 500 }}>
            / 100 {health.trend === 'UP' ? '↗' : health.trend === 'DOWN' ? '↘' : '→'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {Object.entries(health.dimensions).map(([key, val]) => (
          <div
            key={key}
            style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  flex: 1,
                  background: '#e2e8f0',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: `${val}%`, background: getScoreColor(val), height: '100%' }} />
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0f172a',
                  width: '32px',
                  textAlign: 'right',
                }}
              >
                {val}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
