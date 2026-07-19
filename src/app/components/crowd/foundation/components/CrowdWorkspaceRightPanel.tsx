import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrowdCopilot } from './CrowdCopilot';
import { ExecutiveAnalyticsWorkspace } from './ExecutiveAnalyticsWorkspace';
import { MissionHistoryWorkspace } from './MissionHistoryWorkspace';

export type RightPanelMode = 'NONE' | 'COPILOT' | 'ZONE' | 'ANALYTICS' | 'MISSION' | 'HISTORY';

export interface CrowdWorkspaceRightPanelProps {
  mode: RightPanelMode;
  onClose: () => void;
  // Payload props for copilot mode, etc could go here
  copilotData?: SafeAny;
}

export function CrowdWorkspaceRightPanel({
  mode,
  onClose,
  copilotData,
}: CrowdWorkspaceRightPanelProps) {
  return (
    <AnimatePresence>
      {mode !== 'NONE' && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 400, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like ease
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <div style={{ width: '400px', height: '100%' }}>
            {mode === 'COPILOT' && (
              <CrowdCopilot
                observation={
                  copilotData?.observation ||
                  'South Gate experiencing severe compression wave. Density at 90%.'
                }
                recommendation={
                  copilotData?.recommendation ||
                  'Deploy Crowd Control Unit 4 to South Gate ingress lines immediately.'
                }
                prediction={
                  copilotData?.prediction ||
                  'Density will reach 98% within 4 minutes, exceeding safe compression thresholds.'
                }
                reasoning={
                  copilotData?.reasoning || [
                    'Flow rate has dropped 40% in last 5 minutes.',
                    'Ingress volume remains high (120/min).',
                    'Historical pattern shows immediate risk of stampede dynamics.',
                  ]
                }
                onClose={onClose}
              />
            )}
            {/* Placeholders for other modes for Sprint 2 */}
            {mode === 'ZONE' && (
              <div style={{ padding: '24px', color: '#fff' }}>Zone Drilldown Placeholder</div>
            )}
            {mode === 'ANALYTICS' && <ExecutiveAnalyticsWorkspace />}
            {mode === 'MISSION' && (
              <div style={{ padding: '24px', color: '#fff' }}>Mission Control Placeholder</div>
            )}
            {mode === 'HISTORY' && <MissionHistoryWorkspace />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
