'use client';

import React from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface InteractiveWorkforceMapProps {
  zones: any[];
  resources: any[];
}

export function InteractiveWorkforceMap({ zones, resources }: InteractiveWorkforceMapProps) {
  // Categorize resources roughly for map visualization
  const getResourceColor = (name: string) => {
    const lName = name.toLowerCase();
    if (lName.includes('medic') || lName.includes('health')) return 'rgba(255, 59, 48, 1)'; // Red
    if (lName.includes('sec')) return 'rgba(10, 132, 255, 1)'; // Blue
    if (lName.includes('vol')) return 'rgba(52, 199, 89, 1)'; // Green
    return 'rgba(255, 149, 0, 1)'; // Orange for equipment/other
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
          Tactical Deployment Map
        </h3>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          Active resource positioning & coverage areas
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          zIndex: 10,
          display: 'flex',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 59, 48, 1)',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Medical</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'rgba(10, 132, 255, 1)',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Security</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'rgba(52, 199, 89, 1)',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Volunteer</span>
        </div>
      </div>

      {/* Abstract Venue Representation */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
          <Map
            initialViewState={{ longitude: 51.4903, latitude: 25.4208, zoom: 15 }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            interactive={false}
          />
        </div>

        <div
          style={{
            width: '70%',
            height: '50%',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '160px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
            zIndex: 5,
          }}
        >
          {/* Pitch */}
          <div
            style={{
              width: '40%',
              height: '35%',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              backgroundColor: 'rgba(52, 199, 89, 0.02)',
            }}
          />

          {/* Plotted Resources */}
          {resources.slice(0, 30).map((resource, idx) => {
            const color = getResourceColor(resource.name);

            // Scatter resources around the venue
            const angle = idx * 137.5 * (Math.PI / 180);
            const radius = 30 + (idx % 25); // % from center
            const top = `${50 + radius * Math.sin(angle)}%`;
            const left = `${50 + radius * Math.cos(angle)}%`;

            // Dim off-duty or unavailable resources
            const isAvailable = resource.status === 'available' || resource.status === 'deployed';
            const opacity = isAvailable ? 1 : 0.3;

            return (
              <div
                key={resource.id}
                title={`${resource.name} - ${resource.status}`}
                style={{
                  position: 'absolute',
                  top,
                  left,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Active deployment pulse */}
                {resource.status === 'deployed' && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      opacity: 0.2,
                      animation: 'pulse 2s infinite',
                    }}
                  />
                )}

                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    opacity,
                    boxShadow: isAvailable ? `0 0 6px ${color}` : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(2); opacity: 0; }
        }
      `,
        }}
      />
    </div>
  );
}
