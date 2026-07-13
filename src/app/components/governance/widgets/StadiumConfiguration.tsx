'use client';

import React from 'react';

interface StadiumConfigurationProps {
  stadiumData: any;
}

export function StadiumConfiguration({ stadiumData }: StadiumConfigurationProps) {
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
        minHeight: '400px',
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
        <div>
          <h3
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Environment Configuration
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Stadium & Operational Parameters
          </span>
        </div>
        <button
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--text-primary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Edit Config
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              Primary Venue
            </span>
            <span
              style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              {stadiumData.name}
            </span>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              Max Capacity
            </span>
            <span
              style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              {stadiumData.capacity.toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Operational Zones
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {stadiumData.zones?.map((zone: any) => (
              <div
                key={zone.id}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: zone.isActive
                      ? 'var(--status-success)'
                      : 'var(--status-critical)',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {zone.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            System Geography
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Timezone:</span>{' '}
              {stadiumData.timezone}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Location:</span> {stadiumData.city},{' '}
              {stadiumData.country}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
