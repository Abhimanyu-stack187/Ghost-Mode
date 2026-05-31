import { Eye, KeyRound, RadioTower } from "lucide-react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import type { TelemetryEvent, TelemetryEventKind } from "../../types/telemetry";

const icons: Record<TelemetryEventKind, typeof Eye> = {
  tracker: Eye,
  permission: KeyRound,
  network: RadioTower,
  app: RadioTower,
};

export function EventFeed({ events }: { events: TelemetryEvent[] }) {
  return (
    <GlassPanel className="p-4">
      <div className="flex items-center justify-between">
        <p className="telemetry-label">Recent Observations</p>
        <span className="font-mono text-[9px] text-cyan">LIVE</span>
      </div>
      <div className="mt-3 divide-y divide-white/[0.06]">
        {events.map((event) => {
          const Icon = icons[event.kind];
          return (
            <div className="flex items-center gap-3 py-3" key={event.id}>
              <div className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-cyan">
                <Icon size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-white">{event.title}</p>
                <p className="mt-1 truncate text-[10px] text-[#657089]">{event.detail}</p>
              </div>
              <span className="font-mono text-[9px] text-[#8792aa]">{event.timestamp}</span>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
