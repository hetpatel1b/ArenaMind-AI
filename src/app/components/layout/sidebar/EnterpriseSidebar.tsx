'use client';

import React, { useMemo } from 'react';
import { useSidebarState } from '../../../hooks/useSidebarState';
import { SidebarGroup } from './SidebarGroup';
import { SidebarItem } from './SidebarItem';
import {
  SidebarGroup as ISidebarGroup,
  SidebarItem as ISidebarItem,
} from '../../../types/SidebarConfig';

const allItems: ISidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  },
  {
    id: 'map',
    label: 'Global Operations Map',
    href: '/dashboard/map',
    icon: 'M9 20l-5-3v-14l5 3 5-3 5 3v14l-5-3-5 3z M9 20v-14 M14 17v-14',
  },
  {
    id: 'crowd',
    label: 'Crowd Intelligence',
    href: '/dashboard/crowd',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87',
  },
  {
    id: 'incidents',
    label: 'Incident Command',
    href: '/dashboard/incidents',
    icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
  },
  {
    id: 'mobility',
    label: 'Mobility Operations',
    href: '/dashboard/mobility',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    href: '/dashboard/intelligence',
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  },
  {
    id: 'workforce',
    label: 'Workforce',
    href: '/dashboard/workforce',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    id: 'cameras',
    label: 'Camera & Vision',
    href: '/dashboard/cameras',
    icon: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0z',
  },
  {
    id: 'governance',
    label: 'Governance',
    href: '/dashboard/governance',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    href: '/dashboard/infrastructure',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
    status: 'online',
  },
];

const MAIN_GROUPS: ISidebarGroup[] = [
  {
    id: 'operations',
    title: 'Operations',
    items: [
      allItems.find((i) => i.id === 'map')!,
      allItems.find((i) => i.id === 'crowd')!,
      allItems.find((i) => i.id === 'incidents')!,
      allItems.find((i) => i.id === 'mobility')!,
      allItems.find((i) => i.id === 'intelligence')!,
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    items: [allItems.find((i) => i.id === 'workforce')!, allItems.find((i) => i.id === 'cameras')!],
  },
  {
    id: 'administration',
    title: 'Administration',
    items: [
      allItems.find((i) => i.id === 'governance')!,
      allItems.find((i) => i.id === 'infrastructure')!,
    ],
  },
];

export function EnterpriseSidebar() {
  const { state, isClient, toggleSidebar, toggleGroup, togglePin, toggleFavorite } =
    useSidebarState();

  const pinnedItems = useMemo(
    () => allItems.filter((i) => state.pinnedItems.includes(i.id)),
    [state.pinnedItems]
  );
  const favoriteItems = useMemo(
    () => allItems.filter((i) => state.favorites.includes(i.id)),
    [state.favorites]
  );
  const recentItems = useMemo(
    () => allItems.filter((i) => state.recentItems.includes(i.id)),
    [state.recentItems]
  );

  if (!isClient) return null; // Avoid hydration mismatch

  const dashboardItem = allItems.find((i) => i.id === 'dashboard')!;

  return (
    <nav
      style={{
        width: state.isExpanded ? '260px' : '68px',
        backgroundColor: 'var(--bg-app)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--duration-fast) var(--ease-out)',
        height: '100%',
      }}
      aria-label="Main Navigation"
    >
      <div
        style={{
          padding: 'var(--space-4)',
          display: 'flex',
          justifyContent: state.isExpanded ? 'flex-end' : 'center',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <button
          className="btn btn-ghost focus-ring"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          style={{ padding: 'var(--space-2)' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18 M3 6h18 M3 18h18" />
          </svg>
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0 var(--space-3) var(--space-4) var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <SidebarItem
            item={dashboardItem}
            isExpanded={state.isExpanded}
            isPinned={state.pinnedItems.includes('dashboard')}
            isFavorite={state.favorites.includes('dashboard')}
            onTogglePin={togglePin}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        {MAIN_GROUPS.map((group) => (
          <SidebarGroup
            key={group.id}
            group={group}
            isExpanded={state.isExpanded}
            isGroupExpanded={state.expandedGroups[group.id] !== false}
            onToggleGroup={toggleGroup}
            onTogglePin={togglePin}
            onToggleFavorite={toggleFavorite}
            pinnedItems={state.pinnedItems}
            favorites={state.favorites}
          />
        ))}

        {state.isExpanded && (
          <div
            style={{
              marginTop: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            {pinnedItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--text-tertiary)',
                    padding: '0 var(--space-3) var(--space-2)',
                  }}
                >
                  PINNED
                </span>
                {pinnedItems.map((item) => (
                  <SidebarItem
                    key={`pin-${item.id}`}
                    item={item}
                    isExpanded={true}
                    onTogglePin={togglePin}
                    isPinned={true}
                  />
                ))}
              </div>
            )}

            {favoriteItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--text-tertiary)',
                    padding: '0 var(--space-3) var(--space-2)',
                  }}
                >
                  FAVORITES
                </span>
                {favoriteItems.map((item) => (
                  <SidebarItem
                    key={`fav-${item.id}`}
                    item={item}
                    isExpanded={true}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            )}

            {recentItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--text-tertiary)',
                    padding: '0 var(--space-3) var(--space-2)',
                  }}
                >
                  RECENT
                </span>
                {recentItems.map((item) => (
                  <SidebarItem key={`recent-${item.id}`} item={item} isExpanded={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          flexShrink: 0,
        }}
      >
        <SidebarItem
          item={{
            id: 'status',
            label: 'System Status',
            href: '/dashboard/infrastructure',
            icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
            status: 'online',
          }}
          isExpanded={state.isExpanded}
        />
        {state.isExpanded && (
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              marginTop: 'var(--space-2)',
            }}
          >
            ArenaMind OS v2.4.1
          </div>
        )}
      </div>
    </nav>
  );
}
