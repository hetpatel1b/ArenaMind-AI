'use client';

import React from 'react';
import { judgeDemoService } from '../../../lib/tournament/demo/judge-demo.service';
import { JudgeDemoScenario } from '../../../lib/tournament/types';

interface Props {
  onScenarioTriggered: () => void;
}

export default function JudgeDemonstrationPanel({ onScenarioTriggered }: Props) {
  const [state, setState] = React.useState(judgeDemoService.getState());

  const scenarios: { id: JudgeDemoScenario; label: string }[] = [
    { id: 'CROWD_SURGE', label: 'Surge: Al Bayt' },
    { id: 'MEDICAL_EMERGENCY', label: 'Medical: Education City' },
    { id: 'HEAVY_RAIN', label: 'Weather: Heavy Rain' },
    { id: 'TRANSPORT_DISRUPTION', label: 'Transit: Metro Failure' },
    { id: 'LOST_CHILD', label: 'Inclusive: Lost Child' },
    { id: 'ENERGY_SPIKE', label: 'Green: HVAC Spike' },
    { id: 'WASTE_OVERFLOW', label: 'Green: Waste Overflow' },
  ];

  const trigger = (scenario: JudgeDemoScenario) => {
    judgeDemoService.triggerScenario(scenario);
    setState({ ...judgeDemoService.getState() });
    onScenarioTriggered(); // notify parent to refresh multi-venue state
  };

  const reset = () => {
    judgeDemoService.reset();
    setState({ ...judgeDemoService.getState() });
    onScenarioTriggered();
  };

  return (
    <div
      style={{
        background: '#1e1b4b',
        color: '#fff',
        borderRadius: '16px',
        padding: '24px',
        border: '2px solid #818cf8',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '18px',
            color: '#c7d2fe',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🛠️</span> Judge Demonstration Mode
        </h3>
        <button
          onClick={reset}
          style={{
            background: 'transparent',
            color: '#9ca3af',
            border: '1px solid #4b5563',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => trigger(sc.id)}
            style={{
              background: state.activeScenario === sc.id ? '#4f46e5' : '#312e81',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {state.logs.length > 0 && (
        <div
          style={{
            background: '#000',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {state.logs.map((log, idx) => {
            const isSys = log.startsWith('[SYS]');
            const isDet = log.startsWith('Detection:');
            const isRec = log.startsWith('Recommendation:');
            const color = isSys ? '#6b7280' : isDet ? '#ef4444' : isRec ? '#22c55e' : '#e5e7eb';

            return (
              <div key={idx} style={{ color }}>
                {log}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
