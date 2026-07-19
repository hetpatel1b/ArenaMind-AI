'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export function AiRootCauseAnalysis({ matchId }: { matchId?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [causes, setCauses] = useState<SafeAny[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecommendations = async () => {
    if (!matchId) return;
    try {
      const res = await fetch(
        `/api/v1/matches/${matchId}/ai/recommendations?feature=incident_classify`
      );
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setCauses(json.data[0].data || []); // The JSON array is stored in the `data` field of the recommendation
      }
    } catch (err) {
      LoggerService.error('Error fetching root cause classifications:', err);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchRecommendations();
  }, [matchId]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const generateRootCause = async () => {
    if (!matchId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/matches/${matchId}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'incident_classify' }),
      });
      if (!res.ok) throw new Error('Generation failed');
      await fetchRecommendations();
    } catch (err) {
      setError('Failed to generate root cause analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '400px',
        maxHeight: '450px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--status-critical)"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Root Cause Analysis
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Identified Operational Failures
          </span>
        </div>
        <button
          onClick={generateRootCause}
          disabled={loading}
          style={{
            backgroundColor: 'var(--ai-accent)',
            color: '#000',
            border: 'none',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--status-critical)', fontSize: '12px' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {causes.length > 0 ? (
          causes.map((cause, idx) => (
            <motion.div
              key={idx}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(255, 59, 48, 0.05)',
                border: '1px solid rgba(255, 59, 48, 0.1)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--status-critical)',
                    fontWeight: 600,
                  }}
                >
                  {cause.observation}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--status-critical)',
                    fontWeight: 700,
                    backgroundColor: 'rgba(255,59,48,0.1)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}
                >
                  {cause.confidence}% CONF
                </span>
              </div>

              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Reason: </span>{' '}
                {cause.reason}
              </div>

              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Evidence: </span>{' '}
                {cause.evidence}
              </div>

              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--status-warning)',
                  backgroundColor: 'rgba(255, 149, 0, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
              >
                <span style={{ fontWeight: 600 }}>Future Impact: </span> {cause.impact}
              </div>
            </motion.div>
          ))
        ) : (
          <div
            style={{
              color: 'var(--text-tertiary)',
              fontSize: '13px',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            {loading
              ? 'AI is analyzing live telemetry data...'
              : 'No root cause analyses available. Click generate to request AI insights.'}
          </div>
        )}
      </div>
    </div>
  );
}
