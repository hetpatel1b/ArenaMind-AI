'use client';

import React from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraPTZControls() {
  const { state, dispatch } = useCameraWorkspace();
  const camera = state.cameras.find((c) => c.id === state.selectedCameraId);

  if (!camera || !camera.ptz) return null;

  const handlePTZ = (action: { pan?: number; tilt?: number; zoom?: number }) => {
    dispatch({
      type: 'EXECUTE_PTZ',
      payload: {
        pan: camera.ptz!.pan + (action.pan || 0),
        tilt: camera.ptz!.tilt + (action.tilt || 0),
        zoom: camera.ptz!.zoom + (action.zoom || 0),
      },
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        background: 'rgba(13, 15, 18, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#E2E8F0' }}>PTZ Controls</span>
        <button
          onClick={() =>
            dispatch({ type: 'EXECUTE_PTZ', payload: { pan: 0, tilt: 0, zoom: 1, preset: 'Home' } })
          }
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            color: '#94A3B8',
            fontSize: '10px',
            padding: '2px 6px',
            cursor: 'pointer',
          }}
        >
          HOME
        </button>
      </div>

      {/* D-PAD */}
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        aria-label="Directional Pad"
      >
        <button aria-label="Tilt Up" onClick={() => handlePTZ({ tilt: 5 })} style={dpadBtnStyle}>
          ▲
        </button>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button aria-label="Pan Left" onClick={() => handlePTZ({ pan: -5 })} style={dpadBtnStyle}>
            ◀
          </button>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid rgba(56,189,248,0.5)',
            }}
          />
          <button aria-label="Pan Right" onClick={() => handlePTZ({ pan: 5 })} style={dpadBtnStyle}>
            ▶
          </button>
        </div>
        <button aria-label="Tilt Down" onClick={() => handlePTZ({ tilt: -5 })} style={dpadBtnStyle}>
          ▼
        </button>
      </div>

      {/* Zoom */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        aria-label="Zoom Controls"
      >
        <button aria-label="Zoom Out" onClick={() => handlePTZ({ zoom: -1 })} style={zoomBtnStyle}>
          -
        </button>
        <div
          style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, camera.ptz.zoom * 10)}%`,
              height: '100%',
              background: '#38BDF8',
              borderRadius: '2px',
            }}
          />
        </div>
        <button aria-label="Zoom In" onClick={() => handlePTZ({ zoom: 1 })} style={zoomBtnStyle}>
          +
        </button>
      </div>

      <div
        style={{
          fontSize: '10px',
          color: '#64748B',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>P: {camera.ptz.pan.toFixed(1)}°</span>
        <span>T: {camera.ptz.tilt.toFixed(1)}°</span>
        <span>Z: {camera.ptz.zoom.toFixed(1)}x</span>
      </div>
    </div>
  );
}

const dpadBtnStyle = {
  width: '32px',
  height: '32px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px',
  color: '#E2E8F0',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const zoomBtnStyle = { ...dpadBtnStyle, height: '24px', width: '24px' };
