'use client';

import { useEffect, useRef } from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';
import { CameraState, AlertSeverity } from './CameraTypes';

export function useCameraEngine() {
  const { state, dispatch } = useCameraWorkspace();
  const stateRef = useRef(state);

  // Keep ref in sync to avoid dependency cycles in interval
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    // Engine tick rate: 2 seconds
    const interval = setInterval(() => {
      const currentState = stateRef.current;

      // 1. Simulate Metrics Fluctuations
      const newDetectionRate = Math.max(
        800,
        Math.min(1500, currentState.metrics.detectionRate + (Math.random() * 40 - 20))
      );
      const newLatency = Math.max(
        10,
        Math.min(25, currentState.metrics.avgEdgeLatency + (Math.random() * 2 - 1))
      );
      const newBandwidth = Math.max(
        2000,
        Math.min(3000, currentState.metrics.bandwidthUsage + (Math.random() * 100 - 50))
      );
      const newGpuLoad = Math.max(
        30,
        Math.min(85, currentState.metrics.gpuLoad + (Math.random() * 10 - 5))
      );

      // 2. Simulate Reasoning Stream (Streaming text logic)
      const reasoningPhases = [
        'Observation',
        'Detection',
        'Classification',
        'Tracking',
        'Correlation',
        'Prediction',
        'Recommendation',
      ];
      const currentPhase = reasoningPhases[
        Math.floor(Math.random() * reasoningPhases.length)
      ] as any;
      const newReasoning = {
        id: `reasoning-${Date.now()}`,
        phase: currentPhase,
        content: `Analyzing edge stream... ${currentPhase} complete with high confidence.`,
        confidence: 85 + Math.random() * 14,
      };
      const updatedReasoning = [newReasoning, ...currentState.reasoningStream].slice(0, 20);

      // 3. Update Camera Entities for Canvas Simulation
      const entities = currentState.canvasEntities.length
        ? [...currentState.canvasEntities]
        : Array.from({ length: 15 }).map((_, i) => ({
            id: `entity-${i}`,
            x: Math.random() * 1000,
            y: Math.random() * 600,
            vx: 0,
            vy: 0,
            targetX: Math.random() * 1000,
            targetY: Math.random() * 600,
            type: Math.random() > 0.8 ? 'VEHICLE' : ('PERSON' as any),
            confidence: 0.9 + Math.random() * 0.09,
          }));

      // Update target positions randomly for living feel
      const updatedEntities = entities.map((entity) => {
        if (Math.random() < 0.1) {
          return {
            ...entity,
            targetX: Math.max(50, Math.min(950, entity.targetX + (Math.random() * 200 - 100))),
            targetY: Math.max(50, Math.min(550, entity.targetY + (Math.random() * 200 - 100))),
          };
        }
        return entity;
      });

      // 4. Simulate Timeline Events
      let newTimelineEvents = [...currentState.timelineEvents];
      if (Math.random() < 0.3) {
        newTimelineEvents.unshift({
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          label: Math.random() > 0.5 ? 'Motion Detected' : 'VIP Recognized',
          type: Math.random() > 0.5 ? 'motion' : 'system',
          positionPct: Math.random() * 100,
        });
        if (newTimelineEvents.length > 50) newTimelineEvents = newTimelineEvents.slice(0, 50);
      }

      // 5. Randomly Trigger Notifications (Rarely)
      if (Math.random() < 0.05) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: `notif-${Date.now()}`,
            title: 'AI Alert',
            message: 'Suspicious object detected in Sector 4.',
            type: 'warning',
          },
        });
      }

      // Dispatch Unified Tick
      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          metrics: {
            ...currentState.metrics,
            detectionRate: Math.round(newDetectionRate),
            avgEdgeLatency: Number(newLatency.toFixed(1)),
            bandwidthUsage: Math.round(newBandwidth),
            gpuLoad: Math.round(newGpuLoad),
          },
          reasoningStream: updatedReasoning,
          canvasEntities: updatedEntities,
          timelineEvents: newTimelineEvents,
        },
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch]);
}
