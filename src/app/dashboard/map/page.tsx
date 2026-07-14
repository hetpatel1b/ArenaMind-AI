import React from 'react';
import { ComingSoonPlaceholder } from '@/app/components/ui/ComingSoonPlaceholder';

export const dynamic = 'force-dynamic';

export default function MapViewPage() {
  return (
    <ComingSoonPlaceholder
      title="Global Map View"
      description="The full-screen interactive stadium map and geographical operations view is currently in development. Please use the command center dashboard for current spatial telemetry."
    />
  );
}
