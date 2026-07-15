'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';
import { useOperator } from '@/lib/contexts/OperatorContext';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch, activeMissions } = useCommandCenter();
  const { state: opState, addRecentSearch } = useOperator();

  useKeyboardShortcuts(() => setIsOpen((p) => !p));

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => setQuery(''), 0);
    }
  }, [isOpen]);

  const searchResults = [
    ...activeMissions.map((m) => ({
      id: m.id,
      type: 'Mission',
      label: `Jump to Mission: ${m.name}`,
      action: () => {
        dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: m.id } });
        setIsOpen(false);
      },
    })),
    {
      id: 'c1',
      type: 'Workspace',
      label: 'Open Analytics Workspace',
      action: () => {
        dispatch({ type: 'SET_WORKSPACE_MODE', payload: { mode: 'ANALYTICS' } });
        setIsOpen(false);
      },
    },
    {
      id: 'c2',
      type: 'Workspace',
      label: 'Toggle Focus Mode',
      action: () => {
        dispatch({ type: 'TOGGLE_FOCUS_MODE' });
        setIsOpen(false);
      },
    },
    {
      id: 'c3',
      type: 'Workspace',
      label: 'Open Mission Inspector',
      action: () => {
        dispatch({ type: 'SET_WORKSPACE_MODE', payload: { mode: 'INSPECTOR' } });
        setIsOpen(false);
      },
    },
    {
      id: 'c4',
      type: 'Report',
      label: 'Generate Executive Brief',
      action: () => {
        dispatch({ type: 'SET_WORKSPACE_MODE', payload: { mode: 'ANALYTICS' } });
        setIsOpen(false);
      },
    },
  ].filter((r) => query === '' || r.label.toLowerCase().includes(query.toLowerCase()));

  const handleExecute = (action: () => void, label: string) => {
    if (query.trim()) addRecentSearch(query);
    action();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '15vh',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsOpen(false)}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--text-tertiary)', marginRight: '12px' }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search missions, gates, actions..."
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpen(false);
                if (e.key === 'Enter' && searchResults.length > 0) {
                  const first = searchResults[0];
                  if (first) {
                    handleExecute(first.action, first.label);
                  }
                }
              }}
            />
            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              ESC
            </div>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
            {query === '' && opState.recentSearches.length > 0 && (
              <div
                style={{
                  padding: '8px 12px',
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Recent Searches
              </div>
            )}

            {searchResults.length === 0 ? (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                  fontSize: '12px',
                }}
              >
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              searchResults.map((result, idx) => (
                <div
                  key={result.id}
                  onClick={() => handleExecute(result.action, result.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: idx === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      idx === 0 ? 'rgba(255,255,255,0.05)' : 'transparent')
                  }
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#fff' }}>{result.label}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {result.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
