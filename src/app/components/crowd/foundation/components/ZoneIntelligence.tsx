import React from 'react';
import { ZoneCard } from './ZoneCard';
import { ZoneTelemetryExt } from '../hooks/useCrowdBehaviorEngine';

export const ZoneIntelligence = React.memo(function ZoneIntelligence({
  zones,
}: {
  zones: ZoneTelemetryExt[];
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'var(--bg-app, #0F1115)',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '12px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Zone Intelligence
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #A0A5B1)' }}>
          {zones.filter((z) => z.riskLevel === 'critical' || z.riskLevel === 'high').length} Zones
          at Risk
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px',
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
});
