'use client';

import React from 'react';
import { GovernanceProvider } from './GovernanceContext';
import GovernanceWorkspaceLayout from './GovernanceWorkspaceLayout';

export default function GovernanceWorkspace() {
  return (
    <GovernanceProvider>
      <GovernanceWorkspaceLayout />
    </GovernanceProvider>
  );
}
