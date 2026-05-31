import { Clock3, RadioTower, ShieldAlert } from "lucide-react";
import { GlassPanel } from "../components/ui/GlassPanel";
import { PrivacyReplayTimeline } from "../features/privacy-replay/PrivacyReplayTimeline";
import { useTelemetryQuery } from "../hooks/useTelemetryQuery";
import { getTimelineData } from "../services/telemetry";

const stats = [
  { label: "Replay Window", value: "45 MIN", icon: Clock3, color: "text-cyan" },
  { label: "Observed Events", value: "10", icon: RadioTower, color: "text-purple" },
  { label: "High Risk Spikes", value: "04", icon: ShieldAlert, color: "text-pink" },
];

export function PrivacyReplayPage() {
  const { data } = useTelemetryQuery(getTimelineData);
  if (!data) return <p className="telemetry-label text-cyan">Loading replay telemetry...</p>;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6">
        <p className="telemetry-label text-cyan">Timeline Reconstruction / Session telemetry</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Privacy Replay</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#8792aa]">Step through your digital activity and see how small actions compound into a larger exposure profile.</p>
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <GlassPanel className="flex items-center gap-4 px-4 py-3" key={label}>
            <div className={`grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] ${color}`}><Icon size={16} /></div>
            <div><p className="telemetry-label">{label}</p><p className="mt-1 font-display text-xl font-semibold text-white">{value}</p></div>
          </GlassPanel>
        ))}
      </div>
      <PrivacyReplayTimeline duration={data.duration} events={data.events} />
    </div>
  );
}
