import React from 'react';
import { BehaviorCard } from './BehaviorCard';
import { BehaviorTelemetry } from '../hooks/useCrowdTelemetry';

export const BehaviorIntelligence = React.memo(function BehaviorIntelligence({
  behavior,
}: {
  behavior: BehaviorTelemetry;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '380px',
        overflowY: 'auto',
        background: 'var(--bg-app, #0F1115)',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '12px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Behavior Intelligence
        </h3>
        <div
          style={{
            fontSize: '11px',
            padding: '4px 8px',
            background: 'rgba(62,130,247,0.1)',
            color: '#3e82f7',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          AI Analysing
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
        }}
      >
        <BehaviorCard
          metric={{ label: 'Flow Stability', unit: '%', ...behavior.flowStability, confidence: 94 }}
        />
        <BehaviorCard
          metric={{ label: 'Crowd Mood', unit: '/100', ...behavior.crowdMood, confidence: 88 }}
        />
        <BehaviorCard
          metric={{
            label: 'Compression Risk',
            unit: '%',
            ...behavior.compressionRisk,
            confidence: 91,
          }}
        />
        <BehaviorCard
          metric={{ label: 'Queue Health', unit: '%', ...behavior.queueHealth, confidence: 96 }}
        />
      </div>

      <div
        style={{
          marginTop: '8px',
          padding: '12px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #A0A5B1)' }}>
          Primary Movement Direction
        </div>
        <div
          style={{ fontSize: '13px', fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}
        >
          {behavior.movementDirection}
        </div>
      </div>
    </div>
  );
});
