'use client';

import { useEffect, useRef } from 'react';
import { useCollaboration, CollaborationOperator } from '../context/CollaborationContext';
import { globalResources } from './useResourceEngine';
import { useMap } from '../context/MapContext';

const MOCK_OPERATORS: Omit<CollaborationOperator, 'cursor' | 'selection' | 'viewport'>[] = [
  { id: 'op1', name: 'Sarah J.', department: 'Security', color: '#38bdf8', status: 'Available' },
  { id: 'op2', name: 'Dr. Chen', department: 'Medical', color: '#ef4444', status: 'Busy' },
  {
    id: 'op3',
    name: 'Cmdr. Vance',
    department: 'Executive',
    color: '#a855f7',
    status: 'Available',
  },
  { id: 'op4', name: 'T. Robbins', department: 'Traffic', color: '#f59e0b', status: 'Idle' },
];

export function useCollaborationEngine() {
  const { collabDispatch } = useCollaboration();
  const { state: mapState } = useMap();
  const mapStateRef = useRef(mapState);

  useEffect(() => {
    mapStateRef.current = mapState;
  }, [mapState]);

  useEffect(() => {
    let animationId: number;
    let lastEventTime = performance.now();

    // Initialize mock state
    const operators: CollaborationOperator[] = MOCK_OPERATORS.map((op) => ({
      ...op,
      cursor: { x: 500 + Math.random() * 200, y: 300 + Math.random() * 200 },
      selection: null,
      viewport: { x: 0, y: 0, zoom: 1 },
    }));

    // Generate random targets for operators to move towards
    const targets = operators.map(() => ({
      x: 300 + Math.random() * 600,
      y: 200 + Math.random() * 400,
    }));

    const update = (time: number) => {
      // 1. Interpolate cursors
      operators.forEach((op, i) => {
        if (!op.cursor) return;
        const target = targets[i];

        // Move towards target
        if (target) {
          op.cursor.x += (target.x - op.cursor.x) * 0.05;
          op.cursor.y += (target.y - op.cursor.y) * 0.05;

          // If close to target, pick a new one occasionally
          if (Math.hypot(target.x - op.cursor.x, target.y - op.cursor.y) < 10) {
            if (Math.random() < 0.01) {
              // Random chance to pick new target
              targets[i] = {
                x: 100 + Math.random() * 1000,
                y: 100 + Math.random() * 600,
              };
            }
          }
        }

        // Randomly select resources occasionally
        if (Math.random() < 0.001) {
          const res = globalResources[Math.floor(Math.random() * globalResources.length)];
          if (res) {
            op.selection = res.id;
          }
        } else if (Math.random() < 0.002) {
          op.selection = null; // deselect
        }
      });

      collabDispatch({ type: 'SET_OPERATORS', payload: [...operators] });

      // 2. Generate random command feed events
      if (time - lastEventTime > 8000) {
        lastEventTime = time;
        if (Math.random() > 0.5) {
          const op = operators[Math.floor(Math.random() * operators.length)];
          if (op) {
            const messages = [
              'Approved deployment.',
              'Monitoring crowd levels.',
              'Unit dispatched to sector 4.',
              'Incident marked as verified.',
              'Handoff accepted.',
            ];
            collabDispatch({
              type: 'ADD_COMMAND_EVENT',
              payload: {
                id: `evt-${Date.now()}`,
                timestamp: Date.now(),
                operatorId: op.id,
                department: op.department,
                message: messages[Math.floor(Math.random() * messages.length)] || 'System updated.',
                type: 'action',
              },
            });
          }
        }
      }

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationId);
  }, [collabDispatch]);
}
