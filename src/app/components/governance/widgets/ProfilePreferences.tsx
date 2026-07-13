'use client';

import React from 'react';

export function ProfilePreferences() {
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
        minHeight: '280px',
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
            Profile & Preferences
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Local Workspace Settings
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#5E5CE6',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            OM
          </div>
          <div>
            <div
              style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Operations Manager
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              admin@arenamind.ai
            </div>
          </div>
          <button
            style={{
              marginLeft: 'auto',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Dark Mode Theme
            </span>
            <div
              style={{
                width: '36px',
                height: '20px',
                backgroundColor: 'var(--status-success)',
                borderRadius: '10px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  right: '2px',
                  top: '2px',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Reduced Motion (Accessibility)
            </span>
            <div
              style={{
                width: '36px',
                height: '20px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  left: '2px',
                  top: '2px',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Critical Audio Alerts
            </span>
            <div
              style={{
                width: '36px',
                height: '20px',
                backgroundColor: 'var(--status-success)',
                borderRadius: '10px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  right: '2px',
                  top: '2px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
