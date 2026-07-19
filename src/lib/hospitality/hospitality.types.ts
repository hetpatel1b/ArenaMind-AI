export enum HospitalityTier {
  VIP = 'VIP',
  VVIP = 'VVIP',
  CORPORATE = 'CORPORATE',
  PREMIUM_FAN = 'PREMIUM_FAN',
}

export interface HospitalityGuest {
  id: string;
  name: string;
  tier: HospitalityTier;
  suiteId: string;
  eta: string;
  specialRequirements: string[];
}

export interface HospitalitySuite {
  id: string;
  name: string;
  tier: HospitalityTier;
  capacity: number;
  occupancy: number;
  staffAssigned: number;
}
