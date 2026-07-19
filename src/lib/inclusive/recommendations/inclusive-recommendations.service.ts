import { inclusiveProfileService } from '../profiles/profile.service';
import { AdaptiveRecommendation } from '../types';

export class InclusiveRecommendationsService {
  private static instance: InclusiveRecommendationsService;

  private constructor() {}

  public static getInstance(): InclusiveRecommendationsService {
    if (!InclusiveRecommendationsService.instance) {
      InclusiveRecommendationsService.instance = new InclusiveRecommendationsService();
    }
    return InclusiveRecommendationsService.instance;
  }

  public getInclusiveRecommendations(): AdaptiveRecommendation[] {
    const profile = inclusiveProfileService.getActiveProfile();
    const recommendations: AdaptiveRecommendation[] = [];

    if (profile.isFamily || profile.isChild) {
      recommendations.push({
        id: 'rec-inc-family-1',
        title: 'Family Restrooms & Baby Care',
        reason: 'You are travelling with family.',
        accessibilityConsiderations: 'Stroller accessible paths prioritized.',
        safetyImpact: 'Maintains family proximity.',
        confidence: 95,
        expectedBenefit: 'Reduces wait times at general facilities by 15 minutes.',
      });

      recommendations.push({
        id: 'rec-inc-family-2',
        title: 'Kid-Friendly Dining & Short Queues',
        reason: 'You are travelling with children.',
        accessibilityConsiderations: 'High chairs available and wide seating layout.',
        safetyImpact: 'Maintains child visibility in low-crowd dining area.',
        confidence: 96,
        expectedBenefit: 'Saves 20 minutes in queue and provides child-friendly menu options.',
      });
    }

    if (profile.isWheelchair || profile.needsMedical || profile.isPregnant || profile.isSenior) {
      recommendations.push({
        id: 'rec-inc-med-1',
        title: 'Accessible Seating Upgrade Available',
        reason: 'Based on your profile, priority accessible seating is open in lower tier.',
        accessibilityConsiderations: 'Zero stairs. Ramp gradient < 5%.',
        safetyImpact: 'Reduces physical strain and fall risk.',
        confidence: 98,
        expectedBenefit: 'Significantly improves viewing comfort.',
      });
    }

    if (profile.isBlind || profile.isLowVision) {
      recommendations.push({
        id: 'rec-inc-vision-1',
        title: 'Audio Descriptive Commentary Headset',
        reason: 'Enhance your match experience with live descriptive audio.',
        accessibilityConsiderations: 'Available for pickup at Information Desk 3.',
        safetyImpact: 'Improves situational awareness.',
        confidence: 99,
        expectedBenefit: 'Full inclusion in the match broadcast.',
      });
    }

    if (profile.isHearingImpaired) {
      recommendations.push({
        id: 'rec-inc-hearing-1',
        title: 'Live Closed Captioning Feed',
        reason: 'Sync your device with stadium announcements.',
        accessibilityConsiderations: 'High contrast text options available.',
        safetyImpact: 'Ensures receipt of critical stadium announcements.',
        confidence: 99,
        expectedBenefit: 'No missed information during the event.',
      });
    }

    if (profile.isLost) {
      recommendations.push({
        id: 'rec-inc-lost-1',
        title: 'Request Volunteer Assistance',
        reason: 'You have indicated you are lost or separated.',
        accessibilityConsiderations: 'A trained volunteer will meet you at your current location.',
        safetyImpact: 'Immediate assistance provided to ensure safety.',
        confidence: 100,
        expectedBenefit: 'Rapid reunification.',
      });
    }

    return recommendations;
  }
}

export const inclusiveRecommendationsService = InclusiveRecommendationsService.getInstance();
