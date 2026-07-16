import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MobilityTimelineProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const MobilityTimeline = memo(function MobilityTimeline({
  isExpanded,
  onToggle,
}: MobilityTimelineProps) {
  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? '140px' : '32px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        flex: '0 0 auto',
        zIndex: 10,
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderTop: '1px solid rgba(255,255,255,0.02)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          background: 'transparent',
          border: 'none',
          width: '100%',
          padding: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          height: '32px',
          flexShrink: 0,
        }}
        aria-label={isExpanded ? 'Collapse timeline' : 'Expand timeline'}
      >
        <div
          style={{
            width: '40px',
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
          }}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              flex: 1,
              padding: '0 24px 16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Mobility Timeline
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge label="PAST" active={false} />
                <Badge label="LIVE" active={true} />
                <Badge label="PEAK" active={false} />
                <Badge label="PREDICTION" active={false} />
                <Badge label="RECOVERY" active={false} />
                <Badge label="NORMAL" active={false} />
              </div>
            </div>

            {/* Timeline Track Placeholder */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'rgba(255,255,255,0.1)',
                }}
              />

              {/* Animated Live Playhead */}
              <motion.div
                animate={{ x: ['-50%', '50%', '-50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#3B82F6',
                  border: '2px solid #1A1D24',
                  zIndex: 10,
                  boxShadow: '0 0 8px #3B82F6',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  left: '20%',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.4)',
                  border: '2px solid #1A1D24',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '80%',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.4)',
                  border: '2px solid #1A1D24',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#71717A' }}>T - 2h</span>
              <span style={{ fontSize: '11px', color: '#3B82F6' }}>NOW</span>
              <span style={{ fontSize: '11px', color: '#71717A' }}>T + 2h</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

function Badge({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        background: active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? 'rgba(59, 130, 246, 0.5)' : 'transparent'}`,
        color: active ? '#3B82F6' : '#A1A1AA',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </div>
  );
}
