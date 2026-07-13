'use client';

import React from 'react';

interface TeamStatusBoardProps {
  resources: any[];
}

export function TeamStatusBoard({ resources }: TeamStatusBoardProps) {
  // Filter for human/team resources rather than equipment if possible,
  // or just take the first 10 for a virtualized-style list
  const teams = resources.slice(0, 10);

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
        minHeight: '350px',
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
          }}
        >
          Active Units Status
        </h3>
        <span
          style={{
            fontSize: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: 'var(--text-tertiary)',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          Live Tracking
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          paddingRight: '4px',
        }}
      >
        {teams.map((team) => {
          let statusColor = 'var(--status-success)'; // available
          if (team.status === 'deployed' || team.status === 'incident_assigned')
            statusColor = 'var(--status-warning)';
          if (team.status === 'unavailable' || team.status === 'off_duty')
            statusColor = 'var(--status-critical)';

          // Simulate fatigue level based on name hash or just random for mockup
          const fatigueLevel = (team.name.length * 7) % 100;
          const isFatigued = fatigueLevel > 75;

          return (
            <div
              key={team.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: 'var(--space-3)',
                alignItems: 'center',
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                borderLeft: `2px solid ${statusColor}`,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}
                >
                  {team.name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    textTransform: 'capitalize',
                  }}
                >
                  {team.zone?.name || 'Mobile'} • {team.status.replace('_', ' ')}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Fatigue
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '4px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${fatigueLevel}%`,
                        backgroundColor: isFatigued ? 'var(--status-critical)' : 'var(--ai-accent)',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      color: isFatigued ? 'var(--status-critical)' : 'var(--text-secondary)',
                    }}
                  >
                    {fatigueLevel}%
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  alignItems: 'flex-end',
                }}
              >
                {team.status === 'deployed' ? (
                  <>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                      }}
                    >
                      ETA
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--status-warning)',
                        fontWeight: 600,
                      }}
                    >
                      2m 45s
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Shift
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      08:00 - 16:00
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
