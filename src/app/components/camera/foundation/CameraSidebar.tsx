'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraWorkspace } from './useCameraWorkspace';
import { CameraSmartSearch } from './CameraSmartSearch';

export function CameraSidebar() {
  const { state, dispatch } = useCameraWorkspace();
  const { groups, selectedGroupId, cameras } = state;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.1) transparent',
      }}
    >
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: '#0D0F12',
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>Camera Groups</span>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Collapse
        </button>
      </div>

      <CameraSmartSearch />

      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span
          style={{
            fontSize: '11px',
            color: '#64748B',
            textTransform: 'uppercase',
            marginBottom: '8px',
            display: 'block',
          }}
        >
          Grid Layout
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 4, 9, 16].map((num) => (
            <button
              key={num}
              onClick={() => dispatch({ type: 'SET_GRID_LAYOUT', payload: num })}
              style={{
                flex: 1,
                background:
                  state.gridLayout === num ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${state.gridLayout === num ? 'rgba(56, 189, 248, 0.5)' : 'transparent'}`,
                color: state.gridLayout === num ? '#38BDF8' : '#94A3B8',
                borderRadius: '4px',
                padding: '6px 0',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px' }}>
        {groups.map((group) => {
          const isSelected = selectedGroupId === group.id;
          const groupCameras = cameras.filter((c) => c.groupId === group.id);

          return (
            <React.Fragment key={group.id}>
              <div
                onClick={() =>
                  dispatch({ type: 'SELECT_GROUP', payload: isSelected ? null : group.id })
                }
                style={{
                  padding: '12px',
                  margin: '4px 0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.3)' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    color: isSelected ? '#38BDF8' : '#94A3B8',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {group.name}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748B',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 6px',
                    borderRadius: '12px',
                  }}
                >
                  {group.cameraCount}
                </span>
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {groupCameras.length > 0 ? (
                      groupCameras.map((cam) => (
                        <div
                          key={cam.id}
                          onClick={() => {
                            dispatch({ type: 'SELECT_CAMERA', payload: cam.id });
                            dispatch({ type: 'SET_WORKSPACE_MODE', payload: 'PTZ' as any });
                          }}
                          style={{
                            padding: '10px 12px 10px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            cursor: 'pointer',
                            background:
                              state.selectedCameraId === cam.id
                                ? 'rgba(255,255,255,0.03)'
                                : 'transparent',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ fontSize: '12px', color: '#E2E8F0' }}>{cam.name}</span>
                            <span
                              style={{
                                fontSize: '10px',
                                color: cam.status === 'ONLINE' ? '#10B981' : '#EF4444',
                              }}
                            >
                              {cam.status}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '10px',
                              color: '#64748B',
                            }}
                          >
                            <span>{cam.fps} FPS</span>
                            <span>{cam.latency}ms Latency</span>
                            <span
                              style={{
                                color: cam.recording === 'RECORDING' ? '#F43F5E' : '#64748B',
                              }}
                            >
                              {cam.recording === 'RECORDING' ? 'REC' : 'PAUSED'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '10px 32px', fontSize: '11px', color: '#64748B' }}>
                        No active cameras loaded.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
