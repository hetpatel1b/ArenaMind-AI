import { FiberRoute } from './broadcast.types';

export class BroadcastRoutingService {
  private static instance: BroadcastRoutingService;
  private routes: Map<string, FiberRoute> = new Map();

  private constructor() {
    this.routes.set('fiber-1', {
      id: 'fiber-1',
      startNode: 'stadium-hub',
      endNode: 'satellite-uplink',
      bandwidthUsagePct: 65,
      status: 'ACTIVE',
    });
  }

  public static getInstance(): BroadcastRoutingService {
    if (!BroadcastRoutingService.instance) {
      BroadcastRoutingService.instance = new BroadcastRoutingService();
    }
    return BroadcastRoutingService.instance;
  }

  public optimizeBandwidth(routeId: string): void {
    const route = this.routes.get(routeId);
    if (route && route.bandwidthUsagePct > 90) {
      // eslint-disable-next-line no-console
      console.log(
        `[Broadcast] Rerouting non-essential telemetry off ${routeId} to preserve live feed.`
      );
    }
  }
}

export const broadcastRoutingService = BroadcastRoutingService.getInstance();
