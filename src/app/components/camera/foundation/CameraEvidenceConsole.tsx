'use client';

import React from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraEvidenceConsole() {
  const { state } = useCameraWorkspace();
  const { evidenceQueue } = state;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#080A0C',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#E2E8F0', margin: 0 }}>
          Enterprise Evidence Console
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={actionBtnStyle}>Export Queue</button>
          <button
            style={{
              ...actionBtnStyle,
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38BDF8',
              borderColor: 'rgba(56, 189, 248, 0.3)',
            }}
          >
            + Add Bookmark
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {evidenceQueue.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#0D0F12',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                height: '140px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '4px',
                border: '1px dashed rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '11px', color: '#64748B' }}>Preview Unavailable</span>
            </div>

            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                  {item.timestamp} • Camera: {item.cameraId}
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#E2E8F0',
                }}
              >
                {item.type}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '10px',
                    color: '#38BDF8',
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const actionBtnStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  padding: '8px 16px',
  color: '#E2E8F0',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};
