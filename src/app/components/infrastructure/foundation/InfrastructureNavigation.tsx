'use client';

import React, { useState } from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import { WorkspaceSection } from './InfrastructureTypes';

const NavGroup = ({
  title,
  children,
  defaultExpanded = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#555',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title}
        <span>{expanded ? '−' : '+'}</span>
      </div>
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{children}</div>
      )}
    </div>
  );
};

const NavItem = ({
  section,
  label,
  statusIndicator = 'none',
}: {
  section: WorkspaceSection;
  label: string;
  statusIndicator?: 'none' | 'good' | 'warning' | 'error';
}) => {
  const { state, dispatch } = useInfrastructureWorkspace();
  const isActive = state.selectedSection === section;

  return (
    <div
      onClick={() => dispatch({ type: 'SET_SECTION', payload: section })}
      style={{
        padding: '6px 8px',
        fontSize: '13px',
        color: isActive ? '#fff' : '#888',
        backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
      }}
    >
      <span>{label}</span>
      {statusIndicator !== 'none' && (
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor:
              statusIndicator === 'good'
                ? '#00ffcc'
                : statusIndicator === 'warning'
                  ? '#ffaa00'
                  : '#ff3333',
            boxShadow: isActive
              ? `0 0 8px ${statusIndicator === 'good' ? '#00ffcc' : statusIndicator === 'warning' ? '#ffaa00' : '#ff3333'}`
              : 'none',
          }}
        />
      )}
    </div>
  );
};

const NavigationItem = ({
  icon,
  label,
  id,
  isSelected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  id: string;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        cursor: 'pointer',
        backgroundColor: isSelected ? 'rgba(0, 255, 204, 0.05)' : 'transparent',
        borderLeft: isSelected ? '2px solid #00ffcc' : '2px solid transparent',
        color: isSelected ? '#fff' : '#888',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ marginRight: '16px', opacity: isSelected ? 1 : 0.5 }}>{icon}</div>
      <span style={{ fontSize: '13px', fontWeight: isSelected ? 500 : 400 }}>{label}</span>
    </div>
  );
};

const InfrastructureNavigation: React.FC = React.memo(() => {
  const { state, dispatch } = useInfrastructureWorkspace();

  return (
    <div
      style={{
        width: '240px',
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '24px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h2
          style={{
            fontSize: '11px',
            color: '#555',
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '1px',
            margin: '0 0 16px 0',
          }}
        >
          Infrastructure
        </h2>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search resources... (⌘K)"
            value={state.search}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              padding: '8px 12px',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <NavItem
          section={WorkspaceSection.INFRASTRUCTURE}
          label="Global Topology"
          statusIndicator="good"
        />

        <div style={{ height: '16px' }} />

        <NavGroup title="Compute">
          <NavItem
            section={WorkspaceSection.GPU_CLUSTER}
            label="GPU Cluster"
            statusIndicator="good"
          />
          <NavItem section={WorkspaceSection.CONTAINERS} label="Containers" />
          <NavItem
            section={WorkspaceSection.KUBERNETES}
            label="Kubernetes"
            statusIndicator="good"
          />
        </NavGroup>

        <NavGroup title="Networking">
          <NavItem
            section={WorkspaceSection.API_GATEWAY}
            label="API Gateway"
            statusIndicator="good"
          />
          <NavItem section={WorkspaceSection.LOAD_BALANCER} label="Load Balancer" />
          <NavItem section={WorkspaceSection.DNS} label="DNS Routing" />
          <NavItem section={WorkspaceSection.CDN} label="CDN Edge" statusIndicator="good" />
        </NavGroup>

        <NavGroup title="Storage">
          <NavItem section={WorkspaceSection.DATABASES} label="Databases" statusIndicator="good" />
          <NavItem section={WorkspaceSection.REDIS} label="Redis Cache" statusIndicator="good" />
          <NavItem section={WorkspaceSection.BLOB_STORAGE} label="Blob Storage" />
          <NavItem section={WorkspaceSection.OBJECT_STORAGE} label="Object Storage" />
        </NavGroup>

        <NavGroup title="Messaging">
          <NavItem section={WorkspaceSection.KAFKA} label="Kafka Streams" statusIndicator="good" />
          <NavItem section={WorkspaceSection.RABBITMQ} label="RabbitMQ" />
          <NavItem section={WorkspaceSection.QUEUES} label="Task Queues" />
        </NavGroup>

        <NavGroup title="AI Engine">
          <NavItem section={WorkspaceSection.GEMINI} label="Gemini Models" statusIndicator="good" />
          <NavItem
            section={WorkspaceSection.VISION_MODELS}
            label="Vision Models"
            statusIndicator="good"
          />
          <NavItem section={WorkspaceSection.EMBEDDING} label="Embedding API" />
          <NavItem section={WorkspaceSection.VECTOR_DB} label="Vector DB" statusIndicator="good" />
        </NavGroup>

        <NavGroup title="Edge">
          <NavItem section={WorkspaceSection.CAMERAS} label="Cameras" statusIndicator="good" />
          <NavItem section={WorkspaceSection.IOT} label="IoT Devices" />
          <NavItem section={WorkspaceSection.SENSORS} label="Sensors" />
        </NavGroup>

        <NavGroup title="Security" defaultExpanded={false}>
          <NavItem
            section={WorkspaceSection.CERTIFICATES}
            label="Certificates"
            statusIndicator="good"
          />
          <NavItem section={WorkspaceSection.SECRETS} label="Secrets Engine" />
          <NavItem section={WorkspaceSection.FIREWALL} label="Firewall Rules" />
          <NavItem section={WorkspaceSection.IDENTITY} label="Identity Providers" />
        </NavGroup>

        <NavGroup title="System" defaultExpanded={false}>
          <NavItem section={WorkspaceSection.LOGS} label="Central Logs" />
          <NavItem section={WorkspaceSection.METRICS} label="Metrics Server" />
          <NavItem
            section={WorkspaceSection.BACKUPS}
            label="Global Backups"
            statusIndicator="good"
          />
          <NavItem section={WorkspaceSection.RECOVERY} label="Disaster Recovery" />
          <NavItem section={WorkspaceSection.MAINTENANCE} label="Maintenance" />
        </NavGroup>
      </div>
    </div>
  );
});

InfrastructureNavigation.displayName = 'InfrastructureNavigation';

export default InfrastructureNavigation;
