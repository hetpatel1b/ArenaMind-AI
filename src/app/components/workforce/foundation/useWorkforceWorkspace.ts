'use client';

import { useContext } from 'react';
import { WorkforceContext } from './WorkforceContext';
import { WorkforceState, WorkforceAction } from './WorkforceTypes';

export function useWorkforceWorkspace(): {
  state: WorkforceState;
  dispatch: React.Dispatch<WorkforceAction>;
} {
  const context = useContext(WorkforceContext);
  if (context === undefined) {
    throw new Error('useWorkforceWorkspace must be used within a WorkforceWorkspaceProvider');
  }
  return context;
}
