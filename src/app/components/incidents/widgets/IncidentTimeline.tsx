'use client';

import React from 'react';

interface IncidentTimelineProps {
  incident: any | null;
}

export function IncidentTimeline({ incident }: IncidentTimelineProps) {
  if (!incident) {
    return (
      <div
        style={{
          padding: 'var(--space-4)',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderRadius: 'var(--radius-xl)',
          height: '100%',
        }}
      >
        No timeline available
      </div>
    );
  }

  // Generate a mock timeline based on the incident's known timestamps (createdAt, resolvedAt, etc)
  // In a full implementation, this would map over an `IncidentEventLog` table
  const timelineEvents = [
    { title: 'Incident Reported', time: incident.createdAt, type: 'creation' },
  ];

  if (incident.aiClassificationAt) {
    timelineEvents.push({
      title: 'AI Classified & Prioritized',
      time: incident.aiClassificationAt,
      type: 'ai',
    });
  }

  if (incident.assignedTo) {
    // Fake assignment time slightly after creation for demo
    const assignTime = new Date(new Date(incident.createdAt).getTime() + 60000);
    timelineEvents.push({
      title: 'Resources Dispatched',
      time: assignTime.toISOString(),
      type: 'resource',
    });
  }

  if (incident.resolvedAt) {
    timelineEvents.push({
      title: 'Incident Resolved',
      time: incident.resolvedAt,
      type: 'resolution',
    });
  } else {
    timelineEvents.push({
      title: 'Active Investigation',
      time: new Date().toISOString(),
      type: 'active',
    });
  }

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
        maxHeight: '400px',
        overflowY: 'auto',
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
        Incident Lifecycle
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          position: 'relative',
          marginTop: 'var(--space-2)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />

        {timelineEvents.map((event, idx) => {
          let dotColor = 'var(--text-secondary)';
          if (event.type === 'ai') dotColor = 'var(--ai-accent)';
          if (event.type === 'resolution') dotColor = 'var(--status-success)';
          if (event.type === 'active') dotColor = 'var(--status-warning)';

          return (
            <div
              key={idx}
              style={{ display: 'flex', gap: 'var(--space-3)', position: 'relative', zIndex: 1 }}
            >
              <div
                style={{
                  marginTop: '4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  border: `2px solid ${dotColor}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                  }}
                >
                  {event.title}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {new Date(event.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
