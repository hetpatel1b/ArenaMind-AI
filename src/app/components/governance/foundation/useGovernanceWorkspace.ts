'use client';

import { useContext } from 'react';
import { GovernanceContext } from './GovernanceContext';

export function useGovernanceWorkspace() {
  const context = useContext(GovernanceContext);

  if (!context) {
    throw new Error('useGovernanceWorkspace must be used within a GovernanceProvider');
  }

  return context;
}
