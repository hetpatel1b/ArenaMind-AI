import { inclusiveProfileService } from '../profiles/profile.service';
import { fanNavigationService } from '../../fan/navigation/fan-navigation.service';
import { AdaptiveNavigationRoute } from '../types';

export class AdaptiveNavigationService {
  private static instance: AdaptiveNavigationService;

  private constructor() {}

  public static getInstance(): AdaptiveNavigationService {
    if (!AdaptiveNavigationService.instance) {
      AdaptiveNavigationService.instance = new AdaptiveNavigationService();
    }
    return AdaptiveNavigationService.instance;
  }

  public async getAdaptiveRoute(destination: string): Promise<AdaptiveNavigationRoute> {
    const profile = inclusiveProfileService.getActiveProfile();

    // Base route from the existing engine
    const baseRoute = await fanNavigationService.computeRoute(destination);

    // Adapt the route based on the inclusive profile
    const adaptiveRoute: AdaptiveNavigationRoute = {
      ...baseRoute,
      accessibilityFeatures: [],
    };
    adaptiveRoute.warnings = adaptiveRoute.warnings || [];

    if (profile.isWheelchair || profile.needsMedical || profile.isPregnant || profile.isSenior) {
      adaptiveRoute.accessibilityFeatures.push('ELEVATORS_ONLY');
      adaptiveRoute.accessibilityFeatures.push('RAMP_ACCESS');
      adaptiveRoute.warnings.push('Avoided stairs.');
    }

    if (profile.isBlind || profile.isLowVision) {
      adaptiveRoute.accessibilityFeatures.push('TACTILE_PAVING');
      adaptiveRoute.accessibilityFeatures.push('AUDIO_BEACONS');
      adaptiveRoute.warnings.push('High-contrast and audio instructions enabled.');
    }

    if (profile.isHearingImpaired) {
      adaptiveRoute.accessibilityFeatures.push('VISUAL_WAYFINDING');
      adaptiveRoute.warnings.push('Visual indicators highlighted on route.');
    }

    if (profile.isChild || profile.isFamily) {
      adaptiveRoute.accessibilityFeatures.push('FAMILY_LANES');
      adaptiveRoute.warnings.push('Avoiding dense crowd bottlenecks for child safety.');
    }

    if (profile.isLost) {
      adaptiveRoute.accessibilityFeatures.push('VOLUNTEER_CHECKPOINTS');
      adaptiveRoute.warnings.push('Route passes 3 manned volunteer stations for safety.');
    }

    return adaptiveRoute;
  }
}

export const adaptiveNavigationService = AdaptiveNavigationService.getInstance();
