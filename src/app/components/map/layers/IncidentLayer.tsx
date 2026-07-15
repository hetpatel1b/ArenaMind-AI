'use client';

import React, { useEffect, useRef } from 'react';
import { useIncidentEngine, Incident } from '../hooks/useIncidentEngine';
import { useMap } from '../context/MapContext';

const getSeverityColor = (severity: string, alpha: number) => {
  switch (severity) {
    case 'Critical':
      return `rgba(239, 68, 68, ${alpha})`; // Deep Red
    case 'Warning':
      return `rgba(245, 158, 11, ${alpha})`; // Amber
    case 'Information':
      return `rgba(56, 189, 248, ${alpha})`; // Blue
    case 'Resolved':
      return `rgba(34, 197, 94, ${alpha})`; // Green
    default:
      return `rgba(255, 255, 255, ${alpha})`;
  }
};

export function IncidentLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { incidentsRef } = useIncidentEngine();
  const { state, dispatch } = useMap();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Always render so CSS opacity can transition smoothly. LayerManager handles visibility toggling.
      const currentZoom = state.viewport.zoom;
      const isClustered = currentZoom < 1.2;
      const clusters: Record<
        string,
        { count: number; x: number; y: number; severities: Set<string> }
      > = {};

      incidentsRef.current.forEach((inc) => {
        // Filter out if not in incidentFilters (unless filters are all off, then show all?)
        // Assuming incidentFilters contains categories or severities. The state initializes with severities + some categories.
        // For simplicity, if it's Resolved, check if 'Resolved' is in filters.
        if (inc.severity === 'Resolved' && !state.incidentFilters.has('Resolved')) return;

        if (isClustered) {
          const gridX = Math.floor(inc.x / 150) * 150;
          const gridY = Math.floor(inc.y / 150) * 150;
          const key = `${gridX}-${gridY}`;

          if (!clusters[key]) {
            clusters[key] = { count: 1, x: inc.x, y: inc.y, severities: new Set([inc.severity]) };
          } else {
            clusters[key].count++;
            clusters[key].x =
              (clusters[key].x * (clusters[key].count - 1) + inc.x) / clusters[key].count;
            clusters[key].y =
              (clusters[key].y * (clusters[key].count - 1) + inc.y) / clusters[key].count;
            clusters[key].severities.add(inc.severity);
          }
          return;
        }

        // Focus Engine logic
        const isFocused = state.selectedIncidentId === inc.id;
        const isFocusModeActive =
          state.selectedIncidentId !== null ||
          state.selectedObjects.size > 0 ||
          state.selectedObjectId !== null;
        let globalAlpha = 1;

        if (isFocusModeActive && !isFocused) {
          globalAlpha = 0.15; // Dim irrelevant incidents
        }

        ctx.globalAlpha = globalAlpha;

        // Draw Risk Zones (Radial Gradients)
        if (inc.severity !== 'Resolved') {
          const baseColor = getSeverityColor(inc.severity, 0.15);
          const outerColor = getSeverityColor(inc.severity, 0);

          // Breathing effect for risk zone
          const breathe = 1 + Math.sin(time / 500) * 0.1;
          const currentRadius = inc.radius * breathe;

          const grad = ctx.createRadialGradient(inc.x, inc.y, 0, inc.x, inc.y, currentRadius);
          grad.addColorStop(0, baseColor);
          grad.addColorStop(1, outerColor);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(inc.x, inc.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Premium Animated Beacon
        const beaconColor = getSeverityColor(inc.severity, 1);

        // Inner core
        ctx.fillStyle = beaconColor;
        ctx.beginPath();
        ctx.arc(inc.x, inc.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Outer rings
        if (inc.severity !== 'Resolved') {
          const ringSpeed =
            inc.severity === 'Critical' ? 800 : inc.severity === 'Warning' ? 1200 : 2000;
          const ringProgress = (time % ringSpeed) / ringSpeed;
          const ringRadius = 6 + ringProgress * 20;
          const ringAlpha = 1 - ringProgress;

          ctx.strokeStyle = getSeverityColor(inc.severity, ringAlpha);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(inc.x, inc.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Selection / Hover highlight
        if (isFocused || state.hoveredIncidentId === inc.id) {
          ctx.beginPath();
          ctx.arc(inc.x, inc.y, 10, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Add intense glow when selected
          if (isFocused) {
            ctx.shadowColor = getSeverityColor(inc.severity, 0.8);
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(inc.x, inc.y, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0; // reset
          }
        }

        ctx.globalAlpha = 1; // reset alpha
      });

      // Draw Clusters
      if (isClustered) {
        Object.values(clusters).forEach((cluster) => {
          // Determine cluster color (highest severity wins)
          let color = getSeverityColor('Information', 0.9);
          if (cluster.severities.has('Warning')) color = getSeverityColor('Warning', 0.9);
          if (cluster.severities.has('Critical')) color = getSeverityColor('Critical', 0.9);

          const radius = Math.min(25, 12 + cluster.count * 1.5);
          ctx.beginPath();
          ctx.arc(cluster.x, cluster.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw count
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cluster.count.toString(), cluster.x, cluster.y);
        });
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [
    state.visibleLayers,
    state.viewport.zoom,
    state.selectedIncidentId,
    state.hoveredIncidentId,
    state.incidentFilters,
    incidentsRef,
    state.selectedObjectId,
    state.selectedObjects,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.viewport.zoom < 1.2 || !state.visibleLayers.has('incidents')) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    let nearest: Incident | null = null;
    let minDist = 20;

    for (const inc of incidentsRef.current) {
      const dx = inc.x - mouseX;
      const dy = inc.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        nearest = inc;
      }
    }

    if (nearest && nearest.id !== state.hoveredIncidentId) {
      dispatch({ type: 'SET_HOVERED_INCIDENT', payload: nearest.id });
      document.body.style.cursor = 'pointer';
    } else if (!nearest && state.hoveredIncidentId) {
      dispatch({ type: 'SET_HOVERED_INCIDENT', payload: null });
      document.body.style.cursor = 'default';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.hoveredIncidentId) {
      dispatch({ type: 'SET_SELECTED_INCIDENT', payload: state.hoveredIncidentId });

      // Also clear resource selection to avoid dual-selection UI mess
      dispatch({ type: 'SET_SELECTED_OBJECT', payload: null });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        dispatch({ type: 'SET_HOVERED_INCIDENT', payload: null });
        document.body.style.cursor = 'default';
      }}
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1200px',
        height: '800px',
        pointerEvents: state.visibleLayers.has('incidents') ? 'auto' : 'none',
      }}
    />
  );
}
