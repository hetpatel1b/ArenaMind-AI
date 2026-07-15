import React, { createContext, useContext } from 'react';
import { useIncidentWorkspace } from './useIncidentWorkspace';

type IncidentWorkspaceContextType = ReturnType<typeof useIncidentWorkspace>;

const IncidentContext = createContext<IncidentWorkspaceContextType | undefined>(undefined);

export function IncidentProvider({
  children,
  initialContext,
}: {
  children: React.ReactNode;
  initialContext?: Parameters<typeof useIncidentWorkspace>[0];
}) {
  const workspace = useIncidentWorkspace(initialContext);

  return <IncidentContext.Provider value={workspace}>{children}</IncidentContext.Provider>;
}

export function useIncidentContext() {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error('useIncidentContext must be used within an IncidentProvider');
  }
  return context;
}
