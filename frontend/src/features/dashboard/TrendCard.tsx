import { motion } from "framer-motion";
import { GlassPanel } from "../../components/ui/GlassPanel";
import type { ExposureTrendPoint } from "../../types/telemetry";

export function TrendCard({ trend }: { trend: ExposureTrendPoint[] }) {
  const points = trend.map((point, index) => `${(index / (trend.length - 1)) * 100},${92 - point.score * 0.72}`).join(" ");
  const area = `0,100 ${points} 100,100`;

  return (
    <GlassPanel className="h-full p-5">
      <div className="flex items-center justify-between"><p className="telemetry-label">Exposure Trend</p><span className="font-mono text-[10px] text-pink">+18%</span></div>
      <svg className="mt-6 h-[140px] w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs><linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#9b5cff" stopOpacity="0.35" /><stop offset="1" stopColor="#9b5cff" stopOpacity="0" /></linearGradient></defs>
        <polygon fill="url(#trendArea)" points={area} />
        <motion.polyline animate={{ pathLength: 1, opacity: 1 }} fill="none" initial={{ pathLength: 0, opacity: 0 }} points={points} stroke="#9b5cff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transition={{ duration: 1.4 }} />
      </svg>
      <div className="mt-3 flex justify-between font-mono text-[9px] text-[#657089]">{trend.map((point) => <span key={point.hour}>{point.hour}:00</span>)}</div>
    </GlassPanel>
  );
}
