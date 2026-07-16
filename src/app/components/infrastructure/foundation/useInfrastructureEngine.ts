'use client';

import { useEffect, useRef } from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import {
  Notification,
  NotificationPriority,
  TimelineEventType,
  TimelineEvent,
} from './InfrastructureTypes';

const jitter = (val: number, min: number, max: number, maxChange: number) => {
  const change = (Math.random() * 2 - 1) * maxChange;
  return Math.min(max, Math.max(min, val + change));
};

export function useInfrastructureEngine() {
  const { state, dispatch } = useInfrastructureWorkspace();
  const engineRef = useRef<NodeJS.Timeout | null>(null);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (engineRef.current) return;

    engineRef.current = setInterval(() => {
      const currentState = stateRef.current;
      if (!currentState.engineRunning) return;

      const updatedMetrics = { ...currentState.metrics };
      updatedMetrics.cpuUsage = jitter(updatedMetrics.cpuUsage, 20, 100, 5);
      updatedMetrics.ramUsage = jitter(updatedMetrics.ramUsage, 30, 95, 3);
      updatedMetrics.gpuUsage = jitter(updatedMetrics.gpuUsage, 50, 100, 2);
      updatedMetrics.storageUsage = jitter(updatedMetrics.storageUsage, 40, 95, 0.5);
      updatedMetrics.redisLatency = jitter(updatedMetrics.redisLatency, 1, 20, 1);
      updatedMetrics.kafkaQueue = Math.floor(jitter(updatedMetrics.kafkaQueue, 0, 500, 50));
      updatedMetrics.apiHealth = jitter(updatedMetrics.apiHealth, 95, 100, 0.1);
      updatedMetrics.gatewayLatency = jitter(updatedMetrics.gatewayLatency, 5, 50, 2);
      updatedMetrics.dbLatency = jitter(updatedMetrics.dbLatency, 1, 15, 0.5);

      let updatedTimeline = [...currentState.timelineEvents];
      if (currentState.timelinePlayback === 'playing' && Math.random() > 0.92) {
        const events = [
          { label: 'Container Restarted', type: TimelineEventType.POD_RESTART },
          { label: 'Deployment Finished', type: TimelineEventType.DEPLOYMENT },
          { label: 'Node Joined', type: TimelineEventType.SCALING },
          { label: 'Database Replica Synced', type: TimelineEventType.BACKUP },
          { label: 'Queue Spike', type: TimelineEventType.QUEUE_SPIKE },
        ];
        const evt = events[Math.floor(Math.random() * events.length)];
        if (evt) {
          const newEvent: TimelineEvent = {
            id: Math.random().toString(),
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            label: evt.label,
            type: evt.type,
          };
          updatedTimeline = [newEvent, ...updatedTimeline].slice(0, 15);
        }
      }

      if (Math.random() > 0.97) {
        const notifs = [
          {
            title: 'CPU Threshold',
            msg: 'Core usage exceeded 85% in eu-west-1',
            prio: NotificationPriority.HIGH,
          },
          {
            title: 'Redis Recovery',
            msg: 'Redis cache node recovered successfully.',
            prio: NotificationPriority.LOW,
          },
          {
            title: 'DB Replication',
            msg: 'Replication lag > 500ms detected.',
            prio: NotificationPriority.MEDIUM,
          },
        ];
        const n = notifs[Math.floor(Math.random() * notifs.length)];
        if (n) {
          const notification: Notification = {
            id: Math.random().toString(),
            title: n.title,
            message: n.msg,
            priority: n.prio,
            timestamp: new Date().toISOString(),
          };
          dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        }
      }

      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          metrics: updatedMetrics,
          timelineEvents: updatedTimeline,
        },
      });
    }, 1000);

    return () => {
      if (engineRef.current) {
        clearInterval(engineRef.current);
        engineRef.current = null;
      }
    };
  }, [dispatch]);
}
