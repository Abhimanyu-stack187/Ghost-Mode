import { DigitalShadowPreview } from "../features/dashboard/DigitalShadowPreview";
import { EventFeed } from "../features/dashboard/EventFeed";
import { ExposureScoreCard } from "../features/dashboard/ExposureScoreCard";
import { ConnectionsCard, TrackerActivityCard, TrackingCompaniesCard } from "../features/dashboard/MetricCards";
import { PermissionsStrip } from "../features/dashboard/PermissionsStrip";
import { TrendCard } from "../features/dashboard/TrendCard";
import { useTelemetrySimulation } from "../contexts/TelemetrySimulationContext";

export function OverviewPage() {
  const { scoring, snapshot, trackers } = useTelemetrySimulation();
  if (!snapshot || !trackers) return <p className="telemetry-label text-cyan">Loading observatory telemetry...</p>;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6">
        <p className="telemetry-label text-cyan">Personal Observatory / Live telemetry</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Your digital shadow is active.</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#8792aa]">A real-time view of the signals, connections, and companies shaping your exposure profile.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="h-[410px] md:col-span-2 xl:col-span-9"><DigitalShadowPreview /></div>
        <div className="min-h-[360px] xl:col-span-3"><ExposureScoreCard scoring={scoring} snapshot={snapshot} /></div>
        <div className="xl:col-span-3"><TrackerActivityCard count={trackers.trackerCount} increase={snapshot.trendPercent} /></div>
        <div className="xl:col-span-3"><ConnectionsCard count={trackers.activeConnections} /></div>
        <div className="md:col-span-2 xl:col-span-3 xl:row-span-2"><EventFeed events={snapshot.recentEvents} /></div>
        <div className="md:row-span-2 xl:col-span-3 xl:row-span-2"><TrackingCompaniesCard /></div>
        <div className="md:col-span-2 xl:col-span-6"><TrendCard trend={snapshot.trend} /></div>
        <div className="md:col-span-2 xl:col-span-12"><PermissionsStrip permissions={snapshot.permissions} /></div>
      </div>
    </div>
  );
}
