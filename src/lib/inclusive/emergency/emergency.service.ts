import { inclusiveProfileService } from '../profiles/profile.service';
import { EmergencyGuidance } from '../types';

export class InclusiveEmergencyService {
  private static instance: InclusiveEmergencyService;

  private constructor() {}

  public static getInstance(): InclusiveEmergencyService {
    if (!InclusiveEmergencyService.instance) {
      InclusiveEmergencyService.instance = new InclusiveEmergencyService();
    }
    return InclusiveEmergencyService.instance;
  }

  public getEmergencyGuidance(
    incidentType: 'EVACUATION' | 'SHELTER' | 'MEDICAL'
  ): EmergencyGuidance {
    const profile = inclusiveProfileService.getActiveProfile();

    if (incidentType === 'EVACUATION') {
      if (profile.isLost) {
        return {
          id: 'em-evac-lost',
          instructions: [
            'STAY EXACTLY WHERE YOU ARE.',
            'A security volunteer has been dispatched to your location.',
            'Do not join the main evacuation flow until a staff member arrives to escort you safely.',
          ],
          safeZone: 'Your Current Location',
          priority: 'CRITICAL',
        };
      }

      if (profile.isWheelchair || profile.needsMedical) {
        return {
          id: 'em-evac-wheelchair',
          instructions: [
            'Do NOT use the main stairs.',
            'Proceed to the designated Area of Rescue Assistance near Elevator Bank B.',
            'Wait for emergency personnel. They have been notified of your location.',
          ],
          safeZone: 'Rescue Zone B',
          priority: 'CRITICAL',
        };
      }

      if (profile.isFamily || profile.isChild) {
        return {
          id: 'em-evac-family',
          instructions: [
            'Keep your group together. Hold hands with children.',
            'Follow the green illuminated paths to Gate 4.',
            'If separated, proceed to the external Family Reunification Zone at the East Plaza.',
          ],
          safeZone: 'East Plaza Reunification',
          priority: 'HIGH',
        };
      }

      if (profile.isBlind || profile.isLowVision) {
        return {
          id: 'em-evac-vision',
          instructions: [
            'Audio beacons have been activated. Follow the continuous chime sound.',
            'A volunteer will intercept you at the concourse exit.',
            'Keep to the right wall.',
          ],
          safeZone: 'Gate 2 Safe Zone',
          priority: 'CRITICAL',
        };
      }
    }

    // Default evacuation
    return {
      id: 'em-evac-default',
      instructions: [
        'Proceed calmly to the nearest exit.',
        'Do not use elevators.',
        'Follow instructions from stadium staff.',
      ],
      safeZone: 'Main Exterior Concourse',
      priority: 'HIGH',
    };
  }
}

export const inclusiveEmergencyService = InclusiveEmergencyService.getInstance();
