import type { RiskLevel } from "../types/telemetry";

export type ExposureTrendDirection = "up" | "down" | "stable";
export type ExposureFactorKey = "trackers" | "permissions" | "public-wifi" | "breaches" | "connections";

export interface ExposureScoringInput {
  trackerCount: number;
  permissionAccesses: number;
  publicWifiUsage: number;
  breachExposure: number;
  connectionVolume: number;
  previousScore?: number;
}

export interface ExposureFactor {
  key: ExposureFactorKey;
  label: string;
  description: string;
  rawValue: number;
  normalizedValue: number;
  weight: number;
  contribution: number;
}

export interface ExposureScoringResult {
  score: number;
  risk: RiskLevel;
  trend: ExposureTrendDirection;
  trendDelta: number;
  factors: ExposureFactor[];
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const normalize = (value: number, ceiling: number) => clamp(value / ceiling, 0, 1);
const rounded = (value: number) => Math.round(value * 10) / 10;
const riskFor = (score: number): RiskLevel => score >= 85 ? "critical" : score >= 65 ? "high" : score >= 35 ? "medium" : "low";

export function calculateExposureScore(input: ExposureScoringInput): ExposureScoringResult {
  const definitions = [
    { key: "trackers", label: "Tracker activity", description: "Observed third-party tracker requests", rawValue: input.trackerCount, normalizedValue: normalize(input.trackerCount, 80), weight: 0.3 },
    { key: "permissions", label: "Permission access", description: "Sensitive camera, microphone, clipboard, and screen events", rawValue: input.permissionAccesses, normalizedValue: normalize(input.permissionAccesses, 120), weight: 0.2 },
    { key: "public-wifi", label: "Public WiFi", description: "Sessions observed on untrusted public networks", rawValue: input.publicWifiUsage, normalizedValue: normalize(input.publicWifiUsage, 5), weight: 0.15 },
    { key: "breaches", label: "Breach exposure", description: "Known compromised account records", rawValue: input.breachExposure, normalizedValue: normalize(input.breachExposure, 5), weight: 0.2 },
    { key: "connections", label: "Connection volume", description: "Concurrent outbound network connections", rawValue: input.connectionVolume, normalizedValue: normalize(input.connectionVolume, 60), weight: 0.15 },
  ] satisfies Array<Omit<ExposureFactor, "contribution">>;
  const factors = definitions.map((factor) => ({ ...factor, contribution: rounded(factor.normalizedValue * factor.weight * 100) }));
  const score = Math.round(factors.reduce((sum, factor) => sum + factor.contribution, 0));
  const trendDelta = score - (input.previousScore ?? score);
  const trend = trendDelta > 1 ? "up" : trendDelta < -1 ? "down" : "stable";
  return { score, risk: riskFor(score), trend, trendDelta, factors: factors.sort((a, b) => b.contribution - a.contribution) };
}
