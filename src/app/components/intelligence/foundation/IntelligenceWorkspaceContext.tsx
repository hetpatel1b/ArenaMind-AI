'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { IntelligenceState, IntelligenceAction } from './IntelligenceTypes';
import { useIntelligenceWorkspaceManager } from './useIntelligenceWorkspace';

interface IntelligenceContextProps {
  state: IntelligenceState;
  dispatch: React.Dispatch<IntelligenceAction>;
}

const IntelligenceWorkspaceContext = createContext<IntelligenceContextProps | undefined>(undefined);

export function IntelligenceWorkspaceProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useIntelligenceWorkspaceManager();

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <IntelligenceWorkspaceContext.Provider value={contextValue}>
      {children}
    </IntelligenceWorkspaceContext.Provider>
  );
}

export function useIntelligenceWorkspace() {
  const context = useContext(IntelligenceWorkspaceContext);
  if (context === undefined) {
    throw new Error(
      'useIntelligenceWorkspace must be used within an IntelligenceWorkspaceProvider'
    );
  }
  return context;
}
