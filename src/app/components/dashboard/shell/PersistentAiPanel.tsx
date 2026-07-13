'use client';

import React from 'react';

export function PersistentAiPanel() {
  return (
    <aside
      className="glass-panel"
      style={{
        width: '320px',
        borderLeft: '1px solid var(--border-subtle)',
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      aria-label="AI Copilot Panel"
    >
      <div
        style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ai-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
          Copilot
        </span>
      </div>

      <div
        style={{
          flex: 1,
          padding: 'var(--space-4)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        {/* Placeholder Conversation / Recommendations */}
        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginTop: 'var(--space-8)',
          }}
        >
          Monitoring real-time telemetry...
        </div>

        {/* Mock Recommendation Card */}
        <div
          className="card animate-fade-in"
          style={{ borderColor: 'var(--ai-accent)', backgroundColor: 'var(--bg-app)' }}
        >
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--ai-accent)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-1)',
            }}
          >
            PREDICTIVE ALERT
          </div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
            }}
          >
            High probability of congestion at Gate 4 in 15 minutes.
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: 'var(--text-xs)', padding: 'var(--space-1)' }}
          >
            View Routing Options
          </button>
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
        <input
          type="text"
          className="input focus-ring"
          placeholder="Ask Copilot..."
          aria-label="Message AI Copilot"
        />
      </div>
    </aside>
  );
}
