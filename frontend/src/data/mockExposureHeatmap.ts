export type ExposureLevel = "low" | "medium" | "high" | "critical";
export type ExposureSignal = "Trackers" | "Connections" | "Permissions" | "WiFi";

export interface ExposureHeatmapCell {
  hour: number;
  intensityBand: number;
  level: ExposureLevel;
  score: number;
  trackers: number;
  signal: ExposureSignal;
  detail: string;
}

export interface ExposureRange {
  id: "full-day" | "morning" | "afternoon" | "evening";
  label: string;
  startHour: number;
  endHour: number;
}

export const exposureRanges: ExposureRange[] = [
  { id: "full-day", label: "Full Day", startHour: 0, endHour: 23 },
  { id: "morning", label: "Morning", startHour: 6, endHour: 11 },
  { id: "afternoon", label: "Afternoon", startHour: 12, endHour: 17 },
  { id: "evening", label: "Evening", startHour: 18, endHour: 23 },
];

const hourlyProfiles = [
  { hour: 0, score: 12, trackers: 1, signal: "Connections", detail: "Background sync only" },
  { hour: 1, score: 8, trackers: 0, signal: "Connections", detail: "Minimal network traffic" },
  { hour: 2, score: 6, trackers: 0, signal: "Connections", detail: "Device idle" },
  { hour: 3, score: 7, trackers: 0, signal: "Connections", detail: "Device idle" },
  { hour: 4, score: 9, trackers: 1, signal: "Connections", detail: "Cloud backup heartbeat" },
  { hour: 5, score: 14, trackers: 1, signal: "Connections", detail: "Background application sync" },
  { hour: 6, score: 24, trackers: 3, signal: "Trackers", detail: "Morning news browsing" },
  { hour: 7, score: 38, trackers: 6, signal: "Trackers", detail: "Browser activity increasing" },
  { hour: 8, score: 57, trackers: 11, signal: "Trackers", detail: "Analytics-heavy browsing period" },
  { hour: 9, score: 84, trackers: 18, signal: "Trackers", detail: "Tracker spike across browser tabs" },
  { hour: 10, score: 71, trackers: 14, signal: "Permissions", detail: "Microphone access and active calls" },
  { hour: 11, score: 46, trackers: 8, signal: "Connections", detail: "Steady work session traffic" },
  { hour: 12, score: 33, trackers: 5, signal: "Connections", detail: "Reduced lunchtime activity" },
  { hour: 13, score: 41, trackers: 7, signal: "Trackers", detail: "Analytics requests resumed" },
  { hour: 14, score: 68, trackers: 13, signal: "Trackers", detail: "Ad attribution signals detected" },
  { hour: 15, score: 93, trackers: 21, signal: "WiFi", detail: "Public WiFi and tracker-heavy browsing" },
  { hour: 16, score: 77, trackers: 16, signal: "Trackers", detail: "Multiple high-risk tracker connections" },
  { hour: 17, score: 54, trackers: 10, signal: "Connections", detail: "Outbound traffic normalizing" },
  { hour: 18, score: 36, trackers: 5, signal: "Connections", detail: "Low-volume media traffic" },
  { hour: 19, score: 49, trackers: 8, signal: "Trackers", detail: "Streaming analytics active" },
  { hour: 20, score: 65, trackers: 12, signal: "Trackers", detail: "Social and media tracker overlap" },
  { hour: 21, score: 58, trackers: 9, signal: "Permissions", detail: "Clipboard and notification events" },
  { hour: 22, score: 29, trackers: 4, signal: "Connections", detail: "Session traffic decreasing" },
  { hour: 23, score: 17, trackers: 2, signal: "Connections", detail: "Background sync only" },
] satisfies Array<{ hour: number; score: number; trackers: number; signal: ExposureSignal; detail: string }>;

const levelFor = (score: number): ExposureLevel => score >= 80 ? "critical" : score >= 60 ? "high" : score >= 35 ? "medium" : "low";

export const exposureHeatmapCells: ExposureHeatmapCell[] = hourlyProfiles.flatMap((profile) =>
  [1, 2, 3, 4].map((band) => {
    const score = Math.max(4, Math.min(100, profile.score - Math.abs(4 - band) * 11 + band * 2));
    return { ...profile, intensityBand: band, level: levelFor(score), score };
  }),
);
