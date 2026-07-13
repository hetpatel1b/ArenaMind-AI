'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthBackground } from '@/app/components/auth/AuthBackground';
import { PressFeedback } from '@/app/components/motion/MicroInteractions';
import { PageTransition } from '@/app/components/motion/PageTransition';

export default function NotFoundPage() {
  const router = useRouter();

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(5,5,5,0.8), rgba(5,5,5,0.95))',
          backdropFilter: 'blur(20px)',
        }}
      />

      <AuthBackground />

      <PageTransition layoutKey="not-found">
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
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-6)',
            }}
          >
            <span
              style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', letterSpacing: '0.1em' }}
            >
              404
            </span>
          </div>

          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Sector Not Found
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-8)',
            }}
          >
            The requested operational sector does not exist or has been decommissioned. Please
            verify the coordinates and try again.
          </p>

          <PressFeedback scale={0.97}>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-primary"
              style={{ width: '100%', padding: 'var(--space-3)' }}
            >
              Return to Command Center
            </button>
          </PressFeedback>
        </div>
      </PageTransition>
    </div>
  );
}
