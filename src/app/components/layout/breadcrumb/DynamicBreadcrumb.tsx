'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  if (!pathname || pathname === '/dashboard') return null;

  const paths = pathname.split('/').filter(Boolean);

  // Example mapping for pretty labels, usually this comes from route config
  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    map: 'Operations Map',
    crowd: 'Crowd Intelligence',
    incidents: 'Incident Command',
    mobility: 'Mobility Operations',
    intelligence: 'Intelligence',
    workforce: 'Workforce',
    cameras: 'Camera & Vision',
    governance: 'Governance',
    infrastructure: 'Infrastructure',
  };

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}
    >
      {paths.map((path, idx) => {
        const isLast = idx === paths.length - 1;
        const href = '/' + paths.slice(0, idx + 1).join('/');
        const label = labelMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <React.Fragment key={path}>
            {idx > 0 && (
              <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
            )}

            {isLast ? (
              <span
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="focus-ring"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: 'var(--text-sm)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
