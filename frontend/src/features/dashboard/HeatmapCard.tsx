import { GlassPanel } from "../../components/ui/GlassPanel";
import type { HeatmapCell } from "../../types/telemetry";

const cellColors = ["", "bg-cyan/10", "bg-cyan/25", "bg-purple/45", "bg-pink/55", "bg-pink/90 shadow-[0_0_16px_rgba(255,77,157,0.4)]"];

export function HeatmapCard({ cells }: { cells: HeatmapCell[] }) {
  return (
    <GlassPanel className="p-4">
      <div className="flex items-center justify-between">
        <p className="telemetry-label">Exposure Heatmap</p>
        <span className="font-mono text-[9px] tracking-wide text-[#657089]">TODAY</span>
      </div>
      <div className="mt-7 flex gap-2">
        {cells.map((cell) => (
          <div key={cell.hour} className="flex-1">
            <div className={`h-11 rounded-md border border-white/[0.06] ${cellColors[cell.intensity]}`} />
            <p className="mt-2 text-center font-mono text-[8px] text-[#657089]">{cell.hour}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[#8792aa]">Highest exposure · <span className="text-white">11:00</span></p>
    </GlassPanel>
  );
}
