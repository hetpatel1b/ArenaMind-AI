'use client';

import React, { useEffect, useState } from 'react';
import { useMap } from '../context/MapContext';
import { useCollaboration } from '../context/CollaborationContext';
import { globalResources, OperationalResource } from '../hooks/useResourceEngine';
import { motion, AnimatePresence } from 'framer-motion';

export function SelectionOverlay() {
  const { state } = useMap();
  const { collabState } = useCollaboration();
  const [selectedResources, setSelectedResources] = useState<OperationalResource[]>([]);
  const [sharedSelectedResources, setSharedSelectedResources] = useState<
    { res: OperationalResource; op: SafeAny }[]
  >([]);

  // Poll position of selected resources if moving
  useEffect(() => {
    let animationId: number;

    const track = () => {
      const found = globalResources.filter((r) => state.selectedObjects.has(r.id));
      setSelectedResources((prev) => {
        if (
          prev.length === found.length &&
          prev.every(
            (p, i) => found[i] && p.id === found[i].id && p.x === found[i].x && p.y === found[i].y
          )
        ) {
          return prev;
        }
        return found.map((r) => ({ ...r }));
      });

      const shared = globalResources
        .map((r) => {
          const op = collabState.operators.find((o) => o.selection === r.id);
          return op ? { res: { ...r }, op } : null;
        })
        .filter(Boolean) as { res: OperationalResource; op: SafeAny }[];

      setSharedSelectedResources((prev) => {
        if (
          prev.length === shared.length &&
          prev.every(
            (p, i) =>
              shared[i] &&
              p.res.id === shared[i].res.id &&
              p.res.x === shared[i].res.x &&
              p.res.y === shared[i].res.y &&
              p.op.id === shared[i].op.id
          )
        ) {
          return prev;
        }
        return shared;
      });
      animationId = requestAnimationFrame(track);
    };

    animationId = requestAnimationFrame(track);

    return () => cancelAnimationFrame(animationId);
  }, [state.selectedObjects, collabState.operators]);

  if (selectedResources.length === 0 && sharedSelectedResources.length === 0) return null;

  return (
    <>
      {/* Local Selections */}
      {selectedResources.map((resource) => (
        <div
          key={resource.id}
          style={{
            position: 'absolute',
            left: resource.x,
            top: resource.y,
            pointerEvents: 'auto',
            zIndex: 40,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Glowing Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ position: 'relative' }}
          >
            {/* Halo */}
            <div
              style={{
                position: 'absolute',
                inset: -10,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(56,189,248,0) 70%)',
                pointerEvents: 'none',
              }}
            />

            <motion.svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ pointerEvents: 'none' }}
            >
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="transparent"
                stroke="rgba(56, 189, 248, 0.4)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx="20"
                cy="20"
                r="12"
                fill="transparent"
                stroke="rgba(56, 189, 248, 0.8)"
                strokeWidth="2"
                strokeDasharray="8 8"
              />

              {/* Crosshairs */}
              <line
                x1="20"
                y1="0"
                x2="20"
                y2="4"
                stroke="rgba(56, 189, 248, 0.8)"
                strokeWidth="2"
              />
              <line
                x1="20"
                y1="36"
                x2="20"
                y2="40"
                stroke="rgba(56, 189, 248, 0.8)"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="20"
                x2="4"
                y2="20"
                stroke="rgba(56, 189, 248, 0.8)"
                strokeWidth="2"
              />
              <line
                x1="36"
                y1="20"
                x2="40"
                y2="20"
                stroke="rgba(56, 189, 248, 0.8)"
                strokeWidth="2"
              />
            </motion.svg>

            {/* Contextual Actions (Only show if single selection to avoid clutter, or on the first one) */}
            {selectedResources.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: 'var(--space-2)',
                  display: 'flex',
                  gap: 'var(--space-1)',
                  backgroundColor: 'rgba(10,15,25,0.9)',
                  padding: 'var(--space-1)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <button
                  className="btn btn-ghost"
                  style={{ padding: 'var(--space-1)', fontSize: '10px' }}
                  title="Dispatch"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ padding: 'var(--space-1)', fontSize: '10px' }}
                  title="Camera View"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ padding: 'var(--space-1)', fontSize: '10px' }}
                  title="Communicate"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      ))}

      {/* Shared Selections */}
      {sharedSelectedResources.map(({ res, op }) => (
        <div
          key={`shared-${res.id}-${op.id}`}
          style={{
            position: 'absolute',
            left: res.x,
            top: res.y,
            pointerEvents: 'none',
            zIndex: 30,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -8,
              border: `2px dashed ${op.color}`,
              borderRadius: '50%',
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
              backgroundColor: op.color,
              color: '#fff',
              fontSize: '9px',
              padding: '2px 4px',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            Selected by {op.department}
          </div>
        </div>
      ))}
    </>
  );
}
