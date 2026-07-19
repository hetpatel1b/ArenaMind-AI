import { fanContextService } from '../../fan/context/fan-context.service';
import { InclusiveProfile, AssistanceMode } from '../types';

export class InclusiveProfileService {
  private static instance: InclusiveProfileService;
  private mockExtendedFlags: Partial<InclusiveProfile> = {};

  private constructor() {}

  public static getInstance(): InclusiveProfileService {
    if (!InclusiveProfileService.instance) {
      InclusiveProfileService.instance = new InclusiveProfileService();
    }
    return InclusiveProfileService.instance;
  }

  // Allow UI to simulate advanced conditions without modifying the base FanContext schema
  public simulateExtendedCondition(flags: Partial<InclusiveProfile>) {
    this.mockExtendedFlags = { ...this.mockExtendedFlags, ...flags };
  }

  public getActiveProfile(): InclusiveProfile {
    const ctx = fanContextService.getContext();
    const visitorTypes = ctx.visitorType;

    const isWheelchair =
      visitorTypes.includes('WHEELCHAIR') || !!this.mockExtendedFlags.isWheelchair;
    const isFamily = visitorTypes.includes('FAMILY') || !!this.mockExtendedFlags.isFamily;
    const needsMedical = visitorTypes.includes('MEDICAL') || !!this.mockExtendedFlags.needsMedical;
    const isVip = visitorTypes.includes('VIP') || !!this.mockExtendedFlags.isVip;
    const isInternational =
      visitorTypes.includes('TOURIST') || !!this.mockExtendedFlags.isInternational;
    const isVolunteer = visitorTypes.includes('VOLUNTEER') || !!this.mockExtendedFlags.isVolunteer;

    const isLowVision = !!this.mockExtendedFlags.isLowVision;
    const isBlind = !!this.mockExtendedFlags.isBlind;
    const isHearingImpaired = !!this.mockExtendedFlags.isHearingImpaired;
    const isSenior = !!this.mockExtendedFlags.isSenior;
    const isChild = !!this.mockExtendedFlags.isChild;
    const isPregnant = !!this.mockExtendedFlags.isPregnant;
    const isLost = !!this.mockExtendedFlags.isLost;

    // Determine the optimal default assistance mode based on the profile
    let activeMode: AssistanceMode = 'TEXT';
    if (isBlind || isLowVision) activeMode = 'VOICE_FRIENDLY';
    else if (isHearingImpaired || isSenior) activeMode = 'HIGH_CONTRAST';
    else if (isChild || isLost) activeMode = 'CALM';
    else if (needsMedical || isWheelchair) activeMode = 'STEP_BY_STEP';

    // Override with simulated mode if set
    if (this.mockExtendedFlags.activeMode) {
      activeMode = this.mockExtendedFlags.activeMode;
    }

    return {
      id: ctx.userId,
      isWheelchair,
      isFamily,
      needsMedical,
      isVip,
      isInternational,
      isVolunteer,
      isLowVision,
      isBlind,
      isHearingImpaired,
      isSenior,
      isChild,
      isPregnant,
      isLost,
      activeMode,
    };
  }
}

export const inclusiveProfileService = InclusiveProfileService.getInstance();
