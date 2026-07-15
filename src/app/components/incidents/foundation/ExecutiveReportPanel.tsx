import React from 'react';
import { motion } from 'framer-motion';
import { Incident } from './IncidentTypes';

export function ExecutiveReportPanel({ incident }: { incident: Incident }) {
  return (
    <div
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
        overflowY: 'auto',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '800px',
          background: '#fff',
          borderRadius: '4px',
          padding: '48px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          color: '#14161A',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '2px solid #14161A',
            paddingBottom: '16px',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
              EXECUTIVE INCIDENT SUMMARY
            </h1>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              ArenaMind Platform Generated Report
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{incident.id}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div
              style={{
                fontSize: '10px',
                color: '#666',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Incident Category
            </div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>{incident.category}</div>
          </div>
          <div>
            <div
              style={{
                fontSize: '10px',
                color: '#666',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Location
            </div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>{incident.location}</div>
          </div>
          <div>
            <div
              style={{
                fontSize: '10px',
                color: '#666',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Priority Level
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: incident.priority === 'CRITICAL' ? '#ff453a' : '#14161A',
              }}
            >
              {incident.priority}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '10px',
                color: '#666',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Current Stage
            </div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>{incident.currentStage}</div>
          </div>
        </div>

        <div>
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 700,
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: '8px',
              marginBottom: '16px',
            }}
          >
            AI Reasoning Log
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {incident.reasoningLog?.slice(0, 4).map((log) => (
              <div key={log.id} style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                <div style={{ color: '#666', width: '60px' }}>
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div style={{ flex: 1 }}>{log.message}</div>
                <div style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase' }}>
                  {log.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 700,
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: '8px',
              marginBottom: '16px',
            }}
          >
            Operational Impact
          </h2>
          <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#333' }}>
            Based on preliminary data from the ArenaMind intelligence engine, this incident has a{' '}
            {incident.aiConfidence}% confidence rating for potential escalation. Immediate
            deployment of{' '}
            {incident.priority === 'CRITICAL'
              ? 'multi-department task forces'
              : 'localized response units'}{' '}
            has been requested. Surrounding mobility and crowd metrics indicate nominal disruption
            at this stage.
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '32px',
            textAlign: 'center',
            fontSize: '10px',
            color: '#999',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          CONFIDENTIAL - FOR AUTHORIZED PERSONNEL ONLY
        </div>
      </motion.div>
    </div>
  );
}
