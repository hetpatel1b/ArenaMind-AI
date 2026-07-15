'use client';

import React, { useRef, useEffect } from 'react';
import { useMap } from '../context/MapContext';

export function ComparisonSlider() {
  const { state, dispatch } = useMap();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const pct = (e.clientX / window.innerWidth) * 100;
      dispatch({ type: 'SET_COMPARISON_SPLIT', payload: Math.max(5, Math.min(95, pct)) });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dispatch]);

  if (!state.comparisonMode) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${state.comparisonSplitX}%`,
        width: '2px',
        backgroundColor: 'var(--ai-accent)',
        cursor: 'col-resize',
        zIndex: 200,
        transform: 'translateX(-50%)',
        boxShadow: '0 0 10px var(--ai-accent)',
      }}
      onMouseDown={() => {
        isDragging.current = true;
        document.body.style.userSelect = 'none';
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '24px',
          height: '40px',
          backgroundColor: 'var(--bg-surface-active)',
          border: '2px solid var(--ai-accent)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
        }}
      >
        <div style={{ width: '2px', height: '16px', backgroundColor: 'var(--text-secondary)' }} />
        <div style={{ width: '2px', height: '16px', backgroundColor: 'var(--text-secondary)' }} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '120px',
          right: '12px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}
      >
        CURRENT REALITY
      </div>

      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '12px',
          color: 'var(--ai-accent)',
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}
      >
        PREDICTED OUTCOME (+{state.timelineOffset}m)
      </div>
    </div>
  );
}
