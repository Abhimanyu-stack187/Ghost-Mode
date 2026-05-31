import { motion } from "framer-motion";
import { ArrowUpRight, Radar } from "lucide-react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { RiskBadge } from "../../components/ui/RiskBadge";
import type { TelemetrySnapshot } from "../../types/telemetry";
import type { ExposureScoringResult } from "../../services/exposureScoring";

export function ExposureScoreCard({ snapshot, scoring }: { snapshot: TelemetrySnapshot; scoring?: ExposureScoringResult }) {
  const circumference = 2 * Math.PI * 72;
  const offset = circumference * (1 - snapshot.score / 100);

  return (
    <GlassPanel className="relative flex h-full flex-col overflow-hidden p-5">
      <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-pink/10 blur-[55px]" />
      <div className="flex items-center justify-between">
        <p className="telemetry-label">Exposure Score</p>
        <Radar size={16} className="text-pink" />
      </div>
      <div className="relative mx-auto mt-4 h-44 w-44">
        <svg className="-rotate-90" height="176" viewBox="0 0 176 176" width="176">
          <circle cx="88" cy="88" fill="none" r="72" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <motion.circle
            animate={{ strokeDashoffset: offset }}
            cx="88"
            cy="88"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            r="72"
            stroke="url(#scoreGradient)"
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeWidth="10"
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="scoreGradient">
              <stop stopColor="#35e9ff" />
              <stop offset="0.56" stopColor="#9b5cff" />
              <stop offset="1" stopColor="#ff4d9d" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <motion.span
              animate={{ opacity: 1, scale: [0.96, 1.04, 1] }}
              key={snapshot.score}
              initial={{ opacity: 0, scale: 0.86 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl font-semibold tracking-[-0.08em] text-white"
            >
              {snapshot.score}
            </motion.span>
            <p className="mt-1 font-mono text-[9px] tracking-[0.18em] text-[#657089]">OF 100</p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <RiskBadge risk={snapshot.risk} />
        <span className="flex items-center gap-1 font-mono text-[10px] text-pink">
          <ArrowUpRight size={13} /> {snapshot.trendPercent}% TODAY
        </span>
      </div>
      <div className="mt-auto border-t border-white/[0.06] pt-4">
        {(scoring?.factors.slice(0, 2) ?? []).map((factor) => <div className="mb-2 flex justify-between text-xs" key={factor.key}><span className="text-[#8792aa]">{factor.label}</span><span className="font-mono font-bold text-white">+{factor.contribution}</span></div>)}
        {!scoring && <div className="flex justify-between text-xs"><span className="text-[#8792aa]">Trackers observed</span><span className="font-mono font-bold text-white">{snapshot.trackerCount}</span></div>}
      </div>
    </GlassPanel>
  );
}
