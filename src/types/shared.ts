export interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  user: string;
  type: 'identity' | 'security' | 'ai' | 'storage' | 'compliance' | 'system' | 'mobility' | 'crowd';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  actionType?: string;
  actionLabel?: string;
}

export interface PanelData {
  title: string;
  value: string;
  rawValue: number;
  status: 'optimal' | 'warning' | 'critical';
  sparkline: number[];
}
