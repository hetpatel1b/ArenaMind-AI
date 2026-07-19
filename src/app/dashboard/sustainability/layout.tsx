import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArenaMind | Sustainability Command Center',
  description: 'AI-powered Sustainable Smart Stadium platform for FIFA World Cup 2026',
};

export default function SustainabilityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#0F172A',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent 40%)',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
