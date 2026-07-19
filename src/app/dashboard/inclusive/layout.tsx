import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArenaMind | Inclusive Experience',
  description: 'Adaptive Inclusive AI Experience for FIFA World Cup 2026',
};

export default function InclusiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
