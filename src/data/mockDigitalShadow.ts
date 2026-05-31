export type ShadowNodeKind = "user" | "application" | "tracker-company";
export type ShadowRisk = "low" | "medium" | "high";

export interface ShadowNode {
  id: string;
  label: string;
  kind: ShadowNodeKind;
  risk: ShadowRisk;
  detail: string;
  events: number;
}

export interface ShadowLink {
  source: string;
  target: string;
  signal: string;
}

export const shadowNodes: ShadowNode[] = [
  { id: "user", label: "You", kind: "user", risk: "low", detail: "Protected identity root", events: 1284 },
  { id: "chrome", label: "Chrome", kind: "application", risk: "high", detail: "Browser activity observed", events: 742 },
  { id: "spotify", label: "Spotify", kind: "application", risk: "medium", detail: "Media telemetry active", events: 228 },
  { id: "discord", label: "Discord", kind: "application", risk: "medium", detail: "Social connection active", events: 314 },
  { id: "google-analytics", label: "Google Analytics", kind: "tracker-company", risk: "high", detail: "Analytics and advertising signals", events: 418 },
  { id: "doubleclick", label: "DoubleClick", kind: "tracker-company", risk: "high", detail: "Advertising attribution", events: 194 },
  { id: "spotify-analytics", label: "Spotify Analytics", kind: "tracker-company", risk: "medium", detail: "Playback measurement", events: 228 },
  { id: "discord-tracking", label: "Discord Tracking", kind: "tracker-company", risk: "medium", detail: "Session and diagnostic telemetry", events: 183 },
  { id: "sentry", label: "Sentry", kind: "tracker-company", risk: "medium", detail: "Application diagnostics", events: 131 },
];

export const shadowLinks: ShadowLink[] = [
  { source: "user", target: "chrome", signal: "Browsing activity" },
  { source: "user", target: "spotify", signal: "Playback activity" },
  { source: "user", target: "discord", signal: "Session activity" },
  { source: "chrome", target: "google-analytics", signal: "Analytics request" },
  { source: "chrome", target: "doubleclick", signal: "Ad attribution" },
  { source: "spotify", target: "spotify-analytics", signal: "Usage telemetry" },
  { source: "discord", target: "discord-tracking", signal: "Session telemetry" },
  { source: "discord", target: "sentry", signal: "Diagnostic event" },
];
