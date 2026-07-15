'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMap } from '../context/MapContext';
import { LeftToolRail } from '../controls/LeftToolRail';
import { RightAIPanel } from './RightAIPanel';
import { BottomTimeline } from '../timeline/BottomTimeline';
import { MapViewport } from './MapViewport';
import { useMapKeyboardShortcuts } from '../hooks/useMapKeyboardShortcuts';

export function MapGrid() {
  const { state } = useMap();
  const isPanelOpen = state.workspaceMode !== 'NONE';
  const isFullscreen = state.isFullscreen;

  useMapKeyboardShortcuts();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-app)',
      }}
    >
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Tool Rail */}
        {!isFullscreen && (
          <div style={{ width: '72px', flexShrink: 0, zIndex: 50 }}>
            <LeftToolRail />
          </div>
        )}

        {/* Map Viewport Container */}
        <motion.div
          layout
          initial={false}
          style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
        >
          <MapViewport />
        </motion.div>

        {/* Right AI Panel */}
        {!isFullscreen && (
          <motion.div
            layout
            initial={false}
            animate={{ width: isPanelOpen ? 360 : 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            style={{
              flexShrink: 0,
              overflow: 'hidden',
              borderLeft: isPanelOpen ? '1px solid var(--border-subtle)' : 'none',
              zIndex: 40,
            }}
          >
            <div style={{ width: 360, height: '100%' }}>
              <RightAIPanel />
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Timeline */}
      {!isFullscreen && (
        <div style={{ height: '120px', flexShrink: 0, zIndex: 45 }}>
          <BottomTimeline />
        </div>
      )}
    </div>
  );
}
