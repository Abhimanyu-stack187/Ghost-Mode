import { motion } from "framer-motion";
import { Activity, Clock3, RadioTower, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { GlassPanel } from "../components/ui/GlassPanel";
import { ExposureHeatmap } from "../features/exposure-map/ExposureHeatmap";
import { useTelemetryQuery } from "../hooks/useTelemetryQuery";
import { getHeatmapData } from "../services/telemetry";

const legend = [["Low", "#38e88b"], ["Medium", "#ffd84d"], ["High", "#ff9838"], ["Critical", "#ff4d5f"]];

export function ExposureMapPage() {
  const { data } = useTelemetryQuery(getHeatmapData);
  const [rangeId, setRangeId] = useState("full-day");
  const range = data?.ranges.find((option) => option.id === rangeId) ?? data?.ranges[0];
  const cells = useMemo(() => !data || !range ? [] : data.cells.filter((cell) => cell.hour >= range.startHour && cell.hour <= range.endHour), [data, range]);
  if (!data || !range || cells.length === 0) return <p className="telemetry-label text-cyan">Loading exposure telemetry...</p>;
  const hourlyCells = cells.filter((cell) => cell.intensityBand === 4);
  const peak = hourlyCells.reduce((highest, cell) => cell.score > highest.score ? cell : highest, hourlyCells[0]);
  const safeHours = hourlyCells.filter((cell) => cell.level === "low").length;
  const trackerPeak = hourlyCells.reduce((highest, cell) => cell.trackers > highest.trackers ? cell : highest, hourlyCells[0]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="telemetry-label text-cyan">Outbound Activity / Exposure intensity</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Exposure Heatmap</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#8792aa]">Identify safe windows, tracker-heavy periods, and high-risk spikes across your daily digital activity.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.ranges.map((option) => <button className={`rounded-lg border px-3 py-2 font-mono text-[9px] uppercase tracking-wider transition ${option.id === range.id ? "border-cyan/35 bg-cyan/10 text-cyan" : "border-white/[0.08] bg-white/[0.025] text-[#8792aa] hover:text-white"}`} key={option.id} onClick={() => setRangeId(option.id)}>{option.label}</button>)}
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Peak Exposure", value: `${peak.score}% / ${String(peak.hour).padStart(2, "0")}:00`, icon: ShieldAlert, color: "text-pink" },
          { label: "Tracker-Heavy Peak", value: `${trackerPeak.trackers} SIGNALS`, icon: RadioTower, color: "text-amber" },
          { label: "Safe Periods", value: `${safeHours} HOURS`, icon: Clock3, color: "text-cyan" },
        ].map(({ label, value, icon: Icon, color }, index) => (
          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 8 }} key={label} transition={{ delay: index * 0.08 }}>
            <GlassPanel className="flex items-center gap-4 px-4 py-3"><div className={`grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] ${color}`}><Icon size={16} /></div><div><p className="telemetry-label">{label}</p><p className="mt-1 font-display text-lg font-semibold text-white">{value}</p></div></GlassPanel>
          </motion.div>
        ))}
      </div>

      <GlassPanel className="overflow-hidden p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><p className="telemetry-label">Exposure Intensity / Time of Day</p><p className="mt-2 text-xs text-[#8792aa]">Hover over a cell to inspect its dominant signal and tracker count.</p></div>
          <div className="flex flex-wrap gap-3">{legend.map(([label, color]) => <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-[#8792aa]" key={label}><i className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />{label}</span>)}</div>
        </div>
        <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#070b14]/65 p-2"><ExposureHeatmap cells={cells} /></div>
        <div className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[#657089]"><Activity size={13} className="text-cyan" /> X Axis: Time / Y Axis: Exposure Intensity</div>
      </GlassPanel>
    </div>
  );
}
