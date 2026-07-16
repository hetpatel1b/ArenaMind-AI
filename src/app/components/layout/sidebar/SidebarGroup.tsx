'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarGroup as ISidebarGroup } from '../../../types/SidebarConfig';
import { SidebarItem } from './SidebarItem';

interface SidebarGroupProps {
  group: ISidebarGroup;
  isExpanded: boolean;
  isGroupExpanded: boolean;
  onToggleGroup: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  pinnedItems?: string[];
  favorites?: string[];
}

export const SidebarGroup = memo(function SidebarGroup({
  group,
  isExpanded,
  isGroupExpanded,
  onToggleGroup,
  onTogglePin,
  onToggleFavorite,
  pinnedItems = [],
  favorites = [],
}: SidebarGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 'var(--space-2)' }}>
      {isExpanded && (
        <button
          onClick={() => onToggleGroup(group.id)}
          className="focus-ring"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            padding: 'var(--space-2) var(--space-3)',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {group.title}
          </span>
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isGroupExpanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </motion.svg>
        </button>
      )}

      <AnimatePresence initial={false}>
        {(isGroupExpanded || !isExpanded) && (
          <motion.div
            initial={isExpanded ? { height: 0, opacity: 0 } : false}
            animate={isExpanded ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '2px' }}
          >
            {group.items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                isPinned={pinnedItems.includes(item.id)}
                isFavorite={favorites.includes(item.id)}
                onTogglePin={onTogglePin}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
