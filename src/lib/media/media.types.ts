export enum AccreditationLevel {
  ALL_ACCESS = 'ALL_ACCESS',
  PITCH = 'PITCH',
  PRESS_CONFERENCE = 'PRESS_CONFERENCE',
  MIXED_ZONE = 'MIXED_ZONE',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
}

export interface Journalist {
  id: string;
  name: string;
  organization: string;
  accreditationLevel: AccreditationLevel;
  currentZoneId?: string;
  isPriority: boolean;
}

export interface MediaZone {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  requiredAccreditation: AccreditationLevel[];
}

export interface PressConference {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  locationId: string;
  attendeesCount: number;
}
