'use client';

import React from 'react';
import { SustainabilityRecommendation } from '../../../../lib/sustainability/types';

interface Props {
  recommendations: SustainabilityRecommendation[];
  analysisText: string;
}

export default function SustainabilityCopilotPanel({ recommendations, analysisText }: Props) {
  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
      }}
    >
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 400 }}>AI Sustainability Copilot</h2>
        <div style={{ fontSize: '12px', color: '#4ade80', marginTop: '4px' }}>
          ● Executive Engine Active
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#e2e8f0' }}>
          {analysisText.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#94a3b8',
                marginBottom: '16px',
              }}
            >
              Actionable Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#38bdf8' }}>
                      {rec.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#4ade80' }}>{rec.confidence}% Conf</div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '12px' }}>
                    {rec.reasoning}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '12px',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      paddingTop: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', width: '60px' }}>Impact:</span>
                      <span style={{ color: '#e2e8f0' }}>{rec.expectedImpact}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', width: '60px' }}>Savings:</span>
                      <span style={{ color: '#4ade80' }}>{rec.estimatedSavings}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', width: '60px' }}>Green:</span>
                      <span style={{ color: '#2dd4bf' }}>{rec.environmentalBenefit}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', width: '60px' }}>Biz:</span>
                      <span style={{ color: '#facc15' }}>{rec.businessBenefit}</span>
                    </div>
                  </div>

                  {rec.isActionable && (
                    <button
                      style={{
                        marginTop: '16px',
                        width: '100%',
                        padding: '8px',
                        background: 'rgba(56,189,248,0.1)',
                        border: '1px solid rgba(56,189,248,0.3)',
                        color: '#38bdf8',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      Approve Action
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
