import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { MobilityEngineState } from '../MobilityTypes';

export function ReasoningTab({ engine }: { engine: MobilityEngineState }) {
  const reasoning = engine.copilotReasoning[0];
  if (!reasoning) return <div style={{ color: '#A1A1AA', fontSize: '13px' }}>Awaiting data...</div>;

  return (
    <>
      <ReasoningBlock label="Observation" value={reasoning.observation} color="#A1A1AA" />
      <div
        style={{
          width: '2px',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginLeft: '12px',
        }}
      />
      <ReasoningBlock label="Reasoning" value={reasoning.reasoning} color="#3B82F6" />
      <div
        style={{
          width: '2px',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginLeft: '12px',
        }}
      />
      <ReasoningBlock
        label="Prediction"
        value={reasoning.prediction}
        color={ThemeTokens.colors.warning.default}
      />
      <div
        style={{
          width: '2px',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginLeft: '12px',
        }}
      />
      <ReasoningBlock
        label="Recommendation"
        value={reasoning.recommendation}
        color={ThemeTokens.colors.success.default}
      />
      <div
        style={{
          width: '2px',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginLeft: '12px',
        }}
      />
      <ReasoningBlock label="Expected Impact" value={reasoning.expectedImpact} color="#A1A1AA" />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }}
      >
        <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600 }}>AI CONFIDENCE</span>
        <span style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
          {reasoning.confidence}%
        </span>
      </div>
      <button
        style={{
          padding: '12px',
          background: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Approve & Execute Mission
      </button>
    </>
  );
}

function ReasoningBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '4px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            background: 'transparent',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <span
          style={{
            fontSize: '11px',
            color,
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
        <p style={{ margin: 0, fontSize: '13px', color: '#E4E4E7', lineHeight: 1.5 }}>{value}</p>
      </div>
    </div>
  );
}
