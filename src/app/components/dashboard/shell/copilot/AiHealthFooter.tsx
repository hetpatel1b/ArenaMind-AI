import React from 'react';
import { useTelemetry } from '@/lib/hooks/useLiveTelemetry';

export function AiHealthFooter() {
  const inferenceTime = useTelemetry(['31ms', '34ms', '29ms', '32ms'], 10000);

  return (
    <div
      style={{
        padding: 'var(--space-4)',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '9px',
        color: 'var(--text-tertiary)',
        fontFamily: 'monospace',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-2)',
        opacity: 0.7,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>AI_CORE</span>
        <span style={{ color: 'var(--status-success)' }}>HEALTHY</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>INFERENCE</span>
        <span>{inferenceTime}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>MODELS</span>
        <span>5 ACTIVE</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>CONTEXT</span>
        <span style={{ color: 'var(--ai-accent)' }}>UPDATED</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gridColumn: 'span 2' }}>
        <span>TOOL_ACCESS</span>
        <span style={{ color: 'var(--status-success)' }}>CONNECTED</span>
      </div>
    </div>
  );
}
