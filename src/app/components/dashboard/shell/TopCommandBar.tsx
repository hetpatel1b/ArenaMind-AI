'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useStatusPulse } from '@/lib/hooks/useLiveTelemetry';
import { useOperator, OperatorRole } from '@/lib/contexts/OperatorContext';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';
import { EnterpriseNotificationCenter } from '@/app/components/layout/notifications/EnterpriseNotificationCenter';
import { AccountCenter } from '@/app/components/layout/profile/AccountCenter';
import { HeaderTelemetry } from '@/app/components/layout/header/HeaderTelemetry';
import { HeaderActions } from '@/app/components/layout/header/HeaderActions';
import { CommandPalette } from '@/app/components/layout/command-palette/CommandPalette';

export function TopCommandBar() {
  const shouldReduceMotion = useReducedMotion();
  const pulseProps = useStatusPulse();
  const { state: opState, setRole } = useOperator();
  const { focusMode, dispatch } = useCommandCenter();

  const [unreadCount, setUnreadCount] = useState(3);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('system_notifications')
      .on('broadcast', { event: 'email_sent' }, (payload) => {
        setUnreadCount((prev) => prev + 1);
      })
      .on('broadcast', { event: 'sms_sent' }, (payload) => {
        setUnreadCount((prev) => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        height: '60px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
      }}
    >
      {/* LEFT SECTION: BRAND & STATUS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div
          style={{
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--text-lg)',
            letterSpacing: '-0.02em',
          }}
        >
          ArenaMind <span style={{ color: 'var(--ai-accent)' }}>AI</span>
        </div>

        {/* Tournament Phase Indicator */}
        <motion.div
          animate={!shouldReduceMotion ? pulseProps.animate : {}}
          transition={!shouldReduceMotion ? pulseProps.transition : {}}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-1) var(--space-2)',
            backgroundColor: 'var(--status-info-bg)',
            color: 'var(--status-info)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--status-info)',
            }}
          />
          MATCH DAY: ACTIVE
        </motion.div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-strong)' }} />

        <select
          value={opState.role}
          onChange={(e) => setRole(e.target.value as OperatorRole)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="EXECUTIVE">Executive</option>
          <option value="SECURITY">Security</option>
          <option value="MEDICAL">Medical</option>
          <option value="TRANSPORT">Transport</option>
          <option value="INFRASTRUCTURE">Infrastructure</option>
          <option value="VOLUNTEER">Volunteer</option>
        </select>
      </div>

      {/* CENTER SECTION: SEARCH & TELEMETRY */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-4)',
          flex: 1,
        }}
      >
        <HeaderTelemetry />
      </div>

      {/* RIGHT SECTION: ACTIONS & PROFILE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          position: 'relative',
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={() => dispatch({ type: 'TOGGLE_FOCUS_MODE' })}
          style={{
            padding: 'var(--space-2)',
            color: focusMode ? 'var(--ai-accent)' : 'var(--text-secondary)',
          }}
          title="Toggle Focus Mode (Cmd+K)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3h7v7H3z"></path>
            <path d="M14 3h7v7h-7z"></path>
            <path d="M14 14h7v7h-7z"></path>
            <path d="M3 14h7v7H3z"></path>
          </svg>
        </button>

        <HeaderActions />

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-strong)' }} />

        <button
          className="btn btn-ghost"
          aria-label="Notifications"
          style={{ padding: 'var(--space-2)', position: 'relative' }}
          onClick={() => {
            setUnreadCount(0);
            setIsNotifOpen(!isNotifOpen);
          }}
        >
          {/* Bell Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: 'var(--status-critical)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>

        <EnterpriseNotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        <AccountCenter />
        <CommandPalette />
      </div>
    </header>
  );
}
