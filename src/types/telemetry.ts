export type RiskLevel = "low" | "medium" | "high" | "critical";

export type TelemetryEventKind = "tracker" | "permission" | "network" | "app";

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  kind: TelemetryEventKind;
  title: string;
  detail: string;
  risk: RiskLevel;
}

export interface ExposureTrendPoint {
  hour: string;
  score: number;
}

export interface HeatmapCell {
  hour: string;
  intensity: 1 | 2 | 3 | 4 | 5;
}

export interface PermissionSummary {
  kind: "microphone" | "camera" | "clipboard";
  count: number;
  leadingApp: string;
}

export interface TelemetrySnapshot {
  score: number;
  risk: RiskLevel;
  trendPercent: number;
  trackerCount: number;
  newTrackerCount: number;
  eventCount: number;
  trend: ExposureTrendPoint[];
  heatmap: HeatmapCell[];
  permissions: PermissionSummary[];
  recentEvents: TelemetryEvent[];
}
