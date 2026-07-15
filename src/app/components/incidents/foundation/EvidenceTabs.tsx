'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Evidence } from './IncidentTypes';
import { EvidenceGallery } from './EvidenceGallery';
import { EvidenceTimeline } from './EvidenceTimeline';

export function EvidenceTabs({ evidence = [] }: { evidence?: Evidence[] }) {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'MEDIA' | 'COMMS'>('MEDIA');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.02)',
        }}
      >
        {(['MEDIA', 'LOGS', 'COMMS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '16px 0',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary, #A0A5B1)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s',
            }}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeEvidenceTab"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#3e82f7',
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {evidence.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  style={{ marginBottom: '16px', opacity: 0.5 }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <div
                  style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}
                >
                  No Evidence Collected
                </div>
                <div style={{ fontSize: '12px' }}>Waiting for incoming telemetry.</div>
              </div>
            ) : (
              <>
                {activeTab === 'MEDIA' && (
                  <EvidenceGallery
                    items={evidence.filter((e) => e.type === 'PHOTO' || e.type === 'CCTV')}
                  />
                )}
                {activeTab === 'LOGS' && (
                  <EvidenceTimeline
                    items={evidence.filter((e) => e.type === 'NOTE' || e.type === 'AI_OBSERVATION')}
                  />
                )}
                {activeTab === 'COMMS' && (
                  <EvidenceTimeline items={evidence.filter((e) => e.type === 'RADIO')} />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
