'use client';

import React from 'react';

interface TeamStatusBoardProps {
  resources: SafeAny[];
}

export function TeamStatusBoard({ resources }: TeamStatusBoardProps) {
  // Filter for human/team resources rather than equipment if possible,
  // or just take the first 10 for a virtualized-style list
  const teams = resources.slice(0, 10);

  return (
    <div className="glass-panel" style={{ minHeight: '350px' }}>
      <div className="glass-panel-header">
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
        <span className="badge badge-live">Live Tracking</span>
      </div>

      <div
        className="flex-col"
        style={{
          flex: 1,
          overflowY: 'auto',
          gap: 'var(--space-2)',
          paddingRight: '4px',
        }}
        role="feed"
        aria-label="Active Units Feed"
      >
        {teams.map((team) => {
          let statusColor = 'var(--status-success)'; // available
          if (team.status === 'deployed' || team.status === 'incident_assigned')
            statusColor = 'var(--status-warning)';
          if (team.status === 'unavailable' || team.status === 'off_duty')
            statusColor = 'var(--status-critical)';

          // Calculate fatigue based on time since resource record created (assuming 8 hour shift max = 100%)
          // If no created/updated time, default to 0
          // eslint-disable-next-line react-hooks/purity
          const shiftStart = new Date(team.createdAt || Date.now()).getTime();
          // eslint-disable-next-line react-hooks/purity
          const elapsedHours = (Date.now() - shiftStart) / (1000 * 60 * 60);
          const fatigueLevel = Math.min(Math.round((elapsedHours / 8) * 100), 100);
          const isFatigued = fatigueLevel > 75;

          return (
            <article
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
              aria-label={`${team.name} status: ${team.status.replace('_', ' ')}`}
            >
              <div className="flex-col" style={{ gap: '2px' }}>
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
                  className="text-subtle"
                  style={{ fontSize: '10px', textTransform: 'capitalize' }}
                >
                  {team.zone?.name || 'Mobile'} • {team.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex-col" style={{ gap: '2px', alignItems: 'center' }}>
                <span
                  className="text-subtle"
                  style={{ fontSize: '10px', textTransform: 'uppercase' }}
                >
                  Fatigue
                </span>
                <div className="flex-between" style={{ gap: '4px' }}>
                  <div
                    className="progress-track"
                    style={{ width: '32px' }}
                    role="progressbar"
                    aria-valuenow={fatigueLevel}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${team.name} fatigue level`}
                  >
                    <div
                      className="progress-fill"
                      style={{
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
                    aria-hidden="true"
                  >
                    {fatigueLevel}%
                  </span>
                </div>
              </div>

              <div className="flex-col" style={{ gap: '2px', alignItems: 'flex-end' }}>
                {team.status === 'deployed' ? (
                  <>
                    <span
                      className="text-subtle"
                      style={{ fontSize: '10px', textTransform: 'uppercase' }}
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
                      className="text-subtle"
                      style={{ fontSize: '10px', textTransform: 'uppercase' }}
                    >
                      Shift
                    </span>
                    <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                      08:00 - 16:00
                    </span>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
