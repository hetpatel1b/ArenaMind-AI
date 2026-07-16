'use client';

import React, { createContext, useContext } from 'react';
import { useMobilityWorkspace } from './useMobilityWorkspace';

type MobilityWorkspaceContextType = ReturnType<typeof useMobilityWorkspace>;

const MobilityContext = createContext<MobilityWorkspaceContextType | undefined>(undefined);

export function MobilityWorkspaceProvider({
  children,
  initialContext,
}: {
  children: React.ReactNode;
  initialContext?: Parameters<typeof useMobilityWorkspace>[0];
}) {
  const workspace = useMobilityWorkspace(initialContext);

  return <MobilityContext.Provider value={workspace}>{children}</MobilityContext.Provider>;
}

export function useMobilityContext() {
  const context = useContext(MobilityContext);
  if (context === undefined) {
    throw new Error('useMobilityContext must be used within a MobilityWorkspaceProvider');
  }
  return context;
}
