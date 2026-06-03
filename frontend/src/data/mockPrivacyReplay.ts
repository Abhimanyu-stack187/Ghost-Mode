export type ReplayEventType =
  | "application-launch"
  | "network-connection"
  | "tracker-detection"
  | "permission-access"
  | "wifi-change"
  | "exposure-increase";

export type ReplayRisk = "low" | "medium" | "high";

export interface ReplayEvent {
  id: string;
  minute: number;
  timestamp: string;
  type: ReplayEventType;
  title: string;
  detail: string;
  exposure: number;
  risk: ReplayRisk;
}

export const replayDuration = 45;

export const replayEvents: ReplayEvent[] = [
  { id: "evt-01", minute: 0, timestamp: "09:00", type: "application-launch", title: "Chrome launched", detail: "Browser session initialized", exposure: 18, risk: "low" },
  { id: "evt-02", minute: 2, timestamp: "09:02", type: "network-connection", title: "Connected to Google", detail: "HTTPS connection / google.com", exposure: 30, risk: "medium" },
  { id: "evt-03", minute: 3, timestamp: "09:03", type: "tracker-detection", title: "Tracker detected", detail: "DoubleClick attribution pixel observed", exposure: 58, risk: "high" },
  { id: "evt-04", minute: 5, timestamp: "09:05", type: "application-launch", title: "Discord launched", detail: "Desktop client session initialized", exposure: 42, risk: "low" },
  { id: "evt-05", minute: 10, timestamp: "09:10", type: "permission-access", title: "Microphone access granted", detail: "Discord voice session requested access", exposure: 72, risk: "high" },
  { id: "evt-06", minute: 15, timestamp: "09:15", type: "wifi-change", title: "Connected to Public WiFi", detail: "Network changed / Cafe_Guest_5G", exposure: 86, risk: "high" },
  { id: "evt-07", minute: 21, timestamp: "09:21", type: "tracker-detection", title: "Analytics request detected", detail: "Google Analytics measurement event", exposure: 64, risk: "medium" },
  { id: "evt-08", minute: 29, timestamp: "09:29", type: "network-connection", title: "Discord telemetry sent", detail: "Outbound connection / sentry.io", exposure: 51, risk: "medium" },
  { id: "evt-09", minute: 36, timestamp: "09:36", type: "exposure-increase", title: "Exposure score increased", detail: "Risk threshold crossed / +14 points", exposure: 78, risk: "high" },
  { id: "evt-10", minute: 43, timestamp: "09:43", type: "permission-access", title: "Clipboard accessed", detail: "Chrome requested clipboard contents", exposure: 67, risk: "medium" },
];
