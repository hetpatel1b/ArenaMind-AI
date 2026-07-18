'use client';

import React, { useEffect, useState } from 'react';
import { DemoScenarioEngine } from '@/lib/demo/DemoScenarioEngine';
import { SCENARIOS } from '@/lib/demo/ScenarioEventGenerator';

export function ExecutiveDemoPanel() {
  const [status, setStatus] = useState({
    activeScenario: DemoScenarioEngine.activeScenario,
    timeSeconds: DemoScenarioEngine.timeSeconds,
    isPlaying: DemoScenarioEngine.isPlaying,
  });
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    DemoScenarioEngine.setOnTickCallback((time: number, scenario: (typeof SCENARIOS)[0] | null) => {
      setStatus({
        activeScenario: DemoScenarioEngine.activeScenario,
        timeSeconds: DemoScenarioEngine.timeSeconds,
        isPlaying: DemoScenarioEngine.isPlaying,
      });
    });
  }, []);

  if (!isExpanded) {
    return (
      <div
        onClick={() => setIsExpanded(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(13, 15, 18, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '12px',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
        }}
      >
        <span style={{ color: '#00ffcc' }}>●</span> Executive Demo Panel
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '320px',
        background: 'rgba(13, 15, 18, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: '#fff',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
          <span style={{ color: '#00ffcc', marginRight: '6px' }}>●</span>
          Executive Scenario Controller
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Scenarios */}
        <div>
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: '8px',
              fontWeight: 600,
            }}
          >
            Active Scenario
          </div>
          <select
            value={status.activeScenario?.id || ''}
            onChange={(e) => {
              if (e.target.value) {
                DemoScenarioEngine.loadScenario(e.target.value);
              } else {
                DemoScenarioEngine.resetScenario();
              }
              setStatus({
                activeScenario: DemoScenarioEngine.activeScenario,
                timeSeconds: DemoScenarioEngine.timeSeconds,
                isPlaying: DemoScenarioEngine.isPlaying,
              });
            }}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '8px',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '13px',
            }}
          >
            <option value="" style={{ background: '#0d0f12', color: '#fff' }}>
              -- No Scenario --
            </option>
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id} style={{ background: '#0d0f12', color: '#fff' }}>
                {s.name}
              </option>
            ))}
          </select>
          {status.activeScenario && (
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
              {status.activeScenario.description}
            </div>
          )}
        </div>

        {/* Timeline */}
        {status.activeScenario && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                Timeline
              </div>
              <div style={{ fontSize: '12px', color: '#00ffcc', fontFamily: 'monospace' }}>
                T+{status.timeSeconds}s
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  if (status.isPlaying) DemoScenarioEngine.pause();
                  else DemoScenarioEngine.play();
                  setStatus({
                    activeScenario: DemoScenarioEngine.activeScenario,
                    timeSeconds: DemoScenarioEngine.timeSeconds,
                    isPlaying: DemoScenarioEngine.isPlaying,
                  });
                }}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: status.isPlaying ? 'rgba(255,204,0,0.1)' : 'rgba(0,255,204,0.1)',
                  color: status.isPlaying ? '#ffcc00' : '#00ffcc',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {status.isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                onClick={() => {
                  DemoScenarioEngine.resetScenario();
                  setStatus({
                    activeScenario: DemoScenarioEngine.activeScenario,
                    timeSeconds: DemoScenarioEngine.timeSeconds,
                    isPlaying: DemoScenarioEngine.isPlaying,
                  });
                }}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                RESET
              </button>
            </div>

            <div
              style={{
                marginTop: '12px',
                background: 'rgba(0,0,0,0.5)',
                padding: '8px',
                borderRadius: '6px',
              }}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                Upcoming Events:
              </div>
              {status.activeScenario.events.map((e, idx) => {
                const isPast = status.timeSeconds >= e.timeSeconds;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '11px',
                      color: isPast ? '#475569' : '#e2e8f0',
                      marginTop: '4px',
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        fontFamily: 'monospace',
                        color: isPast ? '#475569' : '#00ffcc',
                      }}
                    >
                      {e.timeSeconds}s
                    </div>
                    <div style={{ flex: 1 }}>{e.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
