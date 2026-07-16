'use client';

import React from 'react';
import { InfrastructureProvider } from './InfrastructureContext';
import InfrastructureWorkspaceLayout from './InfrastructureWorkspaceLayout';

export default function InfrastructureWorkspace() {
  return (
    <InfrastructureProvider>
      <InfrastructureWorkspaceLayout />
    </InfrastructureProvider>
  );
}
