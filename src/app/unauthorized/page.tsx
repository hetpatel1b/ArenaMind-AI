'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthBackground } from '@/app/components/auth/AuthBackground';
import { PressFeedback } from '@/app/components/motion/MicroInteractions';
import { PageTransition } from '@/app/components/motion/PageTransition';

export default function UnauthorizedPage() {
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

      <PageTransition layoutKey="unauthorized">
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
            border: '1px solid rgba(255, 59, 48, 0.2)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 59, 48, 0.1)',
              color: 'var(--status-critical)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-6)',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>

          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Clearance Denied
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-8)',
            }}
          >
            Your current operational clearance does not permit access to this sector of the Command
            Center. If you believe this is an error, please contact your FIFA Operations Supervisor.
          </p>

          <PressFeedback scale={0.97}>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-primary"
              style={{ width: '100%', padding: 'var(--space-3)' }}
            >
              Return to Authorized Sector
            </button>
          </PressFeedback>
        </div>
      </PageTransition>
    </div>
  );
}
