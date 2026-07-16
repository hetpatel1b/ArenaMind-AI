'use client';

import { useContext } from 'react';
import { InfrastructureContext } from './InfrastructureContext';

export function useInfrastructureWorkspace() {
  const context = useContext(InfrastructureContext);

  if (!context) {
    throw new Error('useInfrastructureWorkspace must be used within an InfrastructureProvider');
  }

  return context;
}
