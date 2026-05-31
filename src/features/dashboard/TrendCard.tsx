import { GlassPanel } from "../../components/ui/GlassPanel";
import type { ExposureTrendPoint } from "../../types/telemetry";

export function TrendCard({ trend }: { trend: ExposureTrendPoint[] }) {
  const points = trend.map((point, index) => `${(index / (trend.length - 1)) * 100},${100 - point.score}`).join(" ");

  return (
    <GlassPanel className="p-4">
      <div className="flex items-center justify-between">
        <p className="telemetry-label">Exposure Trend</p>
        <span className="font-mono text-[10px] text-pink">+18%</span>
      </div>
      <svg className="mt-5 h-[58px] w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="#9b5cff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="mt-4 text-xs text-[#8792aa]">Peak activity · <span className="text-white">14:00</span></p>
    </GlassPanel>
  );
}
