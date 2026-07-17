'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { SidebarItem as ISidebarItem } from '../../../types/SidebarConfig';

interface SidebarItemProps {
  item: ISidebarItem;
  isExpanded: boolean;
  isPinned?: boolean;
  isFavorite?: boolean;
  onTogglePin?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const SidebarItem = memo(function SidebarItem({
  item,
  isExpanded,
  isPinned,
  isFavorite,
  onTogglePin,
  onToggleFavorite,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`sidebar-item focus-ring ${isActive ? 'active' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--space-2) var(--space-3)',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        gap: 'var(--space-3)',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        minHeight: '36px',
        margin: '2px 0',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '60%',
            backgroundColor: 'var(--brand-primary)',
            borderRadius: '0 4px 4px 0',
            boxShadow: '0 0 8px var(--brand-primary)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      {item.icon && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, color: isActive ? 'var(--brand-primary)' : 'inherit' }}
        >
          <path d={item.icon} />
        </svg>
      )}

      {isExpanded && (
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
            }}
          >
            {item.label}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {item.badge !== undefined && item.badge > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--status-critical)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px',
                }}
              >
                {item.badge}
              </span>
            )}

            {item.status && (
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    item.status === 'online'
                      ? 'var(--status-success)'
                      : item.status === 'warning'
                        ? 'var(--status-warning)'
                        : item.status === 'critical'
                          ? 'var(--status-critical)'
                          : 'var(--status-offline)',
                }}
              />
            )}

            {(onToggleFavorite || onTogglePin) && (
              <div
                className="item-actions"
                style={{
                  display: 'flex',
                  gap: '4px',
                  opacity: 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {onToggleFavorite && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleFavorite(item.id);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={isFavorite ? 'var(--status-warning)' : 'none'}
                      stroke={isFavorite ? 'var(--status-warning)' : 'var(--text-tertiary)'}
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                )}
                {onTogglePin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onTogglePin(item.id);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={isPinned ? 'var(--brand-primary)' : 'none'}
                      stroke={isPinned ? 'var(--brand-primary)' : 'var(--text-tertiary)'}
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Link>
  );
});
