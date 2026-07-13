'use client';

import React from 'react';

interface InteractiveIncidentMapProps {
  zones: any[];
  incidents: any[];
  selectedIncidentId: string | null;
}

export function InteractiveIncidentMap({
  zones,
  incidents,
  selectedIncidentId,
}: InteractiveIncidentMapProps) {
  const getSeverityColor = (tier: number) => {
    if (tier === 1) return 'rgba(255, 59, 48, 1)';
    if (tier === 2) return 'rgba(255, 149, 0, 1)';
    return 'rgba(10, 132, 255, 1)';
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 'var(--space-4)', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-md)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Tactical Map Overlay
        </h3>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          Incident locations & response vectors
        </p>
      </div>

      {/* Abstract Stadium Representation */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '60%',
            height: '40%',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '120px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Pitch */}
          <div
            style={{
              width: '50%',
              height: '30%',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '4px',
            }}
          />

          {/* Incidents mapped loosely around the stadium layout */}
          {incidents.map((incident, idx) => {
            const isSelected = incident.id === selectedIncidentId;
            const color = getSeverityColor(incident.severityTier);

            // Generate deterministic but "scattered" positions based on index for the mockup
            // In reality, this would use geometry data from the zone
            const angle = idx * 137.5 * (Math.PI / 180);
            const radius = isSelected ? 45 : 35 + (idx % 20); // % from center
            const top = `${50 + radius * Math.sin(angle)}%`;
            const left = `${50 + radius * Math.cos(angle)}%`;

            return (
              <div
                key={incident.id}
                style={{
                  position: 'absolute',
                  top,
                  left,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isSelected ? 20 : 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Ping animation for selected */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      opacity: 0.3,
                      animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                    }}
                  />
                )}

                <div
                  style={{
                    width: isSelected ? '16px' : '12px',
                    height: isSelected ? '16px' : '12px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #FFF' : '1px solid rgba(255,255,255,0.5)',
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />

                {isSelected && (
                  <div
                    style={{
                      marginTop: '4px',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      color: 'white',
                      whiteSpace: 'nowrap',
                      border: `1px solid ${color}`,
                    }}
                  >
                    {incident.zone?.name || 'Target'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS for ping animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `,
        }}
      />
    </div>
  );
}
