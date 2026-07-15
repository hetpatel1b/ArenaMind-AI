import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function ExecutiveImpactAnalysis({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div
      style={{
        background: 'rgba(62,130,247,0.05)',
        border: '1px solid rgba(62,130,247,0.2)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{ fontSize: '12px', color: '#3e82f7', textTransform: 'uppercase', fontWeight: 600 }}
      >
        Executive Impact Analysis
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ImpactRow label="Peak Density" current={92} projected={78} unit="%" inverted />
        <ImpactRow label="Compression Score" current={85} projected={40} unit="/100" inverted />
        <ImpactRow label="Flow Rate" current={45} projected={110} unit="pm" />
      </div>
    </div>
  );
}

function ImpactRow({
  label,
  current,
  projected,
  unit,
  inverted,
}: {
  label: string;
  current: number;
  projected: number;
  unit: string;
  inverted?: boolean;
}) {
  const springVal = useSpring(current, { bounce: 0, duration: 2000 });
  const [displayVal, setDisplayVal] = useState(current);

  useEffect(() => {
    springVal.set(projected);
  }, [projected, springVal]);

  useEffect(() => {
    return springVal.on('change', (latest) => {
      setDisplayVal(Math.round(latest));
    });
  }, [springVal]);

  const isImproved = inverted ? projected < current : projected > current;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textDecoration: 'line-through',
          }}
        >
          {current}
          {unit}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>→</div>
        <motion.div
          style={{ fontSize: '14px', fontWeight: 600, color: isImproved ? '#34c759' : '#ff453a' }}
        >
          {displayVal}
          {unit}
        </motion.div>
      </div>
    </div>
  );
}
