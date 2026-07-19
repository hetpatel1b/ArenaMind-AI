export type AssistanceMode =
  'TEXT' | 'VOICE_FRIENDLY' | 'HIGH_CONTRAST' | 'SIMPLIFIED' | 'STEP_BY_STEP' | 'CALM';

export interface InclusiveProfile {
  id: string;
  isWheelchair: boolean;
  isLowVision: boolean;
  isBlind: boolean;
  isHearingImpaired: boolean;
  isSenior: boolean;
  isChild: boolean;
  isFamily: boolean;
  needsMedical: boolean;
  isPregnant: boolean;
  isVip: boolean;
  isInternational: boolean;
  isVolunteer: boolean;
  isLost: boolean;
  activeMode: AssistanceMode;
}

export interface AdaptiveRecommendation {
  id: string;
  title: string;
  reason: string;
  accessibilityConsiderations: string;
  safetyImpact: string;
  confidence: number;
  expectedBenefit: string;
}

export interface EmergencyGuidance {
  id: string;
  instructions: string[];
  safeZone: string;
  priority: 'HIGH' | 'CRITICAL';
}

import { NavigationRoute } from '../fan/types';
export interface AdaptiveNavigationRoute extends NavigationRoute {
  accessibilityFeatures: string[];
}
