'use client';

import React from 'react';
import { InclusiveProfile } from '../../../lib/inclusive/types';

interface Props {
  profile: InclusiveProfile;
}

export default function LostVisitorTracker({ profile }: Props) {
  if (!profile.isLost) return null;

  return (
    <div
      style={{
        background: '#eef2ff',
        border: '2px solid #6366f1',
        borderRadius: '16px',
        padding: '24px',
        color: '#312e81',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <h3
        style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span>📍</span> Reunification Protocol Active
      </h3>

      <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5 }}>
        We have activated the safe reunification protocol. Please stay calm. A certified safety
        volunteer has been dispatched to your exact location.
      </p>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}
      >
        <div
          style={{
            background: '#fff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #c7d2fe',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#4f46e5',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Next Step
          </div>
          <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>
            Wait at your current location
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #c7d2fe',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#4f46e5',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Nearest Safe Zone
          </div>
          <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>
            Information Desk 4 (50m)
          </div>
        </div>
      </div>
    </div>
  );
}
