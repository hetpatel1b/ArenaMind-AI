'use client';

import React, { useEffect, useRef } from 'react';
import { useResourceEngine, OperationalResource } from '../hooks/useResourceEngine';
import { useMap } from '../context/MapContext';

const getColorForType = (type: string, alpha: number) => {
  switch (type) {
    case 'security':
      return `rgba(56, 189, 248, ${alpha})`; // Blue
    case 'medical':
      return `rgba(239, 68, 68, ${alpha})`; // Red
    case 'police':
      return `rgba(59, 130, 246, ${alpha})`; // Darker Blue
    case 'fire':
      return `rgba(249, 115, 22, ${alpha})`; // Orange
    case 'maintenance':
      return `rgba(250, 204, 21, ${alpha})`; // Yellow
    case 'volunteers':
      return `rgba(34, 197, 94, ${alpha})`; // Green
    case 'vip':
      return `rgba(168, 85, 247, ${alpha})`; // Purple
    case 'vehicles':
      return `rgba(148, 163, 184, ${alpha})`; // Slate
    default:
      return `rgba(255, 255, 255, ${alpha})`;
  }
};

export function ResourceLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resourcesRef } = useResourceEngine();
  const { state, dispatch } = useMap();

  // Track past positions for trails
  const trailsRef = useRef<Record<string, { x: number; y: number }[]>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastRender = performance.now();

    const render = (time: number) => {
      // Calculate delta for trail updates if needed, though simple frame pacing works
      const dt = time - lastRender;
      if (dt > 16) lastRender = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const visibleTypes = new Set([
        'security',
        'medical',
        'police',
        'fire',
        'maintenance',
        'volunteers',
        'vip',
        'vehicles',
      ]); // To be filtered by state.visibleLayers

      const currentZoom = state.viewport.zoom;
      const isClustered = currentZoom < 1.5;

      const clusters: Record<string, { count: number; x: number; y: number; type: string }> = {};

      resourcesRef.current.forEach((res) => {
        if (!state.visibleLayers.has(res.type)) return;

        if (isClustered) {
          // Grid-based clustering
          const gridX = Math.floor(res.x / 100) * 100;
          const gridY = Math.floor(res.y / 100) * 100;
          const key = `${res.type}-${gridX}-${gridY}`;

          if (!clusters[key]) {
            clusters[key] = { count: 1, x: res.x, y: res.y, type: res.type };
          } else {
            clusters[key].count++;
            // average position
            clusters[key].x =
              (clusters[key].x * (clusters[key].count - 1) + res.x) / clusters[key].count;
            clusters[key].y =
              (clusters[key].y * (clusters[key].count - 1) + res.y) / clusters[key].count;
          }
          return; // Skip drawing individual if clustered
        }

        // Draw Trails
        if (!trailsRef.current[res.id]) {
          trailsRef.current[res.id] = [];
        }

        const trail = trailsRef.current[res.id]!;
        // Only add to trail if moving
        if (res.status === 'MOVING' || res.status === 'RESPONDING') {
          if (
            trail.length === 0 ||
            Math.abs(trail[0]!.x - res.x) > 2 ||
            Math.abs(trail[0]!.y - res.y) > 2
          ) {
            trail.unshift({ x: res.x, y: res.y });
          }
        }
        if (trail.length > 20) trail.pop(); // Max trail length
        if (res.status === 'AVAILABLE' && trail.length > 0) trail.pop(); // Fade out when stopped

        if (trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trail[0]!.x, trail[0]!.y);
          for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i]!.x, trail[i]!.y);
          }

          ctx.strokeStyle = getColorForType(res.type, 0.2); // Very subtle trail
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Determine color based on status and type
        let alpha = res.status === 'OFFLINE' ? 0.3 : 1;

        // Focus Engine: Dim irrelevant objects if an object or mission is selected
        const isFocused = state.selectedObjectId === res.id || state.selectedObjects.has(res.id);
        const isFocusModeActive = state.selectedObjectId !== null || state.selectedObjects.size > 0;

        if (isFocusModeActive && !isFocused) {
          alpha *= 0.15; // Deeply dim irrelevant objects
        } else if (state.hoveredResourceType && state.hoveredResourceType !== res.type) {
          alpha *= 0.15; // Dim non-matching hovers
        } else if (state.hoveredResourceType === res.type || isFocused) {
          alpha = 1; // Keep bright
        }

        const baseColor = getColorForType(res.type, alpha);

        ctx.fillStyle = baseColor;

        // Pulse effect if responding
        let radius = 3;
        if (res.status === 'RESPONDING' || res.status === 'BUSY') {
          radius = 3 + Math.sin(time / 200) * 1.5;
        }

        ctx.beginPath();
        ctx.arc(res.x, res.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Selection highlight
        if (state.selectedObjectId === res.id) {
          ctx.beginPath();
          ctx.arc(res.x, res.y, radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      // Draw Clusters
      if (isClustered) {
        Object.values(clusters).forEach((cluster) => {
          if (cluster.count === 1) {
            // Draw single
            ctx.beginPath();
            ctx.arc(cluster.x, cluster.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = getColorForType(cluster.type, 1);
            ctx.fill();
          } else {
            // Draw cluster circle
            const radius = Math.min(15, 8 + cluster.count * 0.5);
            ctx.beginPath();
            ctx.arc(cluster.x, cluster.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = getColorForType(cluster.type, 0.8);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw count
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cluster.count.toString(), cluster.x, cluster.y);
          }
        });
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationId);
  }, [
    state.visibleLayers,
    state.viewport.zoom,
    state.selectedObjectId,
    state.hoveredResourceType,
    state.selectedObjects,
    resourcesRef,
  ]);

  // Hover detection logic
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Only detect hover if not clustered
    if (state.viewport.zoom < 1.5) {
      if (state.hoveredResourceId) {
        dispatch({ type: 'SET_HOVERED_RESOURCE', payload: null });
      }
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Transform mouse coordinates based on pan/zoom
    // We assume the canvas itself is transformed by MapViewport's CSS
    // Wait, the canvas is INSIDE the transformed div.
    // So e.nativeEvent.offsetX/Y are roughly correct to the canvas coordinate system!
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    // Find nearest resource
    let nearest: OperationalResource | null = null;
    let minDist = 15; // Hover radius

    for (const res of resourcesRef.current) {
      if (!state.visibleLayers.has(res.type)) continue;
      const dx = res.x - mouseX;
      const dy = res.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        nearest = res;
      }
    }

    if (nearest && nearest.id !== state.hoveredResourceId) {
      dispatch({ type: 'SET_HOVERED_RESOURCE', payload: nearest.id });
    } else if (!nearest && state.hoveredResourceId) {
      dispatch({ type: 'SET_HOVERED_RESOURCE', payload: null });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.hoveredResourceId) {
      dispatch({ type: 'SET_SELECTED_OBJECT', payload: state.hoveredResourceId });
    } else {
      dispatch({ type: 'SET_SELECTED_OBJECT', payload: null });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => dispatch({ type: 'SET_HOVERED_RESOURCE', payload: null })}
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1200px',
        height: '800px',
        pointerEvents: 'auto', // Must receive pointer events for hover
      }}
    />
  );
}
