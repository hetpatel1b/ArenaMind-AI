'use client';

import React from 'react';
import TournamentCommandCenter from '../../components/tournament/TournamentCommandCenter';

export default function TournamentPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header
        style={{
          padding: '16px 24px',
          background: '#0f172a',
          color: '#fff',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
          FIFA World Cup 2026™ <span style={{ color: '#38bdf8' }}>Tournament Command Center</span>
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Unified AI Operating System
        </p>
      </header>

      <main style={{ flex: 1, overflow: 'hidden' }}>
        <TournamentCommandCenter />
      </main>
    </div>
  );
}
