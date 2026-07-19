export type SupportedLanguage = 'en' | 'es' | 'fr' | 'pt' | 'de' | 'ar' | 'hi' | 'ja' | 'zh' | 'ko';

export type FanVisitorType =
  'FIRST_TIME' | 'FAMILY' | 'VIP' | 'WHEELCHAIR' | 'MEDICAL' | 'TOURIST' | 'VOLUNTEER';

export interface FanContext {
  userId: string;
  visitorType: FanVisitorType[];
  language: SupportedLanguage;
  location: {
    zone: string;
    level: string;
    gate?: string;
  };
  ticket: {
    matchId: string;
    seatId: string;
    block: string;
    gate: string;
  };
  timeToKickoffMs: number;
}

export interface NavigationRoute {
  id: string;
  origin: string;
  destination: string;
  pathSegments: string[];
  estimatedTimeMinutes: number;
  isAccessible: boolean;
  crowdDensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  warnings: string[];
}

export interface FanRecommendation {
  id: string;
  type: 'FOOD' | 'RESTROOM' | 'MERCHANDISE' | 'TRANSPORT';
  title: string;
  description: string;
  distanceMinutes: number;
  queueTimeMinutes: number;
  isAccessible: boolean;
}
