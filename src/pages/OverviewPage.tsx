import { DigitalShadowPreview } from "../features/dashboard/DigitalShadowPreview";
import { EventFeed } from "../features/dashboard/EventFeed";
import { ExposureScoreCard } from "../features/dashboard/ExposureScoreCard";
import { HeatmapCard } from "../features/dashboard/HeatmapCard";
import { PermissionsStrip } from "../features/dashboard/PermissionsStrip";
import { TrendCard } from "../features/dashboard/TrendCard";
import { mockTelemetry } from "../data/mockTelemetry";

export function OverviewPage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-5">
        <p className="telemetry-label text-cyan">Personal Observatory</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">Your digital shadow is active.</h2>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 h-[416px]">
          <DigitalShadowPreview />
        </div>
        <div className="col-span-4 h-[416px]">
          <ExposureScoreCard snapshot={mockTelemetry} />
        </div>
        <div className="col-span-3">
          <TrendCard trend={mockTelemetry.trend} />
        </div>
        <div className="col-span-5">
          <HeatmapCard cells={mockTelemetry.heatmap} />
        </div>
        <div className="col-span-4">
          <EventFeed events={mockTelemetry.recentEvents} />
        </div>
        <div className="col-span-12">
          <PermissionsStrip permissions={mockTelemetry.permissions} />
        </div>
      </div>
    </div>
  );
}
