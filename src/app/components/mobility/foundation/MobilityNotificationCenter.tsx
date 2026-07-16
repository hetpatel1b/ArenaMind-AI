import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobilityAlert } from './MobilityTypes';

export interface MobilityNotificationCenterProps {
  alerts: MobilityAlert[];
}

export const MobilityNotificationCenter = memo(function MobilityNotificationCenter({
  alerts,
}: MobilityNotificationCenterProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
        width: '340px',
      }}
    >
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: index * -4 }} // Auto stacking visual offset
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            layout
            style={{
              background: 'rgba(26, 29, 36, 0.85)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              padding: '16px',
              pointerEvents: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: alert.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                    boxShadow: `0 0 8px ${alert.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B'}`,
                  }}
                />
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {alert.title}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#71717A' }}>
                {new Date(alert.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: '#E4E4E7', lineHeight: 1.4 }}>
              {alert.description}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Approve Route
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#A1A1AA',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Jump to Map
              </button>
              <button
                style={{
                  padding: '8px 12px',
                  background: 'transparent',
                  color: '#71717A',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});
