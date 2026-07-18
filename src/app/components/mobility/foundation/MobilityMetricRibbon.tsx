import React, { memo, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export interface MobilityMetrics {
  metroHealth: number; // 0-100
  busCapacity: number; // 0-100
  parkingOccupancy: number; // 0-100
  trafficLoad: number; // 0-100
  emergencyRoutes: 'CLEAR' | 'IMPACTED';
  vipRoutes: 'CLEAR' | 'IMPACTED';
  averageETA: string;
  congestionIndex: number; // 0.0-10.0
  predictedDelay: string;
  networkAvailability: number; // 0-100
  fleetReadiness: number; // 0-100
  signalHealth: number; // 0-100
}

interface MobilityMetricRibbonProps {
  metrics: MobilityMetrics;
}

function AnimatedNumber({ value }: { value: string | number }) {
  const isNumber =
    typeof value === 'number' || !isNaN(Number(String(value).replace(/[^0-9.-]+/g, '')));
  const numericValue = isNumber ? Number(String(value).replace(/[^0-9.-]+/g, '')) : 0;

  const spring = useSpring(numericValue, { stiffness: 300, damping: 30 });

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  const display = useTransform(spring, (current) => {
    if (!isNumber) return value;
    const isFloat = String(value).includes('.');
    const formatted = isFloat ? current.toFixed(1) : Math.round(current).toString();
    return String(value).replace(/[0-9.-]+/, formatted);
  });

  return (
    <motion.span style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>
      {isNumber ? display : value}
    </motion.span>
  );
}

const MetricCard = memo(function MetricCard({
  label,
  value,
  trend,
  status,
}: {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'critical';
}) {
  const getStatusColor = () => {
    if (status === 'critical') return '#EF4444';
    if (status === 'warning') return '#F59E0B';
    return '#10B981'; // good/default
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        minWidth: '120px',
        willChange: 'transform',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          color: '#A1A1AA',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <AnimatedNumber value={value} />
        {status && (
          <motion.div
            animate={{ background: getStatusColor() }}
            transition={{ duration: 0.3 }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
            }}
          />
        )}
      </div>
    </motion.div>
  );
});

export const MobilityMetricRibbon = memo(function MobilityMetricRibbon({
  metrics,
}: MobilityMetricRibbonProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        padding: '12px 20px',
        overflowX: 'auto',
        background: 'var(--bg-default, #0D0F12)',
        borderBottom: '1px solid rgba(255,255,255,0.02)',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}
    >
      <MetricCard
        label="Metro Health"
        value={`${metrics.metroHealth ?? 0}%`}
        status={(metrics.metroHealth ?? 0) > 90 ? 'good' : 'warning'}
      />
      <MetricCard
        label="Bus Capacity"
        value={`${metrics.busCapacity ?? 0}%`}
        status={(metrics.busCapacity ?? 0) > 80 ? 'warning' : 'good'}
      />
      <MetricCard
        label="Parking Occup."
        value={`${metrics.parkingOccupancy ?? 0}%`}
        status={(metrics.parkingOccupancy ?? 0) > 90 ? 'critical' : 'good'}
      />
      <MetricCard
        label="Traffic Load"
        value={`${metrics.trafficLoad ?? 0}%`}
        status={(metrics.trafficLoad ?? 0) > 70 ? 'warning' : 'good'}
      />
      <MetricCard
        label="Emerg. Routes"
        value={metrics.emergencyRoutes}
        status={metrics.emergencyRoutes === 'CLEAR' ? 'good' : 'critical'}
      />
      <MetricCard
        label="VIP Routes"
        value={metrics.vipRoutes}
        status={metrics.vipRoutes === 'CLEAR' ? 'good' : 'warning'}
      />
      <MetricCard label="Avg ETA" value={metrics.averageETA} />
      <MetricCard
        label="Congestion Idx"
        value={(metrics.congestionIndex ?? 0).toFixed(1)}
        status={(metrics.congestionIndex ?? 0) > 7 ? 'warning' : 'good'}
      />
      <MetricCard label="Pred. Delay" value={metrics.predictedDelay} />
      <MetricCard
        label="Network Avail."
        value={`${metrics.networkAvailability ?? 0}%`}
        status={(metrics.networkAvailability ?? 0) > 98 ? 'good' : 'critical'}
      />
      <MetricCard
        label="Fleet Ready"
        value={`${metrics.fleetReadiness ?? 0}%`}
        status={(metrics.fleetReadiness ?? 0) > 85 ? 'good' : 'warning'}
      />
      <MetricCard
        label="Signal Health"
        value={`${metrics.signalHealth ?? 0}%`}
        status={(metrics.signalHealth ?? 0) > 95 ? 'good' : 'critical'}
      />
    </div>
  );
});
