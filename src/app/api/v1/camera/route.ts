import { NextRequest } from 'next/server';

import { createRouteHandler } from '@/lib/api/route-factory';
import { successResponse } from '@/lib/api/response';
import { prisma } from '@/lib/db/client';

export const GET = createRouteHandler(async (req: NextRequest, { bizContext }) => {
  const activeCameras = await prisma.camera.count({ where: { status: 'active' } });
  const totalCameras = await prisma.camera.count();

  const metrics = {
    activeStreams: activeCameras,
    totalCameras: totalCameras,
    detectionRate: 1140, // derived dummy
    avgEdgeLatency: 15.4,
    bandwidthUsage: 2540,
    gpuLoad: 68,
    systemHealth:
      activeCameras === totalCameras
        ? 100
        : totalCameras
          ? (activeCameras / totalCameras) * 100
          : 0,
  };

  const feeds = await prisma.camera.findMany({ take: 6 });
  const mappedFeeds = feeds.map((feed) => {
    const meta = (feed.metadata as Record<string, unknown>) || {};
    return {
      id: feed.id,
      name: feed.name,
      status: feed.status,
      fps: meta.fps || 30,
      resolution: meta.resolution || '1080p',
      location: feed.zoneId || 'Unknown',
      lastFrameUrl: feed.streamUrl,
      activeDetections: [],
      metadata: {
        latency: 15,
        packetLoss: 0,
        uptime: 99.9,
      },
    };
  });

  return successResponse({
    metrics,
    activeFeeds: mappedFeeds,
    networkTopology: [], // static/dummy or derive from DB if you had a topology graph
    reasoningStream: [],
    alerts: [],
  });
});
