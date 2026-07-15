import React from 'react';

export function MissionHistoryWorkspace() {
  const pastMissions = [
    {
      id: 'M-492',
      date: 'Oct 12',
      type: 'Surge Control',
      location: 'South Gate',
      result: 'Success',
      reduction: '18%',
    },
    {
      id: 'M-491',
      date: 'Oct 12',
      type: 'Medical Evac',
      location: 'East Concourse',
      result: 'Success',
      reduction: 'N/A',
    },
    {
      id: 'M-490',
      date: 'Oct 11',
      type: 'Queue Relief',
      location: 'VIP Entrance',
      result: 'Partial',
      reduction: '8%',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderLeft: '1px solid var(--border-subtle, #2A2E37)',
        padding: '24px',
        gap: '24px',
        overflowY: 'auto',
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>Mission History</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pastMissions.map((m) => (
          <div
            key={m.id}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                {m.id} - {m.type}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.date}</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.location}</div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: m.result === 'Success' ? '#34c759' : '#ff9f0a',
                  fontWeight: 600,
                }}
              >
                {m.result}
              </div>
              <div style={{ fontSize: '12px', color: '#3e82f7' }}>Replay Mission ▶</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
