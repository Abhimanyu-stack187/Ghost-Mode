import { exposureHeatmapCells, exposureRanges, type ExposureHeatmapCell, type ExposureRange } from "../data/mockExposureHeatmap";
import { mockLeakExposure, type LeakExposure } from "../data/mockLeaks";
import { replayDuration, replayEvents, type ReplayEvent } from "../data/mockPrivacyReplay";
import { mockTelemetry } from "../data/mockTelemetry";
import type { TelemetrySnapshot } from "../types/telemetry";

export interface TrackerCompanySummary {
  name: string;
  count: number;
}

export interface TrackerData {
  trackerCount: number;
  newTrackerCount: number;
  eventCount: number;
  activeConnections: number;
  companies: TrackerCompanySummary[];
}

export interface TimelineData {
  duration: number;
  events: ReplayEvent[];
}

export interface HeatmapData {
  cells: ExposureHeatmapCell[];
  ranges: ExposureRange[];
}

export interface TelemetryChannelMap {
  "telemetry:exposure": TelemetrySnapshot;
  "telemetry:trackers": TrackerData;
  "telemetry:timeline": TimelineData;
  "telemetry:heatmap": HeatmapData;
  "telemetry:leaks": LeakExposure;
}

export interface TelemetryRequestMap {
  "telemetry:exposure": undefined;
  "telemetry:trackers": undefined;
  "telemetry:timeline": undefined;
  "telemetry:heatmap": undefined;
  "telemetry:leaks": { email?: string };
}

export type TelemetryChannel = keyof TelemetryChannelMap;

export interface TelemetryTransport {
  request<K extends TelemetryChannel>(channel: K, payload?: TelemetryRequestMap[K]): Promise<TelemetryChannelMap[K]>;
}

export interface ElectronTelemetryBridge {
  invoke(channel: string, payload?: unknown): Promise<unknown>;
}

const trackerData: TrackerData = {
  trackerCount: mockTelemetry.trackerCount,
  newTrackerCount: mockTelemetry.newTrackerCount,
  eventCount: mockTelemetry.eventCount,
  activeConnections: 23,
  companies: [
    { name: "Google", count: 18 },
    { name: "Meta", count: 12 },
    { name: "Microsoft", count: 8 },
    { name: "Spotify", count: 5 },
    { name: "Discord", count: 4 },
  ],
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function createMockTelemetryTransport(): TelemetryTransport {
  return {
    async request<K extends TelemetryChannel>(channel: K, payload?: TelemetryRequestMap[K]) {
      await Promise.resolve();
      switch (channel) {
        case "telemetry:exposure":
          return clone(mockTelemetry) as TelemetryChannelMap[K];
        case "telemetry:trackers":
          return clone(trackerData) as TelemetryChannelMap[K];
        case "telemetry:timeline":
          return clone({ duration: replayDuration, events: replayEvents }) as TelemetryChannelMap[K];
        case "telemetry:heatmap":
          return clone({ cells: exposureHeatmapCells, ranges: exposureRanges }) as TelemetryChannelMap[K];
        case "telemetry:leaks": {
          const email = (payload as TelemetryRequestMap["telemetry:leaks"] | undefined)?.email?.trim();
          return clone({ ...mockLeakExposure, email: email || mockLeakExposure.email }) as TelemetryChannelMap[K];
        }
        default:
          throw new Error(`Unsupported telemetry channel: ${channel}`);
      }
    },
  };
}

export function createElectronTelemetryTransport(bridge: ElectronTelemetryBridge): TelemetryTransport {
  return {
    async request<K extends TelemetryChannel>(channel: K, payload?: TelemetryRequestMap[K]) {
      return bridge.invoke(channel, payload) as Promise<TelemetryChannelMap[K]>;
    },
  };
}

let telemetryTransport: TelemetryTransport = createMockTelemetryTransport();

export function setTelemetryTransport(transport: TelemetryTransport) {
  telemetryTransport = transport;
}

export function resetTelemetryTransport() {
  telemetryTransport = createMockTelemetryTransport();
}

export async function getExposureData() {
  return telemetryTransport.request("telemetry:exposure");
}

export async function getTrackerData() {
  return telemetryTransport.request("telemetry:trackers");
}

export async function getTimelineData() {
  return telemetryTransport.request("telemetry:timeline");
}

export async function getHeatmapData() {
  return telemetryTransport.request("telemetry:heatmap");
}

export async function getLeakData(email?: string) {
  return telemetryTransport.request("telemetry:leaks", { email });
}
