'use client';

import React from 'react';
import { PageTransition } from '@/app/components/motion/PageTransition';
import { AuthBackground } from '@/app/components/auth/AuthBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/images/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(5,5,5,0.8), rgba(5,5,5,0.95))',
          backdropFilter: 'blur(20px)',
        }}
      />

      {/* Cinematic AI Background Effects */}
      <AuthBackground />

      {/* Auth Container */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          zIndex: 'var(--z-overlay)',
          width: '100%',
          maxWidth: '480px',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          margin: 'var(--space-4)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--ai-accent)',
                borderRadius: '50%',
                boxShadow: '0 0 10px var(--ai-accent)',
              }}
              className="animate-pulse"
            />
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: '0.05em',
                color: 'var(--text-inverse)',
              }}
            >
              ArenaMind AI
            </h1>
          </div>
          <p
            style={{
              color: 'var(--text-tertiary)',
              fontSize: 'var(--text-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Operations Command Center
          </p>
        </div>

        <PageTransition layoutKey="auth-transition">{children}</PageTransition>
      </div>
    </div>
  );
}
