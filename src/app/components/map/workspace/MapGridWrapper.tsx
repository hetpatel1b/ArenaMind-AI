'use client';

import React from 'react';
import { useCollaborationEngine } from '../hooks/useCollaborationEngine';
import { MapGrid } from './MapGrid';

export function MapGridWrapper() {
  // Initialize the engine inside the tree where MapContext and CollaborationContext are available
  useCollaborationEngine();

  return <MapGrid />;
}
