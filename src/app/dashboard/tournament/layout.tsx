import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArenaMind | Tournament Command Center',
  description: 'AI-powered FIFA Tournament Operating System',
};

export default function TournamentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9', // slightly darker slate for contrast
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
