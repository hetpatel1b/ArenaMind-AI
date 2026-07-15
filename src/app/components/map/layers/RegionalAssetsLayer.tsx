'use client';

import React from 'react';
import { useMap } from '../context/MapContext';
import { useRegionalEngine } from '../hooks/useRegionalEngine';

export function RegionalAssetsLayer() {
  const { state } = useMap();
  const { assets } = useRegionalEngine();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 12,
      }}
    >
      {assets.map((asset) => {
        // Check visibility based on map layers
        if (asset.type === 'HOSPITAL' && !state.visibleLayers.has('hospitals')) return null;
        if (asset.type === 'AIRPORT' && !state.visibleLayers.has('airports')) return null;
        if (asset.type === 'METRO_STATION' && !state.visibleLayers.has('transit')) return null;

        let color = '#94a3b8'; // default slate
        let icon = '📍';

        switch (asset.type) {
          case 'HOSPITAL':
            color = '#ef4444';
            icon = '🏥';
            break;
          case 'AIRPORT':
            color = '#38bdf8';
            icon = '✈️';
            break;
          case 'FIRE_HQ':
            color = '#f97316';
            icon = '🚒';
            break;
          case 'POLICE_HQ':
            color = '#3b82f6';
            icon = '🚓';
            break;
          case 'HOTEL':
            color = '#a855f7';
            icon = '🏨';
            break;
          case 'METRO_STATION':
            color = '#ec4899';
            icon = '🚇';
            break;
        }

        const isCritical = asset.status === 'CRITICAL';
        const isBusy = asset.status === 'BUSY';

        return (
          <div
            key={asset.id}
            style={{
              position: 'absolute',
              left: `${asset.x}px`,
              top: `${asset.y}px`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(10, 12, 16, 0.8)',
                border: `2px solid ${color}`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCritical ? `0 0 16px ${color}` : 'none',
                animation: isCritical ? 'pulse 1.5s infinite' : 'none',
                fontSize: '14px',
              }}
            >
              {icon}
            </div>

            {/* Label */}
            <div
              style={{
                marginTop: '4px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                color: '#fff',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                border: `1px solid ${isCritical ? '#ef4444' : isBusy ? '#f59e0b' : '#333'}`,
                textAlign: 'center',
              }}
            >
              <div>{asset.label}</div>
              {asset.details && (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>
                  {asset.details}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
