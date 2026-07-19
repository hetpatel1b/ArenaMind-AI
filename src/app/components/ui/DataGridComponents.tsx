'use client';

import React from 'react';
import { EmptyState } from './FeedbackComponents';
import { handleEnterSpace } from '@/lib/accessibility/keyboard';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

export function EnterpriseTable<T>({
  columns,
  data,
  onRowClick,
  caption,
}: {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  caption?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No Records Found"
        description="Try adjusting your filters or search query."
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        {caption && (
          <caption
            style={{
              padding: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              textAlign: 'left',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {caption}
          </caption>
        )}
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-app)',
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              onKeyDown={onRowClick ? handleEnterSpace(() => onRowClick(row)) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color var(--duration-fast)',
              }}
              onMouseEnter={(e) =>
                onRowClick && (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')
              }
              onMouseLeave={(e) =>
                onRowClick && (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
