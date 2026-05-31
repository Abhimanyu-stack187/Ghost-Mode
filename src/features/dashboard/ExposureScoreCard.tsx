import { motion } from "framer-motion";
import { ArrowUpRight, Radar } from "lucide-react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { RiskBadge } from "../../components/ui/RiskBadge";
import type { TelemetrySnapshot } from "../../types/telemetry";

export function ExposureScoreCard({ snapshot }: { snapshot: TelemetrySnapshot }) {
  return (
    <GlassPanel className="relative flex h-full flex-col overflow-hidden p-5">
      <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-pink/10 blur-[55px]" />
      <div className="flex items-center justify-between">
        <p className="telemetry-label">Exposure Score</p>
        <Radar size={16} className="text-pink" />
      </div>
      <div className="mt-7 flex items-end gap-2">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-7xl font-semibold tracking-[-0.08em] text-white"
        >
          {snapshot.score}
        </motion.span>
        <span className="mb-2 font-mono text-xs text-[#657089]">/ 100</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <RiskBadge risk={snapshot.risk} />
        <span className="flex items-center gap-1 font-mono text-[10px] text-pink">
          <ArrowUpRight size={13} /> {snapshot.trendPercent}% TODAY
        </span>
      </div>
      <div className="mt-auto border-t border-white/[0.06] pt-4">
        <div className="flex justify-between text-xs">
          <span className="text-[#8792aa]">Trackers observed</span>
          <span className="font-mono font-bold text-white">{snapshot.trackerCount}</span>
        </div>
        <div className="mt-2 flex justify-between text-xs">
          <span className="text-[#8792aa]">New today</span>
          <span className="font-mono font-bold text-cyan">+{snapshot.newTrackerCount}</span>
        </div>
      </div>
    </GlassPanel>
  );
}
