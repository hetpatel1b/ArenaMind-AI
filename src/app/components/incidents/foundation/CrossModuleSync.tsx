import React from 'react';
import { motion } from 'framer-motion';

export function CrossModuleSync() {
  return (
    <div
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>
          Global Intelligence Sync
        </h2>
        <div
          style={{
            fontSize: '12px',
            color: '#34c759',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34c759' }} /> LIVE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Crowd Intelligence Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(191,90,242,0.3)',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#bf5af2',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Crowd Intelligence
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Density Warning</span>
              <span style={{ color: '#ff453a', fontWeight: 600 }}>Sector 4 (Critical)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Flow Rate</span>
              <span style={{ color: '#fff' }}>1.2m/s (Restricted)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Projected Impact</span>
              <span style={{ color: '#ff9f0a' }}>Spillover in 15m</span>
            </div>
          </div>
        </motion.div>

        {/* Mobility Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,159,10,0.3)',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#ff9f0a',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Mobility & Traffic
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Road Closures</span>
              <span style={{ color: '#ff453a', fontWeight: 600 }}>Main St, 5th Ave</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Traffic Speed</span>
              <span style={{ color: '#fff' }}>5 mph (Gridlock)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Evacuation Route</span>
              <span style={{ color: '#34c759' }}>Clear via Highway 9</span>
            </div>
          </div>
        </motion.div>

        {/* Weather Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(62,130,247,0.3)',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#3e82f7',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Atmospheric
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Current Temp</span>
              <span style={{ color: '#fff' }}>72°F</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Wind</span>
              <span style={{ color: '#fff' }}>14mph NE (Gusts 20mph)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Visibility</span>
              <span style={{ color: '#34c759' }}>10 mi (Clear)</span>
            </div>
          </div>
        </motion.div>

        {/* Map Feeds Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#fff',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Camera Network
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Nearby Feeds</span>
              <span style={{ color: '#fff' }}>14 Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Facial Rec</span>
              <span style={{ color: '#34c759' }}>Running</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>LPR Systems</span>
              <span style={{ color: '#ff9f0a' }}>2 Hits Detected</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
