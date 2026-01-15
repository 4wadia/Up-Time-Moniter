
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

export type PageView = 'dashboard' | 'incidents' | 'monitors' | 'alerts' | 'signin' | 'signup';

export interface User {
  name: string;
  email: string;
  initials: string;
}

export const THEME = {
  parchment: 'var(--color-parchment)',
  dustGrey: 'var(--color-dust-grey)',
  linen: 'var(--color-linen)',
  powderPetal: 'var(--color-powder-petal)',
  almondSilk: 'var(--color-almond-silk)',
  foreground: 'var(--color-foreground)',
  foregroundMuted: 'var(--color-foreground-muted)',
};