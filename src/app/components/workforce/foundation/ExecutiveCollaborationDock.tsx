'use client';

import React from 'react';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

export function ExecutiveCollaborationDock() {
  const { state } = useWorkforceWorkspace();
  const { operators } = state;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 24px',
        background: '#0D0F12',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Active Command
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        {operators?.map((op) => (
          <div key={op.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: '#FFF',
                border: '2px solid #0D0F12',
                boxShadow: '0 0 0 1px rgba(56, 189, 248, 0.3)',
              }}
            >
              {op.avatarInitials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#F8FAFC' }}>{op.name}</span>
              <span style={{ fontSize: '10px', color: '#10B981' }}>{op.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
