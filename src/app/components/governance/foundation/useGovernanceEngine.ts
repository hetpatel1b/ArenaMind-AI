'use client';

import { useEffect, useRef } from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import { GovernanceState, Notification, TimelineEvent } from './GovernanceTypes';

// Helper to jitter a number slightly
const jitter = (val: number, percent: number) => {
  const amount = val * (percent / 100);
  return val + (Math.random() * amount * 2 - amount);
};

export function useGovernanceEngine() {
  const { state, dispatch } = useGovernanceWorkspace();
  const engineRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Prevent duplicate timers
    if (engineRef.current) return;

    engineRef.current = setInterval(() => {
      // 1. Generate live metrics updates
      const updatedMetrics = { ...state.metrics };
      updatedMetrics.usersOnline = jitter(updatedMetrics.usersOnline, 5);
      updatedMetrics.auditEvents = jitter(updatedMetrics.auditEvents, 2);
      updatedMetrics.latencyMs = jitter(updatedMetrics.latencyMs, 10);
      updatedMetrics.gpuUsage = Math.min(100, Math.max(0, jitter(updatedMetrics.gpuUsage, 2)));
      updatedMetrics.cpuUsage = Math.min(100, Math.max(0, jitter(updatedMetrics.cpuUsage, 5)));
      updatedMetrics.bandwidthMbps = jitter(updatedMetrics.bandwidthMbps, 3);
      updatedMetrics.storageUsedTb = Math.min(
        updatedMetrics.storageCapTb,
        updatedMetrics.storageUsedTb + 0.001
      );

      // 2. Generate live timeline events rarely
      let updatedTimeline = [...state.timelineEvents];
      if (state.timelinePlayback === 'playing') {
        if (Math.random() > 0.9) {
          const newEvent: TimelineEvent = {
            id: Math.random().toString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            label:
              ['User Login', 'Policy Match', 'Storage Synced', 'Audit Written', 'Role Check'][
                Math.floor(Math.random() * 5)
              ] || 'User Login',
            user:
              ['system', 'admin@arena.ai', 'sec_ops', 'auditor'][Math.floor(Math.random() * 4)] ||
              'system',
            type: ['identity', 'security', 'system', 'compliance'][
              Math.floor(Math.random() * 4)
            ] as any,
          };
          updatedTimeline = [newEvent, ...updatedTimeline].slice(0, 10); // Keep last 10
        } else if (updatedTimeline.length === 0) {
          // Init timeline
          updatedTimeline = [
            {
              id: 't1',
              time: '10:42 AM',
              label: 'User Created',
              user: 'admin@arena.ai',
              type: 'identity',
            },
            { id: 't2', time: '11:15 AM', label: 'Role Updated', user: 'system', type: 'identity' },
            {
              id: 't3',
              time: '12:05 PM',
              label: 'API Key Rotated',
              user: 'sec_ops',
              type: 'security',
            },
          ];
        }
      } else {
        if (updatedTimeline.length === 0) {
          updatedTimeline = [
            {
              id: 't1',
              time: '10:42 AM',
              label: 'User Created',
              user: 'admin@arena.ai',
              type: 'identity',
            },
          ];
        }
      }

      // 3. Generate notifications rarely
      if (Math.random() > 0.98) {
        const notification: Notification = {
          id: Math.random().toString(),
          title: 'Engine Alert',
          message:
            [
              'Storage capacity approaching 75%',
              'Policy conflict detected on edge node.',
              'Unusual login pattern flagged.',
            ][Math.floor(Math.random() * 3)] || 'Engine Alert',
          type: ['info', 'warning', 'critical'][Math.floor(Math.random() * 3)] as any,
          timestamp: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      }

      // 4. Update Panels sparkline (shift data left, add new val)
      const updatedPanels = state.panels.map((panel) => {
        let newValue = panel.rawValue;
        if (panel.title === 'Security Score' || panel.title === 'Compliance') {
          newValue = Math.min(100, Math.max(0, jitter(newValue, 1)));
        } else if (panel.title === 'License Usage' || panel.title === 'Storage Cap.') {
          newValue = Math.min(100, Math.max(0, jitter(newValue, 0.5)));
        } else if (panel.title === 'Infra Health') {
          newValue = Math.min(100, Math.max(90, jitter(newValue, 0.1)));
        }

        const newSparkline = [...panel.sparkline.slice(1), newValue];
        return {
          ...panel,
          rawValue: newValue,
          value:
            panel.title === 'AI Providers'
              ? 'Healthy'
              : `${newValue.toFixed(1)}${panel.title === 'Security Score' ? '/100' : '%'}`,
          sparkline: newSparkline,
        };
      });

      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          metrics: updatedMetrics,
          timelineEvents: updatedTimeline,
          panels: updatedPanels,
        },
      });
    }, 1000);

    return () => {
      if (engineRef.current) {
        clearInterval(engineRef.current);
        engineRef.current = null;
      }
    };
  }, [state.metrics, state.timelineEvents, state.panels, state.timelinePlayback, dispatch]);
}
