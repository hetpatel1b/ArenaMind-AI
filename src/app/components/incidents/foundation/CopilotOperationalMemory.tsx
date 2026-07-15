import React from 'react';
import { motion } from 'framer-motion';

export function CopilotOperationalMemory() {
  const pastIncidents = [
    { id: 'INC-2025-881', date: 'Oct 14, 2025', similarity: 94, success: 98, recovery: '14m' },
    { id: 'INC-2025-632', date: 'Jul 02, 2025', similarity: 89, success: 92, recovery: '22m' },
    { id: 'INC-2024-114', date: 'Feb 19, 2024', similarity: 76, success: 100, recovery: '8m' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{ fontSize: '12px', color: '#bf5af2', textTransform: 'uppercase', fontWeight: 600 }}
      >
        AI Operational Memory
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}
        >
          Memory Context
        </div>
        <div style={{ fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>
          Historical analysis indicates a high probability of localized containment. Previous
          similar incidents were resolved using primarily Security and Police assets.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}
        >
          Similar Incidents
        </div>
        {pastIncidents.map((inc, i) => (
          <motion.div
            key={inc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{inc.id}</div>
              <div style={{ fontSize: '11px', color: '#34c759' }}>{inc.similarity}% MATCH</div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              <span>{inc.date}</span>
              <span>Recovery: {inc.recovery}</span>
              <span>Success: {inc.success}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        style={{
          background: 'rgba(191,90,242,0.1)',
          border: '1px solid rgba(191,90,242,0.3)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '11px', color: '#bf5af2', textTransform: 'uppercase' }}>
          Executive Note
        </div>
        <div style={{ fontSize: '13px', color: '#fff' }}>
          &quot;Ensure secondary perimeter is established before medical ingress.&quot; - Dir. Vance
          (2025)
        </div>
      </div>
    </div>
  );
}
