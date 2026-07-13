import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PressFeedback } from '../motion/MicroInteractions';
import { CinematicTransition } from '../motion/CinematicTransition';

export function Hero() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <section
      className="container flex-center"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/images/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay to ensure text contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.4), var(--bg-app))',
        }}
      />

      <div
        className="glass-panel animate-slide-up"
        style={{
          position: 'relative',
          zIndex: 'var(--z-overlay)',
          padding: 'var(--space-12)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          maxWidth: '800px',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: 1.2,
            marginBottom: 'var(--space-4)',
          }}
        >
          The Intelligent Stadium <br />
          <span style={{ color: 'var(--ai-accent)' }}>Operations Copilot</span>
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-8)',
          }}
        >
          ArenaMind AI unifies crowd intelligence, incident response, and resource coordination for
          the FIFA World Cup 2026.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
          <PressFeedback scale={0.95}>
            <button
              className="btn btn-primary"
              aria-label="Launch Command Center"
              onClick={() => setIsTransitioning(true)}
              style={{
                padding: 'var(--space-3) var(--space-8)',
                fontSize: 'var(--text-lg)',
                boxShadow: '0 0 20px rgba(100, 200, 255, 0.2)',
              }}
            >
              Launch Command Center
            </button>
          </PressFeedback>
          <button
            className="btn btn-outline"
            aria-label="Explore Platform Features"
            style={{ padding: 'var(--space-3) var(--space-8)', fontSize: 'var(--text-lg)' }}
          >
            API Docs
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isTransitioning && <CinematicTransition onComplete={() => setIsTransitioning(false)} />}
      </AnimatePresence>
    </section>
  );
}
