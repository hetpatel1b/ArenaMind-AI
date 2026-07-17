'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { CrowdDirective } from './foundation/components/CrowdDirective';
import { MetricStrip } from './foundation/components/MetricStrip';
import { InteractiveCrowdHeatmap } from './foundation/components/InteractiveCrowdHeatmap';
import { ZoneIntelligence } from './foundation/components/ZoneIntelligence';
import { BehaviorIntelligence } from './foundation/components/BehaviorIntelligence';
import { FlowAnalytics } from './foundation/components/FlowAnalytics';
import { QueueIntelligence } from './foundation/components/QueueIntelligence';
import { CrowdTimeline } from './foundation/components/CrowdTimeline';
import {
  CrowdWorkspaceRightPanel,
  RightPanelMode,
} from './foundation/components/CrowdWorkspaceRightPanel';
import { LiveMissionTracker } from './foundation/components/LiveMissionTracker';
import { ResourceCoordination } from './foundation/components/ResourceCoordination';
import { ExecutiveCollaboration } from './foundation/components/ExecutiveCollaboration';

import { useCrowdBehaviorEngine } from './foundation/hooks/useCrowdBehaviorEngine';

// We map mock data here but eventually use matchData to bootstrap the engine.
export function CrowdIntelligenceWorkspace({ matchData }: { matchData: any }) {
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('NONE');

  // The new connected state engine
  const { state } = useCrowdBehaviorEngine(matchData?.id || '123e4567-e89b-12d3-a456-426614174000');

  // Re-derive behavior metrics to feed legacy signature of BehaviorIntelligence
  // (In a real app, BehaviorIntelligence would accept the new state directly, but for now we map it)
  const behaviorMock = {
    flowStability: {
      value: 85 - state.global.peakDensity * 0.2,
      trend: 'stable',
      status: 'optimal',
    },
    crowdMood: { value: state.zones[0]?.mood || 90, trend: 'stable', status: 'optimal' },
    compressionRisk: {
      value:
        state.zones.find((z) => z.id === state.global.highestRiskZoneId)?.compressionScore || 10,
      trend: 'up',
      status: 'warning',
    },
    queueHealth: {
      value: state.queues[0]?.health === 'critical' ? 30 : 90,
      trend: 'down',
      status: 'warning',
    },
    movementDirection: 'ingress',
  } as any;

  const highestRiskZoneName = state.global.highestRiskZoneId
    ? state.zones.find((z) => z.id === state.global.highestRiskZoneId)?.name || 'Unknown'
    : 'None';

  const handleToggleCopilot = () => {
    setRightPanelMode((prev) => (prev === 'COPILOT' ? 'NONE' : 'COPILOT'));
  };

  // If the AI recommends something, we want the copilot available
  const hasRecommendation = state.copilot?.isActive;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg-base, #000)',
      }}
    >
      {/* Main Workspace Area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          padding: '16px',
          gap: '16px',
        }}
      >
        {/* Main Content Scroll Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >
          {/* Executive Directive */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CrowdDirective
                highestRiskZoneName={highestRiskZoneName}
                currentPhase={matchData?.currentPhase || 'Pre-Match Ingress'}
                overallDensity={state.global.averageDensity}
                recommendation={
                  state.copilot?.isActive
                    ? {
                        action: state.copilot.recommendation,
                        benefit: state.copilot.expectedOutcome,
                        confidence: state.copilot.confidence,
                        estimatedImprovement: 'Flow restored in 12m',
                      }
                    : null
                }
              />
              <ExecutiveCollaboration />
            </div>

            {/* KPI Strip */}
            <div style={{ marginTop: '16px' }}>
              <MetricStrip
                metrics={{
                  averageDensity: state.global.averageDensity,
                  peakDensity: state.global.peakDensity,
                  occupancy: state.global.totalPopulation,
                  ingressRate: state.flow.ingressRate,
                  egressRate: state.flow.egressRate,
                  bottleneckCount: state.flow.bottleneckCount,
                  criticalZones: state.zones.filter(
                    (z) => z.riskLevel === 'critical' || z.riskLevel === 'high'
                  ).length,
                  safeZones: state.zones.filter((z) => z.riskLevel === 'low').length,
                }}
              />
            </div>
          </div>

          {/* Hero Simulation: Living Crowd Engine */}
          <div style={{ height: '50vh', minHeight: '400px', flexShrink: 0, marginTop: '8px' }}>
            <InteractiveCrowdHeatmap peakDensity={state.global.peakDensity} />
          </div>

          {/* Mission Timeline directly below simulation */}
          <CrowdTimeline />

          {/* Operational Panels & Analytics (Uniform Flex Layout) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
            {state.missions.length > 0 && (
              <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
                <LiveMissionTracker missions={state.missions} />
              </div>
            )}
            <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
              <ZoneIntelligence zones={state.zones} />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
              <QueueIntelligence queues={state.queues} />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
              <ResourceCoordination resources={state.resources} />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
              <FlowAnalytics flow={state.flow as any} />
            </div>
            <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
              <BehaviorIntelligence behavior={behaviorMock} />
            </div>
          </div>
        </div>

        {/* Right Adaptive Panel */}
        <CrowdWorkspaceRightPanel
          mode={rightPanelMode}
          onClose={() => setRightPanelMode('NONE')}
          copilotData={state.copilot}
        />

        {/* Floating Copilot Toggle */}
        {rightPanelMode === 'NONE' && (
          <motion.button
            onClick={handleToggleCopilot}
            animate={
              hasRecommendation
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 4px 12px rgba(0,0,0,0.5)',
                      '0 0 20px rgba(62, 130, 247, 0.8)',
                      '0 4px 12px rgba(0,0,0,0.5)',
                    ],
                  }
                : {}
            }
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              position: 'absolute',
              right: '24px',
              top: '90px',
              background: hasRecommendation ? '#3e82f7' : 'rgba(62, 130, 247, 0.1)',
              border: hasRecommendation ? 'none' : '1px solid #3e82f7',
              color: hasRecommendation ? '#fff' : '#3e82f7',
              borderRadius: '24px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
            </svg>
            {hasRecommendation ? 'New AI Recommendation' : 'Ask Copilot'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
