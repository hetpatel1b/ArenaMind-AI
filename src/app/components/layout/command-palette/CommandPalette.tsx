'use client';

import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandPalette } from './useCommandPalette';
import { useHeaderState } from '@/app/hooks/useHeaderState';
import { useRouter } from 'next/navigation';
import { FocusTrap } from '@/lib/accessibility/focus';
import { isArrowKey, isEnterSpace, isEscape, isHomeEnd } from '@/lib/accessibility/keyboard';
import { useAccessibleId } from '@/lib/accessibility/ids';

type CommandItem = {
  id: string;
  group: string;
  label: string;
  icon: string;
  href?: string;
  action?: string;
};

const ALL_COMMANDS: CommandItem[] = [
  {
    id: 'p1',
    group: 'Pages',
    label: 'Incident Command',
    icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    href: '/dashboard/incidents',
  },
  {
    id: 'p2',
    group: 'Pages',
    label: 'Mobility Operations',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    href: '/dashboard/mobility',
  },
  {
    id: 'p3',
    group: 'Pages',
    label: 'Infrastructure',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
    href: '/dashboard/infrastructure',
  },
  {
    id: 'u1',
    group: 'People',
    label: 'John Smith',
    icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    action: 'view_profile',
  },
  {
    id: 'u2',
    group: 'People',
    label: 'Het Patel',
    icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    action: 'view_profile',
  },
  {
    id: 'r1',
    group: 'Reports',
    label: 'Audit Report',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    action: 'view_report',
  },
  {
    id: 'r2',
    group: 'Reports',
    label: 'AI Health',
    icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    action: 'view_report',
  },
  {
    id: 'm1',
    group: 'Actions',
    label: 'Toggle Focus Mode',
    icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
    action: 'toggle_focus',
  },
];

export function CommandPalette() {
  const { isOpen, close, query, setQuery, selectedIndex, setSelectedIndex, inputRef } =
    useCommandPalette();
  const { addRecentSearch, state } = useHeaderState();
  const router = useRouter();
  const listboxId = useAccessibleId();

  const filteredCommands = useMemo<CommandItem[]>(() => {
    if (!query) {
      // Return recent searches + top items if no query
      const recent: CommandItem[] = state.recentSearches.map((q) => ({
        id: `rec-${q}`,
        group: 'Recent',
        label: q,
        icon: 'M12 8v4l3 3 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
        action: 'search',
      }));
      return [...recent, ...ALL_COMMANDS.slice(0, 5)];
    }
    const q = query.toLowerCase();
    return ALL_COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [query, state.recentSearches]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, setSelectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isArrowKey(e)) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
        }
      } else if (isHomeEnd(e)) {
        if (e.key === 'Home') {
          e.preventDefault();
          setSelectedIndex(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          setSelectedIndex(filteredCommands.length - 1);
        }
      } else if (isEnterSpace(e)) {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          addRecentSearch(selected.label);
          if (selected.href) {
            router.push(selected.href);
          }
          close();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, setSelectedIndex, close, addRecentSearch, router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999, // Ensure it's above everything
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '10vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <FocusTrap active={isOpen} onEscape={close}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
              }}
              role="dialog"
              aria-modal="true"
            >
              <search
                role="search"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-tertiary)"
                  strokeWidth="2"
                  style={{ marginRight: 'var(--space-3)' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages, commands, users..."
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    filteredCommands.length > 0 && filteredCommands[selectedIndex]
                      ? `cmd-opt-${filteredCommands[selectedIndex].id}`
                      : undefined
                  }
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-lg)',
                  }}
                />
                <kbd
                  style={{
                    padding: '4px 8px',
                    background: 'var(--bg-surface)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  ESC
                </kbd>
              </search>

              <div
                id={listboxId}
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: 'var(--space-2)',
                }}
                role="listbox"
              >
                {filteredCommands.length === 0 ? (
                  <div
                    style={{
                      padding: 'var(--space-8)',
                      textAlign: 'center',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  filteredCommands.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const showGroup = idx === 0 || filteredCommands[idx - 1]?.group !== item.group;
                    return (
                      <React.Fragment key={item.id}>
                        {showGroup && (
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: 'var(--text-tertiary)',
                              padding: 'var(--space-3) var(--space-3) var(--space-1)',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.group}
                          </div>
                        )}
                        <div
                          id={`cmd-opt-${item.id}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            addRecentSearch(item.label);
                            if (item.href) router.push(item.href);
                            close();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-3)',
                            margin: '0 var(--space-1)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d={item.icon} />
                          </svg>
                          <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{item.label}</span>
                          {isSelected && (
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                              Jump to
                            </span>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </motion.div>
          </FocusTrap>
        </div>
      )}
    </AnimatePresence>
  );
}
