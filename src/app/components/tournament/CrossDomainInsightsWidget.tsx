'use client';

import React from 'react';
import { CrossDomainCorrelation, ExecutiveBriefing } from '../../../lib/tournament/types';

interface Props {
  insights: CrossDomainCorrelation[];
  briefings: ExecutiveBriefing[];
}

export default function CrossDomainInsightsWidget({ insights, briefings }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Executive Storytelling (Correlations) */}
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#0f172a' }}>
          Cross-Domain Intelligence
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {insights.map((insight) => (
            <div
              key={insight.id}
              style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                borderLeft: '4px solid #3b82f6',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#3b82f6',
                  fontWeight: 700,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                {insight.primaryDomain} ↔ {insight.secondaryDomain}
              </div>
              <p
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '15px',
                  color: '#1e293b',
                  lineHeight: 1.5,
                }}
              >
                {insight.narrative}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {insight.dataPoints.map((dp) => (
                  <span
                    key={dp}
                    style={{
                      background: '#e2e8f0',
                      color: '#475569',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {dp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Briefings */}
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#0f172a' }}>
          AI Executive Briefings
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {briefings.map((briefing) => (
            <div
              key={briefing.id}
              style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}
              >
                <strong style={{ color: '#0f172a' }}>{briefing.title}</strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {new Date(briefing.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: '#475569',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}
              >
                {briefing.content.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
