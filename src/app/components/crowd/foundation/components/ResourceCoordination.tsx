import React from 'react';
import { motion } from 'framer-motion';
import { ResourceTelemetry } from '../hooks/useCrowdBehaviorEngine';

export const ResourceCoordination = React.memo(function ResourceCoordination({
  resources,
}: {
  resources: ResourceTelemetry[];
}) {
  return (
    <div
      style={{
        background: 'var(--bg-app, #0F1115)',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '380px',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Resource Coordination
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {resources.filter((r) => r.status === 'available').length} Available
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {resources.map((r) => (
          <ResourceRow key={r.id} resource={r} />
        ))}
      </div>
    </div>
  );
});

function ResourceRow({ resource }: { resource: ResourceTelemetry }) {
  const getStatusColor = () => {
    switch (resource.status) {
      case 'available':
        return '#34c759';
      case 'busy':
        return '#ff9f0a';
      case 'en_route':
        return '#3e82f7';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <motion.div
      whileHover={{
        y: -2,
        backgroundColor: 'rgba(255,255,255,0.05)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '6px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: getStatusColor(),
          boxShadow: `0 0 8px ${getStatusColor()}`,
        }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{resource.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{resource.type}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {resource.currentAssignment}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            ETA: {resource.eta} ({resource.distance})
          </div>
        </div>
      </div>
    </motion.div>
  );
}
