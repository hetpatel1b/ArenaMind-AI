'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

interface FutureRecommendationsProps {
  matchId?: string;
  initialRecommendations?: SafeAny[];
}

export function FutureRecommendations({
  matchId,
  initialRecommendations = [],
}: FutureRecommendationsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [recommendations, setRecommendations] = useState<SafeAny[]>(initialRecommendations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecommendations = async () => {
    if (!matchId) return;
    try {
      const res = await fetch(
        `/api/v1/matches/${matchId}/ai/recommendations?feature=operational_summary`
      );
      const json = await res.json();
      if (json.data) {
        setRecommendations(json.data);
      }
    } catch (err) {
      LoggerService.error('Error fetching future recommendations:', err);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!initialRecommendations.length) {
      fetchRecommendations();
    }
  }, [matchId]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const generateRecommendations = async () => {
    if (!matchId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/matches/${matchId}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'operational_summary' }),
      });
      if (!res.ok) throw new Error('Generation failed');
      await fetchRecommendations();
    } catch (err) {
      setError('Failed to generate future recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (recId: string, action: 'accepted' | 'dismissed') => {
    try {
      await fetch(`/api/v1/matches/${matchId}/ai/recommendations/${recId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      // Optimistic update
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, actionTaken: action } : r))
      );
    } catch (err) {
      LoggerService.error('Failed to update recommendation action');
    }
  };

  const activeOps = recommendations.filter(
    (r) => r.featureName === 'operational_summary' && !r.actionTaken
  );

  // Also parse data if it's nested
  const renderItem = (rec: SafeAny, data: SafeAny, idx: number) => {
    const confidence = Math.round((rec.confidenceScore || 0) * 100);
    return (
      <motion.div
        key={rec.id + idx}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: idx * 0.1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          padding: 'var(--space-3)',
          backgroundColor: 'rgba(52, 199, 89, 0.05)',
          border: '1px solid rgba(52, 199, 89, 0.1)',
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
              color: 'var(--text-primary)',
              fontWeight: 600,
            }}
          >
            {data.title || data.suggestedAction || 'Recommendation'}
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--status-success)',
              fontWeight: 700,
              backgroundColor: 'rgba(52,199,89,0.1)',
              padding: '2px 4px',
              borderRadius: '4px',
            }}
          >
            {confidence}% CONF
          </span>
        </div>

        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Description: </span>
          {data.description || data.reason || 'No description provided.'}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'var(--status-warning)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Human Review Required
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleAction(rec.id, 'dismissed')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
            <button
              onClick={() => handleAction(rec.id, 'accepted')}
              style={{
                backgroundColor: 'var(--status-success)',
                border: 'none',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Approve
            </button>
          </div>
        </div>
      </motion.div>
    );
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
        }}
      >
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
            stroke="var(--status-success)"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Future Directives
        </h3>
        <button
          onClick={generateRecommendations}
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
          {loading ? 'Generating...' : 'Generate Directives'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--status-critical)', fontSize: '12px' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {activeOps.length > 0 ? (
          activeOps.map((rec, idx) => {
            if (Array.isArray(rec.data)) {
              return (
                <React.Fragment key={rec.id}>
                  {rec.data.map((d: SafeAny, i: number) => renderItem(rec, d, idx + i))}
                </React.Fragment>
              );
            }
            return renderItem(rec, rec.data, idx);
          })
        ) : (
          <div
            style={{
              padding: 'var(--space-4)',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: 'var(--text-sm)',
            }}
          >
            {loading ? 'Generating predictive insights...' : 'No future directives generated yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
