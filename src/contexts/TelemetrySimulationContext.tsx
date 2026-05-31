import { createContext, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { calculateExposureScore, type ExposureScoringInput, type ExposureScoringResult } from "../services/exposureScoring";
import { getExposureData, getTrackerData, shouldUseBackendTelemetry, subscribeToBackendTelemetry, type BackendTelemetryEvent, type TrackerData } from "../services/telemetry";
import type { RiskLevel, TelemetryEvent, TelemetryEventKind, TelemetrySnapshot } from "../types/telemetry";
import { useNotifications } from "./NotificationContext";

interface SimulatedEventTemplate {
  kind: TelemetryEventKind;
  title: string;
  details: string[];
  risk: RiskLevel;
  trackerDelta?: number;
  connectionDelta?: number;
  permissionDelta?: number;
  publicWifiDelta?: number;
}

interface TelemetrySimulationState {
  snapshot?: TelemetrySnapshot;
  trackers?: TrackerData;
  scoring?: ExposureScoringResult;
  backendLive: boolean;
}

const templates: SimulatedEventTemplate[] = [
  { kind: "tracker", title: "Tracker detected", details: ["Chrome / Google Analytics", "Spotify / Ads Measurement", "Discord / sentry.io", "Chrome / DoubleClick"], risk: "high", trackerDelta: 1 },
  { kind: "network", title: "Connection opened", details: ["Chrome / accounts.google.com", "Discord / gateway.discord.gg", "Spotify / api-partner.spotify.com"], risk: "medium", connectionDelta: 1 },
  { kind: "network", title: "Domain resolved", details: ["DNS / google-analytics.com", "DNS / cdn.discordapp.com", "DNS / doubleclick.net"], risk: "low" },
  { kind: "permission", title: "Permission accessed", details: ["Discord / microphone", "Chrome / clipboard", "Zoom / camera"], risk: "medium", permissionDelta: 1 },
  { kind: "app", title: "Exposure increased", details: ["Browser activity crossed risk threshold", "Public WiFi telemetry increased", "Tracker cluster became active"], risk: "high", publicWifiDelta: 1 },
];

const TelemetrySimulationContext = createContext<TelemetrySimulationState | undefined>(undefined);
const pick = <T,>(values: T[]) => values[Math.floor(Math.random() * values.length)];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function createTelemetryEvent(template: SimulatedEventTemplate): TelemetryEvent {
  return { id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }), kind: template.kind, title: template.title, detail: pick(template.details), risk: template.risk };
}

function createBackendEvent(event: BackendTelemetryEvent): TelemetryEvent {
  const processName = event.process || "unknown process";
  const destination = event.port ? `${event.ip}:${event.port}` : event.ip;
  const risk = event.severity || event.risk || "medium";
  const category = event.company && event.category ? `${event.company} ${event.category}` : "Network";
  const score = event.riskScore ? ` / score ${event.riskScore}` : "";
  return {
    id: `backend-${event.timestamp}-${processName}-${destination}`,
    timestamp: new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
    kind: "network",
    title: `${risk.toUpperCase()} risk connection`,
    detail: `${processName} / ${destination} / ${category}${event.protocol ? ` / ${event.protocol}` : ""}${score}`,
    risk,
  };
}

export function TelemetrySimulationProvider({ children }: PropsWithChildren) {
  const { pushNotification } = useNotifications();
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot>();
  const [trackers, setTrackers] = useState<TrackerData>();
  const [scoring, setScoring] = useState<ExposureScoringResult>();
  const [backendLive, setBackendLive] = useState(false);
  const scoringInput = useRef<ExposureScoringInput>();

  useEffect(() => {
    let active = true;
    Promise.all([getExposureData(), getTrackerData()]).then(([initialSnapshot, initialTrackers]) => {
      if (!active) return;
      const input = { trackerCount: initialTrackers.trackerCount, permissionAccesses: initialSnapshot.permissions.reduce((sum, permission) => sum + permission.count, 0), publicWifiUsage: 1, breachExposure: 3, connectionVolume: initialTrackers.activeConnections };
      const result = calculateExposureScore(input);
      scoringInput.current = input;
      setScoring(result);
      setSnapshot({ ...initialSnapshot, score: result.score, risk: result.risk });
      setTrackers(initialTrackers);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!shouldUseBackendTelemetry() || !snapshot || !trackers) return;

    return subscribeToBackendTelemetry({
      onOpen: () => setBackendLive(true),
      onClose: () => setBackendLive(false),
      onError: () => setBackendLive(false),
      onEvent: (backendEvent) => {
        const event = createBackendEvent(backendEvent);
        const currentInput = scoringInput.current;
        if (!currentInput) return;

        const input = {
          ...currentInput,
          connectionVolume: clamp(backendEvent.activeConnections ?? currentInput.connectionVolume + 1, 1, 128),
          previousScore: scoringInput.current?.previousScore,
        };
        const result = calculateExposureScore(input);
        scoringInput.current = { ...input, previousScore: result.score };
        setScoring(result);
        pushNotification(event);
        setSnapshot((current) => current ? { ...current, score: result.score, risk: result.risk, trendPercent: Math.abs(result.trendDelta), eventCount: current.eventCount + 1, recentEvents: [event, ...current.recentEvents].slice(0, 5) } : current);
        setTrackers((current) => current ? { ...current, eventCount: current.eventCount + 1, activeConnections: input.connectionVolume } : current);
      },
    });
  }, [Boolean(snapshot), Boolean(trackers), pushNotification]);

  useEffect(() => {
    if (!snapshot || !trackers || backendLive) return;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        const template = pick(templates);
        const event = createTelemetryEvent(template);
        const currentInput = scoringInput.current;
        if (!currentInput) return;
        const input = { ...currentInput, trackerCount: currentInput.trackerCount + (template.trackerDelta ?? 0), permissionAccesses: currentInput.permissionAccesses + (template.permissionDelta ?? 0), publicWifiUsage: currentInput.publicWifiUsage + (template.publicWifiDelta ?? 0), connectionVolume: clamp(currentInput.connectionVolume + (template.connectionDelta ?? (Math.random() > 0.72 ? -1 : 0)), 8, 64), previousScore: scoring?.score };
        const result = calculateExposureScore(input);
        scoringInput.current = input;
        setScoring(result);
        pushNotification(event);
        setSnapshot((current) => current ? { ...current, score: result.score, risk: result.risk, trendPercent: Math.abs(result.trendDelta), eventCount: current.eventCount + 1, trackerCount: input.trackerCount, newTrackerCount: current.newTrackerCount + (template.trackerDelta ?? 0), recentEvents: [event, ...current.recentEvents].slice(0, 5) } : current);
        setTrackers((current) => current ? { ...current, eventCount: current.eventCount + 1, trackerCount: input.trackerCount, newTrackerCount: current.newTrackerCount + (template.trackerDelta ?? 0), activeConnections: input.connectionVolume } : current);
        schedule();
      }, 2800 + Math.random() * 3200);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [backendLive, Boolean(snapshot), Boolean(trackers), pushNotification, scoring?.score]);

  const value = useMemo(() => ({ backendLive, scoring, snapshot, trackers }), [backendLive, scoring, snapshot, trackers]);
  return <TelemetrySimulationContext.Provider value={value}>{children}</TelemetrySimulationContext.Provider>;
}

export function useTelemetrySimulation() {
  const context = useContext(TelemetrySimulationContext);
  if (!context) throw new Error("useTelemetrySimulation must be used within TelemetrySimulationProvider");
  return context;
}
