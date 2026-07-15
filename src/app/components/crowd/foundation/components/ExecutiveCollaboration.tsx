import React from 'react';
import { motion } from 'framer-motion';

export function ExecutiveCollaboration() {
  const activeOperators = [
    { name: 'Cmdr. Hayes', role: 'Security', color: '#ff453a' },
    { name: 'Dr. Lin', role: 'Medical', color: '#34c759' },
    { name: 'Dir. Vance', role: 'Executive', color: '#3e82f7' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '24px',
        padding: '4px 16px 4px 4px',
        height: '40px',
      }}
    >
      <div style={{ display: 'flex' }}>
        {activeOperators.map((op, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: op.color,
              marginLeft: i > 0 ? '-12px' : 0,
              border: '2px solid var(--bg-app, #0F1115)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#fff',
              zIndex: 10 - i,
              cursor: 'pointer',
            }}
            title={`${op.name} (${op.role})`}
          >
            {op.name.charAt(0)}
          </motion.div>
        ))}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        3 viewing recommendation
      </div>
    </div>
  );
}
