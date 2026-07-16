'use client';

import React, { useState } from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import { WorkspaceSection } from './GovernanceTypes';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

export default function GovernanceNavigation() {
  const { state, dispatch } = useGovernanceWorkspace();
  const { activeSection, sidebarCollapsed, metrics } = state;
  const [hoveredSection, setHoveredSection] = useState<WorkspaceSection | null>(null);

  const getStatusForSection = (section: WorkspaceSection) => {
    switch (section) {
      case WorkspaceSection.USERS:
        return { label: 'Online', value: metrics.usersOnline, color: '#60a5fa' }; // blue-400
      case WorkspaceSection.POLICIES:
        return { label: 'Active', value: metrics.policies, color: 'rgba(255,255,255,0.6)' };
      case WorkspaceSection.AUDIT_LOGS:
        return { label: 'Events/h', value: metrics.auditEvents, color: 'rgba(255,255,255,0.6)' };
      case WorkspaceSection.CERTIFICATES:
        return metrics.certificatesExpiring > 0
          ? { label: 'Expiring', value: metrics.certificatesExpiring, color: '#fbbf24' }
          : undefined; // amber-400
      case WorkspaceSection.MODEL_REGISTRY:
        return { label: 'Models', value: metrics.aiModels, color: '#34d399' }; // emerald-400
      case WorkspaceSection.STORAGE_OVERVIEW:
        return {
          label: 'Cap',
          value: Math.round((metrics.storageUsedTb / metrics.storageCapTb) * 100),
          isPercent: true,
          color: 'rgba(255,255,255,0.6)',
        };
      default:
        return undefined;
    }
  };

  const NAV_GROUPS = [
    {
      title: 'Identity',
      items: [
        { label: 'Users', section: WorkspaceSection.USERS },
        { label: 'Roles', section: WorkspaceSection.ROLES },
        { label: 'Permissions', section: WorkspaceSection.PERMISSIONS },
      ],
    },
    {
      title: 'Security',
      items: [
        { label: 'Policies', section: WorkspaceSection.POLICIES },
        { label: 'API Keys', section: WorkspaceSection.API_KEYS },
        { label: 'Secrets', section: WorkspaceSection.SECRETS },
        { label: 'Certificates', section: WorkspaceSection.CERTIFICATES },
        { label: 'SSO', section: WorkspaceSection.SSO },
        { label: 'OAuth', section: WorkspaceSection.OAUTH },
        { label: 'OIDC', section: WorkspaceSection.OIDC },
      ],
    },
    {
      title: 'AI Providers',
      items: [{ label: 'Model Registry', section: WorkspaceSection.MODEL_REGISTRY }],
    },
    {
      title: 'Storage',
      items: [
        { label: 'Overview', section: WorkspaceSection.STORAGE_OVERVIEW },
        { label: 'Backups', section: WorkspaceSection.BACKUPS },
        { label: 'Disaster Recovery', section: WorkspaceSection.DISASTER_RECOVERY },
      ],
    },
    {
      title: 'Compliance',
      items: [{ label: 'Audit Logs', section: WorkspaceSection.AUDIT_LOGS }],
    },
    {
      title: 'Infrastructure',
      items: [
        { label: 'Edge Devices', section: WorkspaceSection.EDGE_DEVICES },
        { label: 'Infrastructure', section: WorkspaceSection.INFRASTRUCTURE },
        { label: 'Notifications', section: WorkspaceSection.NOTIFICATIONS },
      ],
    },
    {
      title: 'Enterprise',
      items: [
        { label: 'Licensing', section: WorkspaceSection.LICENSING },
        { label: 'Billing', section: WorkspaceSection.BILLING },
        { label: 'Support', section: WorkspaceSection.SUPPORT },
      ],
    },
  ];

  if (sidebarCollapsed) {
    return (
      <div
        style={{
          width: '4rem',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem 0',
          gap: '1rem',
          flexShrink: 0,
          transition: 'all 0.3s',
        }}
      >
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '1rem',
              height: '1rem',
              border: '1px solid currentColor',
              borderRadius: '0.125rem',
              opacity: 0.8,
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '16rem',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .gov-nav-scroll::-webkit-scrollbar { display: none; }
        .gov-nav-btn {
          width: 100%;
          text-align: left;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          transition: background-color 0.2s, color 0.2s;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: none;
          cursor: pointer;
          background: transparent;
        }
      `,
        }}
      />

      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.025em',
            margin: 0,
          }}
        >
          Administration
        </h2>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            color: 'rgba(255, 255, 255, 0.4)',
            padding: '0.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '0.75rem',
              height: '0.75rem',
              borderLeft: '1px solid currentColor',
              borderBottom: '1px solid currentColor',
              transform: 'rotate(45deg)',
              opacity: 0.8,
            }}
          />
        </button>
      </div>

      <div
        className="gov-nav-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <h3
              style={{
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.4)',
                fontWeight: 600,
                margin: '0 0 0.5rem 0',
                padding: '0 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {group.title}
              {group.title === 'Security' && metrics.threatCount > 0 && (
                <span
                  style={{
                    color: '#f59e0b',
                    fontWeight: 700,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    padding: '0 0.375rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  {metrics.threatCount} Threats
                </span>
              )}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              {group.items.map((item) => {
                const isActive = activeSection === item.section;
                const isHovered = hoveredSection === item.section;
                const status = getStatusForSection(item.section);

                return (
                  <button
                    key={item.section}
                    className="gov-nav-btn"
                    onClick={() => dispatch({ type: 'SET_SECTION', payload: item.section })}
                    onMouseEnter={() => setHoveredSection(item.section)}
                    onMouseLeave={() => setHoveredSection(null)}
                    style={{
                      color: isActive ? '#fff' : isHovered ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: isActive
                        ? 'rgba(255, 255, 255, 0.1)'
                        : isHovered
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          style={{
                            position: 'absolute',
                            left: 0,
                            width: '2px',
                            height: '1rem',
                            backgroundColor: '#fff',
                            borderTopRightRadius: '9999px',
                            borderBottomRightRadius: '9999px',
                          }}
                          initial={false}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span
                        style={{
                          marginLeft: isActive ? '0.25rem' : '0',
                          position: 'relative',
                          zIndex: 10,
                        }}
                      >
                        {item.label}
                      </span>
                    </div>

                    {status && (
                      <div
                        style={{
                          fontSize: '0.5625rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          opacity: isActive || isHovered ? 1 : 0.7,
                          transition: 'opacity 0.2s',
                          color: status.color,
                        }}
                      >
                        <span>{status.label}</span>
                        <AnimatedNumber
                          value={status.value}
                          format={(v) =>
                            status.isPercent ? `${Math.round(v)}%` : Math.round(v).toString()
                          }
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
