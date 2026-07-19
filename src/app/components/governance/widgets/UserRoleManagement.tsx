'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface UserRoleManagementProps {
  users: SafeAny[];
}

export function UserRoleManagement({ users }: UserRoleManagementProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '400px',
        maxHeight: '450px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            User & Role Management
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Access Control List
          </span>
        </div>
        <button
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--text-primary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Provision User
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 'var(--space-3)',
            padding: 'var(--space-2) var(--space-3)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Identity
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Role
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Status
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Last Active
          </span>
        </div>

        {/* Table Body */}
        {users.map((user, idx) => {
          const roleDisplay = user.role.replace('_', ' ').toUpperCase();
          const isActive = user.isActive;

          return (
            <motion.div
              key={user.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-sm)',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                  }}
                >
                  {user.fullName}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'monospace',
                  }}
                >
                  {user.id.substring(0, 8)}...
                </span>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '9px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: user.role === 'operations_manager' ? '#5E5CE6' : 'var(--text-secondary)',
                  }}
                >
                  {roleDisplay}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--status-success)' : 'var(--text-tertiary)',
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: isActive ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                  }}
                >
                  {isActive ? 'Active (MFA)' : 'Suspended'}
                </span>
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                {user.lastSeenAt ? new Date(user.lastSeenAt).toLocaleDateString() : 'Never'}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
