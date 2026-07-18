import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { OperationalMemoryRecord } from '../MobilityTypes';

export function MemoryTab({ memories }: { memories: OperationalMemoryRecord[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {memories.map((m) => (
        <div
          key={m.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{m.event}</span>
            <span
              style={{
                fontSize: '12px',
                color: ThemeTokens.colors.success.default,
                fontWeight: 600,
              }}
            >
              {m.similarity}% Match
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Outcome: {m.historicalOutcome}</span>

          <div
            style={{
              background: 'rgba(0,0,0,0.2)',
              padding: '8px',
              borderRadius: '4px',
              borderLeft: '2px solid #3B82F6',
            }}
          >
            <span style={{ fontSize: '11px', color: '#E4E4E7', fontStyle: 'italic' }}>
              &quot;{m.executiveNotes}&quot;
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {m.previousActions.map((a) => (
              <span
                key={a}
                style={{
                  fontSize: '10px',
                  color: '#71717A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
