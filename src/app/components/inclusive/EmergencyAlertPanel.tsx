'use client';

import React from 'react';
import { EmergencyGuidance } from '../../../lib/inclusive/types';

interface Props {
  guidance: EmergencyGuidance | null;
}

export default function EmergencyAlertPanel({ guidance }: Props) {
  if (!guidance) return null;

  const isCritical = guidance.priority === 'CRITICAL';

  return (
    <div
      style={{
        background: isCritical ? '#7f1d1d' : '#9a3412',
        color: '#fff',
        border: `2px solid ${isCritical ? '#ef4444' : '#f97316'}`,
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#fca5a5' }}>
          ⚠️ EMERGENCY GUIDANCE
        </h2>
        <span
          style={{
            background: '#fff',
            color: '#000',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          {guidance.priority}
        </span>
      </div>

      <div style={{ fontSize: '18px', fontWeight: 600 }}>Target Safe Zone: {guidance.safeZone}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {guidance.instructions.map((instruction, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              background: 'rgba(0,0,0,0.2)',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '16px',
              lineHeight: 1.5,
            }}
          >
            <div
              style={{
                background: '#ef4444',
                color: '#fff',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {idx + 1}
            </div>
            <div>{instruction}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
