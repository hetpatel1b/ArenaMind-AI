import React, { memo } from 'react';
import { motion } from 'framer-motion';

import { TrafficStatus } from './MobilityTypes';

export interface TransportHealth {
  status: TrafficStatus;
  progress: number;
  trend: 'up' | 'down' | 'neutral';
  capacity: number;
  health: number;
  sparkline: number[];
}

export interface MobilitySidebarProps {
  data: {
    metro: TransportHealth;
    bus: TransportHealth;
    road: TransportHealth;
    parking: TransportHealth;
    rideShare: TransportHealth;
    emergency: TransportHealth;
    accessibility: TransportHealth;
  };
  isCollapsed: boolean;
}

const HealthRow = memo(function HealthRow({
  label,
  health,
}: {
  label: string;
  health: TransportHealth;
}) {
  const getStatusColor = (status: TransportHealth['status']) => {
    if (status === 'CRITICAL') return '#EF4444';
    if (status === 'DEGRADED') return '#F59E0B';
    return '#10B981';
  };

  const sparklinePath = React.useMemo(() => {
    if (!health.sparkline || health.sparkline.length === 0) return '';
    const max = 100;
    const min = 0;
    const width = 60;
    const height = 16;
    const step = width / (health.sparkline.length - 1);

    let path = '';
    for (let idx = 0; idx < health.sparkline.length; idx++) {
      const val = health.sparkline[idx] || 0;
      const x = idx * step;
      const y = height - ((val - min) / (max - min)) * height;
      path += idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return path;
  }, [health.sparkline]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.02)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#E4E4E7' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="60" height="16" style={{ marginRight: '8px' }}>
            <path
              d={sparklinePath}
              fill="none"
              stroke={getStatusColor(health.status)}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>{Math.round(health.health)}%</span>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: getStatusColor(health.status),
              transition: 'background 0.3s',
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${health.capacity}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ height: '100%', background: '#3B82F6', borderRadius: '2px' }}
          />
        </div>
        <span style={{ fontSize: '11px', color: '#71717A', width: '32px', textAlign: 'right' }}>
          {Math.round(health.capacity)}%
        </span>
      </div>
    </div>
  );
});

export const MobilitySidebar = memo(function MobilitySidebar({
  data,
  isCollapsed,
}: MobilitySidebarProps) {
  return (
    <div
      style={{
        width: isCollapsed ? '0px' : '320px',
        opacity: isCollapsed ? 0 : 1,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s',
        height: '100%',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
        overflowX: 'hidden',
        flexShrink: 0,
      }}
    >
      <motion.div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Transport Health
          </h2>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            gap: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#A1A1AA',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Priority Queue
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                flex: 1,
                padding: '6px 0',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3B82F6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Urgent
            </button>
            <button
              style={{
                flex: 1,
                padding: '6px 0',
                background: 'transparent',
                color: '#A1A1AA',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Active
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <HealthRow label="Metro Network" health={data.metro} />
          <HealthRow label="Bus Operations" health={data.bus} />
          <HealthRow label="Road / Traffic" health={data.road} />
          <HealthRow label="Parking Status" health={data.parking} />
          <HealthRow label="Ride Share / VIP" health={data.rideShare} />
          <HealthRow label="Emergency Corridors" health={data.emergency} />
          <HealthRow label="Accessibility" health={data.accessibility} />
        </div>
      </motion.div>
    </div>
  );
});
