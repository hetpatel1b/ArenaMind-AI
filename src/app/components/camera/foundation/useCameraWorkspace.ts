'use client';

import { useContext } from 'react';
import { CameraContext } from './CameraContext';
import { CameraState, CameraAction } from './CameraTypes';

export function useCameraWorkspace(): {
  state: CameraState;
  dispatch: React.Dispatch<CameraAction>;
} {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCameraWorkspace must be used within a CameraWorkspaceProvider');
  }
  return context;
}
