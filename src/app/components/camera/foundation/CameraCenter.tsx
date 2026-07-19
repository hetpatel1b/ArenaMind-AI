'use client';

import React, { useCallback, useMemo } from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';
import { CameraWorkspaceMode, CameraData } from './CameraTypes';
import { CameraSimulationCanvas } from './CameraSimulationCanvas';
import { CameraPTZControls } from './CameraPTZControls';
import { CameraEvidenceConsole } from './CameraEvidenceConsole';
import { CameraGISMap } from './CameraGISMap';

export const CameraCenter = React.memo(function CameraCenter() {
  const { state, dispatch } = useCameraWorkspace();
  const { workspaceMode, gridLayout, cameras, selectedCameraId } = state;

  const handleDoubleClick = useCallback(
    (id: string) => {
      dispatch({ type: 'SELECT_CAMERA', payload: id });
      dispatch({ type: 'SET_WORKSPACE_MODE', payload: CameraWorkspaceMode.PTZ });
    },
    [dispatch]
  );

  // Determine grid dimensions
  const columns = Math.ceil(Math.sqrt(gridLayout));
  const rows = Math.ceil(gridLayout / columns);
  const isPTZ = workspaceMode === CameraWorkspaceMode.PTZ;

  const renderedCameras = useMemo(() => {
    return Array.from({ length: isPTZ ? 1 : gridLayout }).map((_, i) => {
      const cam = isPTZ
        ? cameras.find((c) => c.id === selectedCameraId) || cameras[0]
        : cameras[i % cameras.length]; // Mock population

      return cam;
    });
  }, [gridLayout, isPTZ, cameras, selectedCameraId]);

  // Render sub-views based on mode
  if (workspaceMode === CameraWorkspaceMode.EVIDENCE) {
    return <CameraEvidenceConsole />;
  }

  if (workspaceMode === CameraWorkspaceMode.MAP) {
    return <CameraGISMap />;
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: '#040506',
        padding: '16px',
        gap: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Top navigation for center workspace */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          zIndex: 10,
          background: 'rgba(255,255,255,0.03)',
          padding: '8px',
          borderRadius: '8px',
        }}
      >
        <TabButton
          mode={CameraWorkspaceMode.GRID}
          current={workspaceMode}
          label="LIVE GRID"
          dispatch={dispatch}
        />
        <TabButton
          mode={CameraWorkspaceMode.PTZ}
          current={workspaceMode}
          label="PTZ OPERATIONS"
          dispatch={dispatch}
        />
        <TabButton
          mode={CameraWorkspaceMode.MAP}
          current={workspaceMode}
          label="GIS TACTICAL"
          dispatch={dispatch}
        />
        <TabButton
          mode={CameraWorkspaceMode.EVIDENCE}
          current={workspaceMode}
          label="EVIDENCE & INVESTIGATION"
          dispatch={dispatch}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: isPTZ ? '1fr' : `repeat(${columns}, 1fr)`,
          gridTemplateRows: isPTZ ? '1fr' : `repeat(${rows}, 1fr)`,
          gap: '8px',
          position: 'relative',
        }}
      >
        {/* Render grid cells */}
        {renderedCameras.map((cam, i) => {
          if (!cam) return null;

          return (
            <CameraGridCell
              key={`${cam.id}-${i}`}
              cam={cam}
              isFocused={isPTZ}
              isMainSimulation={isPTZ || i === 0}
              onDoubleClick={() => handleDoubleClick(cam.id)}
            />
          );
        })}

        {isPTZ && <CameraPTZControls />}
      </div>
    </div>
  );
});

const CameraGridCell = React.memo(function CameraGridCell({
  cam,
  isFocused,
  isMainSimulation,
  onDoubleClick,
}: {
  cam: CameraData;
  isFocused: boolean;
  isMainSimulation: boolean;
  onDoubleClick: () => void;
}) {
  return (
    <div
      onDoubleClick={onDoubleClick}
      style={{
        background: '#0D0F12',
        border: isFocused ? '2px solid #38BDF8' : '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      aria-label={`Camera ${cam.name}`}
    >
      {/* If it's the main focused view, render the living simulation */}
      {isMainSimulation && (
        <div style={{ position: 'absolute', inset: 0, opacity: isFocused ? 1 : 0.5 }}>
          <CameraSimulationCanvas />
        </div>
      )}

      {/* Overlays / Badges */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          right: 8,
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: cam.status === 'ONLINE' ? '#10B981' : '#EF4444',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              color: '#E2E8F0',
              fontWeight: 600,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {cam.name}
          </span>
        </div>
        {cam.recording === 'RECORDING' && (
          <span
            style={{
              background: 'rgba(244, 63, 94, 0.8)',
              color: '#FFF',
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
            }}
          >
            REC
          </span>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          display: 'flex',
          gap: '4px',
          zIndex: 10,
        }}
      >
        <span
          style={{
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '9px',
            color: '#94A3B8',
          }}
        >
          {cam.fps} FPS
        </span>
        <span
          style={{
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '9px',
            color: '#38BDF8',
          }}
        >
          {cam.aiModels[0]}
        </span>
      </div>
    </div>
  );
});

const TabButton = React.memo(function TabButton({ mode, current, label, dispatch }: SafeAny) {
  const isActive = current === mode;
  return (
    <button
      onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: mode })}
      aria-label={`Switch to ${label}`}
      style={{
        background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
        border: 'none',
        borderRadius: '6px',
        padding: '6px 12px',
        color: isActive ? '#E2E8F0' : '#94A3B8',
        fontSize: '12px',
        fontWeight: isActive ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
});
