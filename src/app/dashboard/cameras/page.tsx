import React from 'react';
import { ComingSoonPlaceholder } from '@/app/components/ui/ComingSoonPlaceholder';

export const dynamic = 'force-dynamic';

export default function CamerasPage() {
  return (
    <ComingSoonPlaceholder
      title="CCTV & Edge Computer Vision"
      description="Live video feeds and edge-processed computer vision overlays are not yet integrated into this demo environment. The AI models are currently running in headless mode."
    />
  );
}
