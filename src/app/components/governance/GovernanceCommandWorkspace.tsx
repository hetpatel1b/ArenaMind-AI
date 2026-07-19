'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GovernanceHero } from './widgets/GovernanceHero';
import { UserRoleManagement } from './widgets/UserRoleManagement';
import { StadiumConfiguration } from './widgets/StadiumConfiguration';
import { AiGovernanceCenter } from './widgets/AiGovernanceCenter';
import { SecurityAuditCenter } from './widgets/SecurityAuditCenter';
import { OperationalPolicies } from './widgets/OperationalPolicies';
import { IntegrationsHealth } from './widgets/IntegrationsHealth';
import { ProfilePreferences } from './widgets/ProfilePreferences';
import { GovernancePersistentCopilot } from './widgets/GovernancePersistentCopilot';

export interface GovernancePayload {
  environment: string;
  organization: string;
  venue: string;
  aiProvider: string;
  aiVersion: string;
  securityStatus: string;
  lastAudit: string;
  operationalHealth: number;
  recommendedAction: string;
  policies: {
    confidenceThreshold: number;
    recommendationThreshold: number;
    promptVersion: string;
    humanApproval: string;
    aiSafety: string;
  };
}

interface GovernanceCommandWorkspaceProps {
  matchData: SafeAny;
  stadiumData: SafeAny;
  users: SafeAny[];
  governancePayload: GovernancePayload;
}

export function GovernanceCommandWorkspace({
  matchData,
  stadiumData,
  users,
  governancePayload,
}: GovernanceCommandWorkspaceProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="dashboard-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        gap: 'var(--space-4)',
        padding: 'var(--space-6)',
        width: '100%',
        maxWidth: '1800px',
        margin: '0 auto',
      }}
    >
      {/* Section 1: AI Governance Overview (Hero) spans top 12 cols */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 12' }}
      >
        <GovernanceHero
          governancePayload={governancePayload}
          currentPhase={matchData.currentPhase}
        />
      </motion.div>

      {/* Section 2 & 3: Users (Span 7) and Config (Span 5) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        style={{ gridColumn: 'span 7' }}
      >
        <UserRoleManagement users={users} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{ gridColumn: 'span 5' }}
      >
        <StadiumConfiguration stadiumData={stadiumData} />
      </motion.div>

      {/* Section 4, 5, 6: AI Governance (4), Security Audit (4), Operational Policies (4) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <AiGovernanceCenter governancePayload={governancePayload} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <SecurityAuditCenter />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <OperationalPolicies />
      </motion.div>

      {/* Section 7 & 8: Integrations & Health (Span 8) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
        style={{ gridColumn: 'span 8' }}
      >
        <IntegrationsHealth />
      </motion.div>

      {/* Section 9: Profile & Preferences (Span 4) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
        style={{ gridColumn: 'span 4' }}
      >
        <ProfilePreferences />
      </motion.div>

      {/* Section 10: Persistent Copilot */}
      <GovernancePersistentCopilot />
    </div>
  );
}
