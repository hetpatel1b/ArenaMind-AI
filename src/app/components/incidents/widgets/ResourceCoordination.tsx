'use client';

import React from 'react';

interface ResourceCoordinationProps {
  resources: any[];
  incidentZoneId?: string | null;
}

export function ResourceCoordination({ resources, incidentZoneId }: ResourceCoordinationProps) {
  // Filter resources to those nearby or assigned
  const relevantResources = resources
    .filter(
      (r) =>
        r.status !== 'off_duty' &&
        (r.status === 'incident_assigned' || r.zoneId === incidentZoneId || r.resourceTypeId)
    )
    .slice(0, 5); // Limit to top 5 for the panel

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '300px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-3)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Resource Coordination
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          {relevantResources.length} Units Available
        </span>
      </div>

      {relevantResources.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--text-tertiary)',
          }}
        >
          No resources detected.
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            overflowY: 'auto',
          }}
        >
          {relevantResources.map((resource) => {
            let statusColor = 'var(--status-info)';
            if (resource.status === 'available') statusColor = 'var(--status-success)';
            if (resource.status === 'incident_assigned') statusColor = 'var(--status-warning)';
            if (resource.status === 'unavailable') statusColor = 'var(--status-critical)';

            return (
              <div
                key={resource.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-2)',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: statusColor,
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {resource.name}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      {resource.zone?.name || 'Mobile'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      color: statusColor,
                      fontWeight: 600,
                    }}
                  >
                    {resource.status.replace('_', ' ')}
                  </span>
                  {resource.status === 'available' && (
                    <span style={{ fontSize: '10px', color: 'var(--ai-accent)' }}>ETA ~3m</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        style={{
          marginTop: 'auto',
          backgroundColor: 'rgba(10, 132, 255, 0.1)',
          border: '1px solid rgba(10, 132, 255, 0.3)',
          color: 'var(--ai-accent)',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        Dispatch Nearest Unit
      </button>
    </div>
  );
}
