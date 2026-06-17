import type { RiskLevel } from "../types/telemetry";

export type PermissionKind = "camera" | "microphone" | "clipboard" | "screen-recording";

export interface PermissionAccessRecord {
  id: string;
  kind: PermissionKind;
  application: string;
  frequency: number;
  lastAccess: string;
  risk: RiskLevel;
  note: string;
}

export interface PermissionEvent {
  id: string;
  timestamp: string;
  kind: PermissionKind;
  application: string;
  action: string;
  risk: RiskLevel;
}

export const permissionAccessRecords: PermissionAccessRecord[] = [
  { id: "camera-chrome", kind: "camera", application: "Chrome", frequency: 6, lastAccess: "14:04", risk: "medium", note: "Video meeting tab accessed camera" },
  { id: "camera-zoom", kind: "camera", application: "Zoom", frequency: 11, lastAccess: "13:42", risk: "low", note: "Authorized meeting session" },
  { id: "microphone-discord", kind: "microphone", application: "Discord", frequency: 24, lastAccess: "14:18", risk: "high", note: "Background voice channel remained active" },
  { id: "microphone-zoom", kind: "microphone", application: "Zoom", frequency: 47, lastAccess: "13:42", risk: "medium", note: "Authorized meeting session" },
  { id: "clipboard-chrome", kind: "clipboard", application: "Chrome", frequency: 18, lastAccess: "14:31", risk: "high", note: "Clipboard read from browser context" },
  { id: "clipboard-discord", kind: "clipboard", application: "Discord", frequency: 7, lastAccess: "12:16", risk: "medium", note: "Clipboard content pasted into chat" },
  { id: "screen-obs", kind: "screen-recording", application: "OBS Studio", frequency: 3, lastAccess: "11:52", risk: "medium", note: "Desktop capture session active" },
  { id: "screen-zoom", kind: "screen-recording", application: "Zoom", frequency: 2, lastAccess: "10:26", risk: "high", note: "Entire screen shared during meeting" },
];

export const permissionEvents: PermissionEvent[] = [
  { id: "perm-01", timestamp: "14:31", kind: "clipboard", application: "Chrome", action: "Clipboard contents read", risk: "high" },
  { id: "perm-02", timestamp: "14:18", kind: "microphone", application: "Discord", action: "Microphone session accessed", risk: "high" },
  { id: "perm-03", timestamp: "14:04", kind: "camera", application: "Chrome", action: "Camera access granted", risk: "medium" },
  { id: "perm-04", timestamp: "13:42", kind: "microphone", application: "Zoom", action: "Microphone session ended", risk: "low" },
  { id: "perm-05", timestamp: "11:52", kind: "screen-recording", application: "OBS Studio", action: "Screen recording started", risk: "medium" },
  { id: "perm-06", timestamp: "10:26", kind: "screen-recording", application: "Zoom", action: "Screen sharing granted", risk: "high" },
];
