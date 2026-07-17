'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IntelligenceMatchPayload, ReportingPayload } from '../IntelligenceCommandWorkspace';

interface AiExecutiveSummaryProps {
  matchData: IntelligenceMatchPayload;
  reportingPayload: ReportingPayload;
  primaryRecommendation: any | null;
}

export function AiExecutiveSummary({
  matchData,
  reportingPayload,
  primaryRecommendation: initialRecommendation,
}: AiExecutiveSummaryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [recommendation, setRecommendation] = useState<any>(initialRecommendation);
  const [loading, setLoading] = useState(false);

  const fetchRecommendation = async () => {
    try {
      const res = await fetch(
        `/api/v1/matches/${matchData.id}/ai/recommendations?feature=executive_summary`
      );
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setRecommendation(json.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!initialRecommendation) fetchRecommendation();
  }, [matchData.id]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const generateSummary = async () => {
    setLoading(true);
    try {
      await fetch(`/api/v1/matches/${matchData.id}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'executive_summary' }),
      });
      await fetchRecommendation();
    } catch (err) {
      console.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const isHealthy = reportingPayload.operationalHealth >= 90;
  const healthColor = isHealthy ? 'var(--status-success)' : 'var(--status-warning)';

  return (
    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
      {/* Decorative gradient for intelligence styling */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, var(--ai-accent) 0%, transparent 70%)`,
          opacity: 0.03,
          filter: 'blur(60px)',
          transform: 'translate(30%, -30%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 'var(--space-6)',
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-2)',
            }}
          >
            <span className="badge badge-ai">Executive Summary</span>
            <span className="text-subtle" style={{ fontSize: 'var(--text-sm)' }}>
              {matchData.venue.name}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            Match {matchData.matchNumber}: {matchData.homeTeam} vs {matchData.awayTeam}
          </h1>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-3)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Attendance: {reportingPayload.attendance.toLocaleString()}
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Phase: {matchData.currentPhase.replace('_', ' ')}
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: healthColor,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              Operational Health: {reportingPayload.operationalHealth}%
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', textAlign: 'right' }}>
          <div className="flex-col">
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Incidents
            </span>
            <span
              style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 700 }}
            >
              {reportingPayload.incidentSummary.resolved}/{reportingPayload.incidentSummary.total}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              Avg: {reportingPayload.incidentSummary.avgResponseTime}
            </span>
          </div>
          <div className="flex-col">
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Transport
            </span>
            <span
              style={{
                fontSize: 'var(--text-lg)',
                color:
                  reportingPayload.transportStatus === 'Severe Congestion'
                    ? 'var(--status-critical)'
                    : 'var(--text-primary)',
                fontWeight: 700,
              }}
            >
              {reportingPayload.transportStatus}
            </span>
          </div>
        </div>
      </header>

      {recommendation && (
        <div
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderLeft: `3px solid var(--ai-accent)`,
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-2)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ai-accent)"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                AI Post-Match Assessment & Recommendation
                <button
                  className="btn btn-outline"
                  onClick={generateSummary}
                  disabled={loading}
                  aria-label={loading ? 'Generating AI Summary' : 'Regenerate AI Summary'}
                  aria-busy={loading}
                  style={{ padding: '2px 8px', fontSize: '10px' }}
                >
                  {loading ? 'Generating...' : 'Regenerate'}
                </button>
              </span>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-md)',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {recommendation.data?.suggestedAction ||
                recommendation.data?.headline ||
                'No specific action generated.'}
            </p>
            <div
              style={{
                marginTop: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Analysis:</span>{' '}
              {recommendation.data?.reason || recommendation.data?.criticalInsights?.join(' ')}
            </div>
            <div
              style={{
                marginTop: '4px',
                fontSize: 'var(--text-xs)',
                color: 'var(--status-success)',
              }}
            >
              <span style={{ fontWeight: 600 }}>Projected Improvement:</span>{' '}
              {recommendation.data?.expectedBenefit || recommendation.data?.recommendedAction}{' '}
              (Confidence: {Math.round((recommendation.confidenceScore || 0.98) * 100)}%)
            </div>
          </div>

          {(recommendation.data?.humanApprovalRequired || !recommendation.actionTaken) && (
            <div className="flex-col" style={{ gap: 'var(--space-2)', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--status-warning)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                Human Approval Required
              </span>
              <button
                className="btn-ai-action"
                aria-label="Approve AI Protocol"
                onClick={async () => {
                  try {
                    await fetch(
                      `/api/v1/matches/${matchData.id}/ai/recommendations/${recommendation.id}/action`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'accepted' }),
                      }
                    );
                    setRecommendation({ ...recommendation, actionTaken: 'accepted' });
                  } catch (e) {}
                }}
              >
                Approve Protocol
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
