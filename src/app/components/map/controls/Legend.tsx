'use client';

import React, { useState } from 'react';
import { useMap } from '../context/MapContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Legend() {
  const { state, dispatch } = useMap();
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Resources');

  const toggleLayer = (layerId: string) => {
    dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: layerId });
  };

  const categories = [
    {
      name: 'Resources',
      layers: [
        { id: 'security', label: 'Security', color: 'rgba(56, 189, 248, 1)' },
        { id: 'medical', label: 'Medical', color: 'rgba(239, 68, 68, 1)' },
        { id: 'police', label: 'Police', color: 'rgba(59, 130, 246, 1)' },
        { id: 'fire', label: 'Fire', color: 'rgba(249, 115, 22, 1)' },
        { id: 'maintenance', label: 'Maintenance', color: 'rgba(250, 204, 21, 1)' },
        { id: 'volunteers', label: 'Volunteer', color: 'rgba(34, 197, 94, 1)' },
        { id: 'vip', label: 'VIP', color: 'rgba(168, 85, 247, 1)' },
        { id: 'vehicles', label: 'Vehicle', color: 'rgba(148, 163, 184, 1)' },
        { id: 'drones', label: 'Drone', color: '#fff' },
      ],
    },
    {
      name: 'Intelligence',
      layers: [
        { id: 'incidents', label: 'Incidents', color: 'var(--status-critical)' },
        { id: 'heatmap', label: 'Risk Heatmap', color: 'rgba(239, 68, 68, 0.5)' },
        { id: 'prediction', label: 'AI Predictions', color: 'rgba(239, 68, 68, 0.2)' },
        { id: 'ai', label: 'AI Reasoning', color: 'var(--ai-accent)' },
      ],
    },
    {
      name: 'External',
      layers: [
        { id: 'traffic', label: 'Traffic', color: 'rgba(56, 189, 248, 0.4)' },
        { id: 'transit', label: 'Transit', color: '#ec4899' },
        { id: 'weather', label: 'Weather', color: 'rgba(255, 255, 255, 0.4)' },
        { id: 'airports', label: 'Airports', color: '#38bdf8' },
        { id: 'hospitals', label: 'Hospitals', color: '#ef4444' },
      ],
    },
  ];

  return (
    <div
      style={{
        width: '240px',
        backgroundColor: 'rgba(10, 15, 25, 0.95)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
        <input
          type="text"
          placeholder="Search Layers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-2) var(--space-3)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-xs)',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {categories.map((category) => {
          const filteredLayers = category.layers.filter((l) =>
            l.label.toLowerCase().includes(search.toLowerCase())
          );
          if (filteredLayers.length === 0) return null;
          const isExpanded = expandedCategory === category.name || search.length > 0;

          return (
            <div key={category.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div
                onClick={() => setExpandedCategory(isExpanded ? null : category.name)}
                style={{
                  padding: 'var(--space-3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? 'var(--bg-surface-active)' : 'transparent',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {category.name}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {isExpanded ? '▼' : '▶'}
                </span>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 var(--space-3) var(--space-3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)',
                      }}
                    >
                      {filteredLayers.map((layer) => (
                        <label
                          key={layer.id}
                          onMouseEnter={() =>
                            dispatch({ type: 'SET_HOVERED_RESOURCE_TYPE', payload: layer.id })
                          }
                          onMouseLeave={() =>
                            dispatch({ type: 'SET_HOVERED_RESOURCE_TYPE', payload: null })
                          }
                          onDoubleClick={() => {
                            categories
                              .flatMap((c) => c.layers)
                              .forEach((l) => {
                                if (l.id !== layer.id && state.visibleLayers.has(l.id)) {
                                  dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: l.id });
                                }
                              });
                            if (!state.visibleLayers.has(layer.id)) {
                              dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: layer.id });
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            cursor: 'pointer',
                            opacity: state.visibleLayers.has(layer.id) ? 1 : 0.5,
                            padding: 'var(--space-1) 0',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={state.visibleLayers.has(layer.id)}
                            onChange={() => toggleLayer(layer.id)}
                            style={{ accentColor: 'var(--ai-accent)' }}
                          />
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: layer.color,
                            }}
                          />
                          <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                            {layer.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: 'var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--status-critical)',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
            Offline / Critical
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--status-warning)',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Busy / Standby</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Available</span>
        </div>
      </div>
    </div>
  );
}
