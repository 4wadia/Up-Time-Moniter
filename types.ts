export enum ServiceStatus {
  OPERATIONAL = 'Operational',
  DEGRADED = 'Degraded',
  DOWN = 'Down',
  MAINTENANCE = 'Maintenance'
}

export interface UptimePoint {
  time: string;
  latency: number; // ms
}

export enum MetricType {
  LATENCY = 'Latency',
  UPTIME = 'Uptime',
  ERROR_RATE = 'Error Rate'
}

export enum ComparisonOperator {
  GREATER_THAN = '>',
  LESS_THAN = '<'
}

export interface Threshold {
  id: string;
  metric: MetricType;
  operator: ComparisonOperator;
  value: number;
  durationMinutes: number;
  enabled: boolean;
}

export interface Alert {
  id: string;
  serviceId: string;
  thresholdId: string;
  message: string;
  timestamp: string;
  severity: 'warning' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface Service {
  id: string;
  name: string;
  url: string;
  status: ServiceStatus;
  uptimePercentage: number;
  history: UptimePoint[];
  lastChecked: string;
  region: string;
  tags?: string[];
  thresholds: Threshold[];
}

export interface IncidentAnalysis {
  rootCause: string;
  impact: string;
  suggestedFix: string;
  estimatedResolutionTime: string;
}

export type PageView = 'dashboard' | 'monitors' | 'monitor-detail' | 'status-pages' | 'notifications' | 'settings' | 'account' | 'logout' | 'signin' | 'signup';

export interface User {
  name: string;
  email: string;
  initials: string;
}

export const THEME = {
  parchment: '#edede9',
  dustGrey: '#d6ccc2',
  linen: '#f5ebe0',
  powderPetal: '#e3d5ca',
  almondSilk: '#d5bdaf',
  foreground: '#4a403a',
  foregroundMuted: '#8d7f76',
};