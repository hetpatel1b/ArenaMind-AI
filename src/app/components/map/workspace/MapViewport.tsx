'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { LayerManager } from '../layers/LayerManager';
import { FloatingControls } from '../controls/FloatingControls';
import { MapHeader } from './MapHeader';
import { useMap } from '../context/MapContext';
import { useCollaboration } from '../context/CollaborationContext';
import { globalResources } from '../hooks/useResourceEngine';
import { CoordinateGrid } from '../viewport/CoordinateGrid';
import { LightingSystem } from '../viewport/LightingSystem';
import { LiveCursorLayer } from '../layers/LiveCursorLayer';
import { AnnotationLayer } from '../layers/AnnotationLayer';

export function MapViewport() {
  const { state, dispatch } = useMap();
  const { collabState, collabDispatch } = useCollaboration();
  const containerRef = useRef<HTMLDivElement>(null);

  // Local state for smooth dragging before updating global Context to avoid React thrashing
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number; color: string }[]>([]);

  const zoom = state.viewport.zoom;

  // Follow mode sync
  useEffect(() => {
    if (collabState.followedOperatorId) {
      const op = collabState.operators.find((o) => o.id === collabState.followedOperatorId);
      if (op && containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const targetPanX = width / 2 - (op.cursor?.x || 600) * op.viewport.zoom;
        const targetPanY = height / 2 - (op.cursor?.y || 400) * op.viewport.zoom;
        setPan((prev) => {
          if (Math.abs(prev.x - targetPanX) < 0.1 && Math.abs(prev.y - targetPanY) < 0.1)
            return prev;
          return { x: targetPanX, y: targetPanY };
        });
        if (zoom !== op.viewport.zoom) {
          dispatch({ type: 'SET_VIEWPORT', payload: { zoom: op.viewport.zoom } });
        }
      }
    }
  }, [collabState.followedOperatorId, collabState.operators, dispatch, zoom]);

  // Center camera on selected object
  useEffect(() => {
    if (!collabState.followedOperatorId && state.selectedObjectId) {
      const found = globalResources.find((r) => r.id === state.selectedObjectId);
      if (found && containerRef.current) {
        // We want to center (found.x, found.y) in the viewport.
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const targetPanX = width / 2 - found.x * zoom;
        const targetPanY = height / 2 - found.y * zoom;
        setPan((prev) => {
          if (Math.abs(prev.x - targetPanX) < 0.1 && Math.abs(prev.y - targetPanY) < 0.1)
            return prev;
          return { x: targetPanX, y: targetPanY };
        });
      }
    }
  }, [collabState.followedOperatorId, state.selectedObjectId, zoom]);

  // Center camera on Bookmark
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      let targetX = 600;
      let targetY = 400;
      let targetZoom = zoom;

      switch (state.activeBookmark) {
        case 'STADIUM':
          targetX = 600;
          targetY = 400;
          targetZoom = 1;
          break;
        case 'CITY':
          targetX = 600;
          targetY = 400;
          targetZoom = 0.5;
          break; // zoomed out to see everything
        case 'AIRPORT':
          targetX = 1050;
          targetY = 100;
          targetZoom = 1.2;
          break;
        case 'TRAFFIC':
          targetX = 900;
          targetY = 300;
          targetZoom = 1.5;
          break;
        case 'MEDICAL':
          targetX = 200;
          targetY = 150;
          targetZoom = 1.5;
          break;
      }

      const targetPanX = width / 2 - targetX * targetZoom;
      const targetPanY = height / 2 - targetY * targetZoom;

      setPan((prev) => {
        if (Math.abs(prev.x - targetPanX) < 0.1 && Math.abs(prev.y - targetPanY) < 0.1) return prev;
        return { x: targetPanX, y: targetPanY };
      });
      if (zoom !== targetZoom) {
        dispatch({ type: 'SET_VIEWPORT', payload: { zoom: targetZoom } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeBookmark, dispatch]);

  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([]);
  const [activeDrawPoints, setActiveDrawPoints] = useState<{ x: number; y: number }[]>([]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || collabState.watchMode) return; // Only left click, disable if in watch mode

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const worldX = (e.clientX - rect.left - rect.width / 2 + pan.x) / zoom;
      const worldY = (e.clientY - rect.top - rect.height / 2 + pan.y) / zoom;

      if (state.activeMapTool === 'MEASURE') {
        setMeasurePoints((prev) => {
          if (prev.length >= 2) return [{ x: worldX, y: worldY }];
          return [...prev, { x: worldX, y: worldY }];
        });
        return;
      }

      if (state.activeMapTool === 'DRAW') {
        setIsDragging(true);
        setActiveDrawPoints([{ x: worldX, y: worldY }]);
        return;
      }

      setIsDragging(true);

      if (state.activeMapTool === 'PAN') {
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      } else if (state.activeMapTool === 'POINTER') {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelectionBox({ startX: x, startY: y, endX: x, endY: y });
      }

      // Add soundless visual feedback (pulse wave) on click
      const color =
        state.emergencyLevel === 'CRITICAL'
          ? 'rgba(239, 68, 68, 0.5)'
          : state.emergencyLevel === 'WARNING'
            ? 'rgba(245, 158, 11, 0.5)'
            : 'rgba(56, 189, 248, 0.5)';
      const newRipple = {
        id: `rip-${Date.now()}`,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        color,
      };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1000);
    },
    [pan, state.activeMapTool, zoom, collabState.watchMode, state.emergencyLevel]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || collabState.watchMode) return;

      if (state.activeMapTool === 'PAN') {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (state.activeMapTool === 'POINTER' && selectionBox) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setSelectionBox((prev) =>
            prev ? { ...prev, endX: e.clientX - rect.left, endY: e.clientY - rect.top } : null
          );
        }
      } else if (state.activeMapTool === 'DRAW') {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const worldX = (e.clientX - rect.left - rect.width / 2 + pan.x) / zoom;
          const worldY = (e.clientY - rect.top - rect.height / 2 + pan.y) / zoom;
          setActiveDrawPoints((prev) => [...prev, { x: worldX, y: worldY }]);
        }
      }
    },
    [isDragging, dragStart, state.activeMapTool, selectionBox, pan, zoom, collabState.watchMode]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (state.activeMapTool === 'POINTER' && selectionBox) {
      setSelectionBox(null);
    } else if (state.activeMapTool === 'DRAW' && activeDrawPoints.length > 1) {
      collabDispatch({
        type: 'ADD_ANNOTATION',
        payload: {
          id: `ann-${Date.now()}`,
          type: 'path',
          points: activeDrawPoints,
          color: '#38bdf8', // Default local drawing color
          operatorId: 'local',
          timestamp: Date.now(),
        },
      });
      setActiveDrawPoints([]);
    }
  }, [state.activeMapTool, selectionBox, activeDrawPoints, collabDispatch]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      let newZoom = zoom - e.deltaY * zoomSensitivity;
      newZoom = Math.max(0.5, Math.min(newZoom, 5)); // Restrict zoom level between 0.5 and 5
      dispatch({ type: 'SET_VIEWPORT', payload: { zoom: newZoom } });
    },
    [zoom, dispatch]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: 'var(--bg-app)',
        borderRight: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <MapHeader />

      {/* Main Spatial Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#0a0a0c', // Dark premium background
          backgroundImage:
            state.emergencyLevel === 'NORMAL'
              ? 'var(--ambient-normal)'
              : state.emergencyLevel === 'WARNING'
                ? 'var(--ambient-warning)'
                : state.emergencyLevel === 'CRITICAL'
                  ? 'var(--ambient-critical)'
                  : 'var(--ambient-recovery)',
          transition: 'background-image var(--duration-layer-fade) var(--ease-in-out)',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <LightingSystem />

        {/* Transformed spatial plane */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.2s var(--ease-spring-gentle)',
            transformOrigin: '0 0',
          }}
        >
          {/* Centered bounding box for layers */}
          <div
            style={{
              position: 'absolute',
              top: '-1000px',
              left: '-1000px',
              width: '2000px',
              height: '2000px',
            }}
          >
            <CoordinateGrid />

            {/* Base map container would go here */}
            <div id="map-canvas-mount" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
            <div id="map-webgl-mount" style={{ position: 'absolute', inset: 0, zIndex: 2 }} />
            <div id="map-svg-mount" style={{ position: 'absolute', inset: 0, zIndex: 3 }} />

            {/* Overlay Layers */}
            <LayerManager />
          </div>
        </div>

        {/* Measurement Line Overlay */}
        {measurePoints.length > 0 && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 90 }}>
            <svg width="100%" height="100%">
              <g
                style={{
                  transform: `translate(calc(50% - ${pan.x}px), calc(50% - ${pan.y}px)) scale(${zoom})`,
                }}
              >
                {measurePoints.map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r={4 / zoom} fill="var(--status-warning)" />
                ))}
                {measurePoints.length === 2 && measurePoints[0] && measurePoints[1] && (
                  <>
                    <line
                      x1={measurePoints[0].x}
                      y1={measurePoints[0].y}
                      x2={measurePoints[1].x}
                      y2={measurePoints[1].y}
                      stroke="var(--status-warning)"
                      strokeWidth={2 / zoom}
                      strokeDasharray={`${4 / zoom} ${4 / zoom}`}
                    />
                    <text
                      x={(measurePoints[0].x + measurePoints[1].x) / 2}
                      y={(measurePoints[0].y + measurePoints[1].y) / 2 - 10 / zoom}
                      fill="var(--status-warning)"
                      fontSize={12 / zoom}
                      textAnchor="middle"
                      style={{ textShadow: '0 0 4px #000' }}
                    >
                      {Math.round(
                        Math.hypot(
                          measurePoints[1].x - measurePoints[0].x,
                          measurePoints[1].y - measurePoints[0].y
                        )
                      )}
                      m
                    </text>
                  </>
                )}
              </g>
            </svg>
          </div>
        )}

        {/* Selection Box overlay */}
        {selectionBox && (
          <div
            style={{
              position: 'absolute',
              border: '1px solid rgba(56, 189, 248, 0.8)',
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              left: Math.min(selectionBox.startX, selectionBox.endX),
              top: Math.min(selectionBox.startY, selectionBox.endY),
              width: Math.abs(selectionBox.endX - selectionBox.startX),
              height: Math.abs(selectionBox.endY - selectionBox.startY),
              pointerEvents: 'none',
              zIndex: 100,
            }}
          />
        )}

        {/* Click Ripples */}
        {ripples.map((r) => (
          <div
            key={r.id}
            style={{
              position: 'absolute',
              left: r.x - 50,
              top: r.y - 50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              border: `2px solid ${r.color}`,
              pointerEvents: 'none',
              zIndex: 99,
              animation: 'rippleWave 0.8s ease-out forwards',
            }}
          />
        ))}

        {/* Global Keyframes for Ripple */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes rippleWave {
            0% { transform: scale(0); opacity: 1; border-width: 4px; }
            100% { transform: scale(2); opacity: 0; border-width: 0px; }
          }
        `,
          }}
        />

        {/* Local Active Draw Points */}
        {activeDrawPoints.length > 1 && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 105 }}>
            <svg width="100%" height="100%">
              <g
                style={{
                  transform: `translate(calc(50% - ${pan.x}px), calc(50% - ${pan.y}px)) scale(${zoom})`,
                }}
              >
                <path
                  d={activeDrawPoints
                    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
                    .join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={4 / zoom}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        )}

        {/* Collaborative Layers */}
        <AnnotationLayer pan={pan} zoom={zoom} />
        <LiveCursorLayer pan={pan} zoom={zoom} />

        {/* Ambient Particles Layer (Fixed to screen, not transformed) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Floating Controls */}
        <FloatingControls />
      </div>
    </div>
  );
}
