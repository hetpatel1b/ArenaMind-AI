import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ArenaMind | Fan Experience',
  description: 'Your AI Tournament Companion for the FIFA World Cup 2026',
};

export default function FanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: 'url("/stadium-bg.jpg") center/cover no-repeat', // Assuming a background image exists or fallback
        backgroundColor: '#0F172A',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      {/* Background overlay for better contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 100%)',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
