import type { TelemetrySnapshot } from "../types/telemetry";

export const mockTelemetry: TelemetrySnapshot = {
  score: 82,
  risk: "high",
  trendPercent: 18,
  trackerCount: 47,
  newTrackerCount: 8,
  eventCount: 1284,
  trend: [
    { hour: "08", score: 33 }, { hour: "09", score: 46 }, { hour: "10", score: 59 },
    { hour: "11", score: 53 }, { hour: "12", score: 66 }, { hour: "13", score: 70 },
    { hour: "14", score: 82 },
  ],
  heatmap: [
    { hour: "08", intensity: 1 }, { hour: "09", intensity: 2 }, { hour: "10", intensity: 4 },
    { hour: "11", intensity: 5 }, { hour: "12", intensity: 3 }, { hour: "13", intensity: 2 },
    { hour: "14", intensity: 4 }, { hour: "15", intensity: 3 }, { hour: "16", intensity: 1 },
  ],
  permissions: [
    { kind: "microphone", count: 47, leadingApp: "Zoom" },
    { kind: "camera", count: 6, leadingApp: "Chrome" },
    { kind: "clipboard", count: 18, leadingApp: "Discord" },
  ],
  recentEvents: [
    { id: "evt-1", timestamp: "14:38", kind: "tracker", title: "Analytics observed", detail: "Chrome / Google Analytics", risk: "high" },
    { id: "evt-2", timestamp: "14:32", kind: "permission", title: "Microphone accessed", detail: "Zoom / active session", risk: "medium" },
    { id: "evt-3", timestamp: "14:18", kind: "network", title: "Outbound connection opened", detail: "Discord / sentry.io", risk: "medium" },
  ],
};
