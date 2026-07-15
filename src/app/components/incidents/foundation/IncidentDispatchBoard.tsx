import React from 'react';
import { Resource } from './IncidentTypes';

export function IncidentDispatchBoard({ resources }: { resources: Resource[] }) {
  return (
    <div
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Tactical Dispatch
        </h2>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {resources.length} UNITS
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(['AVAILABLE', 'STANDBY', 'RETURNING', 'DISPATCHED', 'BUSY'] as const).map((status) => {
          const units = resources.filter((r) => r.status === status);
          if (units.length === 0) return null;

          return (
            <div
              key={status}
              style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' }}
            >
              <div
                style={{
                  fontSize: '9px',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  paddingLeft: '4px',
                  marginBottom: '4px',
                }}
              >
                {status}
              </div>

              {units.map((unit) => (
                <div
                  key={unit.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    height: '40px',
                    background: 'rgba(255,255,255,0.02)',
                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                    gap: '12px',
                  }}
                >
                  {/* Status */}
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background:
                        status === 'AVAILABLE'
                          ? '#34c759'
                          : status === 'DISPATCHED'
                            ? '#3e82f7'
                            : '#ff9f0a',
                      flexShrink: 0,
                    }}
                  />

                  {/* Unit */}
                  <div
                    style={{
                      width: '50px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {unit.type.substring(0, 3)}-{unit.id.split('-')[1]}
                  </div>

                  {/* ETA */}
                  <div
                    style={{
                      width: '40px',
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
                    }}
                  >
                    {unit.eta}
                  </div>

                  {/* Battery */}
                  <div
                    style={{
                      width: '32px',
                      fontSize: '10px',
                      color: unit.battery < 20 ? '#ff453a' : 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                    title="Battery"
                  >
                    ⚡{unit.battery}%
                  </div>

                  {/* Signal */}
                  <div
                    style={{
                      width: '32px',
                      fontSize: '10px',
                      color: unit.radioStatus === 'DEGRADED' ? '#ff9f0a' : 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                    title="Signal"
                  >
                    📶{unit.radioStatus === 'DEGRADED' ? 'POOR' : 'OK'}
                  </div>

                  {/* Crew */}
                  <div
                    style={{
                      width: '24px',
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                    title="Crew"
                  >
                    👥{unit.crewSize || 1}
                  </div>

                  {/* Assignment */}
                  <div
                    style={{
                      flex: 1,
                      fontSize: '10px',
                      color: '#3e82f7',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {unit.assignedMissionId || 'Unassigned'}
                  </div>

                  {/* Action */}
                  {status === 'AVAILABLE' || status === 'STANDBY' ? (
                    <button
                      style={{
                        background: 'rgba(62,130,247,0.1)',
                        border: '1px solid rgba(62,130,247,0.3)',
                        color: '#3e82f7',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      SEND
                    </button>
                  ) : (
                    <div
                      style={{
                        fontSize: '9px',
                        color: 'var(--text-secondary)',
                        padding: '2px 4px',
                        flexShrink: 0,
                      }}
                    >
                      BUSY
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
