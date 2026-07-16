'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function LeftNavigation() {
  const [isExpanded, setIsExpanded] = useState(true);

  const navGroups = [
    {
      title: 'Operations',
      items: [
        {
          label: 'Map View',
          href: '/dashboard/map',
          icon: 'M9 20l-5-3v-14l5 3 5-3 5 3v14l-5-3-5 3z M9 20v-14 M14 17v-14',
        },
        {
          label: 'Crowd Intelligence',
          href: '/dashboard/crowd',
          icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87',
        },
        {
          label: 'Incidents',
          href: '/dashboard/incidents',
          icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
        },
        {
          label: 'Mobility',
          href: '/dashboard/mobility',
          icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01',
        },
        {
          label: 'Intelligence',
          href: '/dashboard/intelligence',
          icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        {
          label: 'Workforce',
          href: '/dashboard/workforce',
          icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
        },
        {
          label: 'Cameras',
          href: '/dashboard/cameras',
          icon: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0z',
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          label: 'Governance',
          href: '/dashboard/governance',
          icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01',
        },
        {
          label: 'System Status',
          href: '/dashboard/infrastructure',
          icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
        },
      ],
    },
  ];

  return (
    <nav
      style={{
        width: isExpanded ? '240px' : '68px',
        backgroundColor: 'var(--bg-app)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--duration-fast) var(--ease-out)',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      aria-label="Main Navigation"
    >
      <div
        style={{
          padding: 'var(--space-4)',
          display: 'flex',
          justifyContent: isExpanded ? 'flex-end' : 'center',
        }}
      >
        <button
          className="btn btn-ghost focus-ring"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
          style={{ padding: 'var(--space-1)' }}
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
          padding: '0 var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}
      >
        {navGroups.map((group, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {isExpanded && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--text-tertiary)',
                  paddingLeft: 'var(--space-2)',
                }}
              >
                {group.title.toUpperCase()}
              </span>
            )}

            {group.items.map((item, j) => (
              <Link
                key={j}
                href={item.href}
                className="btn btn-ghost focus-ring"
                style={{
                  justifyContent: 'flex-start',
                  padding: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                }}
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
                  style={{ flexShrink: 0 }}
                >
                  <path d={item.icon} />
                </svg>
                {isExpanded && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
