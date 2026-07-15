import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export interface MetricStripProps {
  metrics: {
    averageDensity: number;
    peakDensity: number;
    occupancy: number;
    ingressRate: number;
    egressRate: number;
    bottleneckCount: number;
    criticalZones: number;
    safeZones: number;
  };
}

export function MetricStrip({ metrics }: MetricStripProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        <AnimatedMetric
          label="Peak Density"
          value={metrics.peakDensity}
          unit="%"
          color={metrics.peakDensity > 90 ? '#ff453a' : '#fff'}
          size="primary"
        />
        <AnimatedMetric
          label="Critical Zones"
          value={metrics.criticalZones}
          unit=""
          color={metrics.criticalZones > 0 ? '#ff453a' : '#34c759'}
          size="primary"
        />
      </div>
      <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <AnimatedMetric
          label="Avg Density"
          value={metrics.averageDensity}
          unit="%"
          size="secondary"
        />
        <AnimatedMetric label="Occupancy" value={metrics.occupancy} unit="" size="secondary" />
        <AnimatedMetric label="Ingress" value={metrics.ingressRate} unit="/m" size="secondary" />
        <AnimatedMetric label="Egress" value={metrics.egressRate} unit="/m" size="secondary" />
      </div>
      <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <AnimatedMetric
          label="Bottlenecks"
          value={metrics.bottleneckCount}
          unit=""
          color={metrics.bottleneckCount > 0 ? '#ff9f0a' : undefined}
          size="tertiary"
        />
        <AnimatedMetric
          label="Safe Zones"
          value={metrics.safeZones}
          unit=""
          color="#34c759"
          size="tertiary"
        />
      </div>
    </div>
  );
}

function AnimatedMetric({
  label,
  value,
  unit,
  color = '#fff',
  size = 'secondary',
}: {
  label: string;
  value: number;
  unit: string;
  color?: string;
  size?: 'primary' | 'secondary' | 'tertiary';
}) {
  const springValue = useSpring(value, { bounce: 0, duration: 800 });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      // If it's a decimal like average density, keep 1 decimal place, else round
      if (latest % 1 !== 0 && latest.toString().includes('.')) {
        setDisplayValue(Number(latest.toFixed(1)));
      } else {
        setDisplayValue(Math.round(latest));
      }
    });
  }, [springValue]);

  return (
    <div
      style={{
        flex: '0 0 auto',
        background: size === 'primary' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
        border:
          size === 'primary'
            ? `1px solid ${color !== '#fff' ? color : 'rgba(255,255,255,0.1)'}`
            : '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
        borderRadius: '8px',
        padding: size === 'primary' ? '16px 20px' : size === 'secondary' ? '12px 16px' : '8px 12px',
        minWidth: size === 'primary' ? '160px' : size === 'secondary' ? '120px' : '100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${size === 'primary' && color !== '#fff' ? color + '40' : 'rgba(0,0,0,0.2)'}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          fontSize: size === 'primary' ? '12px' : '10px',
          color: 'var(--text-secondary, #A0A5B1)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
        <motion.span
          style={{
            fontSize: size === 'primary' ? '28px' : size === 'secondary' ? '20px' : '16px',
            fontWeight: 600,
            color,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {displayValue}
        </motion.span>
        {unit && (
          <span
            style={{
              fontSize: size === 'primary' ? '14px' : '11px',
              color: 'var(--text-secondary, #A0A5B1)',
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
