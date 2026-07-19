import { FanContext, NavigationRoute } from '../types';
import { fanContextService } from '../context/fan-context.service';

export class FanNavigationService {
  private static instance: FanNavigationService;

  private constructor() {}

  public static getInstance(): FanNavigationService {
    if (!FanNavigationService.instance) {
      FanNavigationService.instance = new FanNavigationService();
    }
    return FanNavigationService.instance;
  }

  public async computeRoute(destination: string, context?: FanContext): Promise<NavigationRoute> {
    const ctx = context || fanContextService.getContext();
    const isAccessible =
      ctx.visitorType.includes('WHEELCHAIR') || ctx.visitorType.includes('MEDICAL');

    // Simulate AI routing logic connecting to operator telemetry
    const estimatedTime = isAccessible ? 8 : 5;

    return {
      id: `route-${Date.now()}`,
      origin: `${ctx.location.zone} - ${ctx.location.level}`,
      destination: destination,
      pathSegments: [
        'Proceed straight for 50m',
        isAccessible ? 'Take elevator to Concourse Level' : 'Take stairs to Concourse Level',
        `Turn right towards ${destination}`,
      ],
      estimatedTimeMinutes: estimatedTime,
      isAccessible,
      crowdDensity: 'LOW', // Would come from CrowdTelemetry in real app
      warnings: isAccessible ? [] : ['Stairs on route'],
    };
  }

  public async computeEmergencyEvacuation(context?: FanContext): Promise<NavigationRoute> {
    const ctx = context || fanContextService.getContext();
    const isAccessible =
      ctx.visitorType.includes('WHEELCHAIR') || ctx.visitorType.includes('MEDICAL');

    return {
      id: `evac-${Date.now()}`,
      origin: `${ctx.location.zone} - ${ctx.location.level}`,
      destination: 'Emergency Exit B (Safe Zone)',
      pathSegments: [
        'Follow the green emergency lights',
        'Move swiftly towards the North Plaza exit',
      ],
      estimatedTimeMinutes: 2,
      isAccessible,
      crowdDensity: 'HIGH',
      warnings: ['Do not use elevators', 'Follow staff instructions'],
    };
  }
}

export const fanNavigationService = FanNavigationService.getInstance();
