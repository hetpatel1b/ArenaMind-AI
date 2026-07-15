import React from 'react';
import { MapProvider } from '@/app/components/map/context/MapContext';
import { CollaborationProvider } from '@/app/components/map/context/CollaborationContext';
import { MapGridWrapper } from '@/app/components/map/workspace/MapGridWrapper';

export const dynamic = 'force-dynamic';

export default function MapViewPage() {
  return (
    <MapProvider>
      <CollaborationProvider>
        <div style={{ width: '100%', height: '100%' }}>
          <MapGridWrapper />
        </div>
      </CollaborationProvider>
    </MapProvider>
  );
}
