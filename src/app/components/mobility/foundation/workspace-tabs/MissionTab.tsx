import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { motion } from 'framer-motion';
import { MobilityMission } from '../MobilityTypes';

export function MissionTab({ missions }: { missions: MobilityMission[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {missions.map((m) => (
        <div
          key={m.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${m.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#A1A1AA' }}>
              {m.id} • {m.status}
            </span>
            <span
              style={{
                fontSize: '11px',
                color:
                  m.priority === 'CRITICAL'
                    ? ThemeTokens.colors.danger.default
                    : ThemeTokens.colors.warning.default,
                fontWeight: 600,
              }}
            >
              {m.priority}
            </span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginTop: '-4px' }}>
            {m.title}
          </span>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {m.departments.map((d) => (
              <span
                key={d}
                style={{
                  fontSize: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#E4E4E7',
                }}
              >
                {d}
              </span>
            ))}
          </div>

          <div
            style={{
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '4px',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${m.progress}%` }}
              style={{ height: '100%', background: '#3B82F6' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#A1A1AA',
            }}
          >
            <span>Progress: {m.progress}%</span>
            <span>ETA: {m.eta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
