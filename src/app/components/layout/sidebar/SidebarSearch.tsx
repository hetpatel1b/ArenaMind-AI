'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarItem as ISidebarItem } from '../../../types/SidebarConfig';
import { useRouter } from 'next/navigation';

interface SidebarSearchProps {
  isExpanded: boolean;
  allItems: ISidebarItem[];
}

export function SidebarSearch({ isExpanded, allItems }: SidebarSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = React.useMemo(() => {
    if (query.trim() === '') return [];
    const lowerQuery = query.toLowerCase();
    return allItems.filter((item) => item.label.toLowerCase().includes(lowerQuery));
  }, [query, allItems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
      return;
    }
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        router.push(selected.href);
        setQuery('');
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div style={{ padding: 'var(--space-4)', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isFocused ? 'rgba(255,255,255,0.05)' : 'transparent',
          border: `1px solid ${isFocused ? 'var(--border-strong)' : 'transparent'}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-2)',
          transition: 'all var(--duration-fast)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-tertiary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        {isExpanded && (
          <input
            ref={inputRef}
            type="text"
            placeholder="Search modules..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay blur to allow clicking results
              setTimeout(() => setIsFocused(false), 200);
            }}
            onKeyDown={handleKeyDown}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              marginLeft: 'var(--space-2)',
              outline: 'none',
              fontSize: 'var(--text-sm)',
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {isExpanded && isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 'var(--space-4)',
              right: 'var(--space-4)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 'var(--z-dropdown)',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {results.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  router.push(item.href);
                  setQuery('');
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  cursor: 'pointer',
                  backgroundColor: idx === selectedIndex ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                {item.icon && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.icon} />
                  </svg>
                )}
                {item.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
