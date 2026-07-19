'use client';

import React from 'react';
import { AssistanceMode, AdaptiveRecommendation } from '../../../lib/inclusive/types';

interface Props {
  mode: AssistanceMode;
  recommendations: AdaptiveRecommendation[];
}

export default function InclusiveCopilotUI({ mode, recommendations }: Props) {
  // Adaptive Styles based on Assistance Mode
  const isHighContrast = mode === 'HIGH_CONTRAST';
  const isVoiceFriendly = mode === 'VOICE_FRIENDLY';
  const isCalm = mode === 'CALM';

  const containerStyle: React.CSSProperties = {
    background: isHighContrast ? '#000' : isCalm ? '#e0f2fe' : 'rgba(255, 255, 255, 0.05)',
    color: isHighContrast ? '#fff' : isCalm ? '#0f172a' : '#fff',
    border: isHighContrast ? '4px solid #fff' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isHighContrast ? '24px' : '20px',
    fontWeight: isHighContrast ? 700 : 500,
    margin: 0,
    color: isHighContrast ? '#ffff00' : isCalm ? '#0284c7' : '#38bdf8',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        {isVoiceFriendly && '🔊 '}
        Adaptive AI Assistant
      </h2>

      {isVoiceFriendly && (
        <div
          style={{
            padding: '12px',
            background: 'rgba(56,189,248,0.1)',
            borderRadius: '8px',
            color: '#38bdf8',
          }}
        >
          Screen reader optimization is active. High-verbosity mode enabled.
        </div>
      )}

      {recommendations.length === 0 ? (
        <p>No specific adaptive recommendations at this time.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                background: isHighContrast ? '#111' : isCalm ? '#fff' : 'rgba(255,255,255,0.1)',
                border: isHighContrast ? '2px solid #fff' : 'none',
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>
                {rec.title}
              </h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.5 }}>
                {rec.reason}
              </p>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}
              >
                <div>
                  <strong>Accessibility:</strong> {rec.accessibilityConsiderations}
                </div>
                <div>
                  <strong>Safety:</strong> {rec.safetyImpact}
                </div>
                <div>
                  <strong>Benefit:</strong> {rec.expectedBenefit}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
