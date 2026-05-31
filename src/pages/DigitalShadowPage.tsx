import { motion } from "framer-motion";
import { Activity, Crosshair, GitFork, Move, ScanSearch } from "lucide-react";
import { GlassPanel } from "../components/ui/GlassPanel";
import { shadowLinks, shadowNodes } from "../data/mockDigitalShadow";
import { DigitalShadowGraph } from "../features/digital-shadow/DigitalShadowGraph";

const stats = [
  { label: "Applications", value: "03", icon: Activity, color: "text-cyan" },
  { label: "Tracking Entities", value: "05", icon: Crosshair, color: "text-pink" },
  { label: "Observed Signals", value: "1,284", icon: ScanSearch, color: "text-purple" },
];

export function DigitalShadowPage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="telemetry-label text-cyan">Relationship Graph / Live telemetry</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Digital Shadow Graph</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#8792aa]">Trace the applications and tracker companies connected to your identity. Drag nodes to investigate clusters, then zoom into the signal paths.</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-[#8792aa]"><Move size={14} className="text-cyan" /> DRAG NODES / SCROLL TO ZOOM</div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }, index) => (
          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} key={label} transition={{ delay: index * 0.08 }}>
            <GlassPanel className="flex items-center gap-4 px-4 py-3">
              <div className={`grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] ${color}`}><Icon size={16} /></div>
              <div><p className="telemetry-label">{label}</p><p className="mt-1 font-display text-xl font-semibold text-white">{value}</p></div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <GlassPanel className="relative overflow-hidden p-2">
        <div className="pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-2 rounded-lg border border-cyan/15 bg-[#080d18]/70 px-3 py-2 font-mono text-[9px] tracking-[0.14em] text-cyan backdrop-blur">
          <GitFork size={13} /> IDENTITY RELATIONSHIP MAP
        </div>
        <div className="pointer-events-none absolute bottom-5 left-5 z-10 flex flex-wrap gap-3 rounded-lg border border-white/[0.08] bg-[#080d18]/70 px-3 py-2 backdrop-blur">
          {[
            ["User", "#35e9ff"], ["Application", "#4586ff"], ["Tracker Company", "#9b5cff"], ["High Risk", "#ff4d6d"],
          ].map(([label, color]) => <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-wider text-[#8792aa]" key={label}><i className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />{label.toUpperCase()}</span>)}
        </div>
        <DigitalShadowGraph links={shadowLinks} nodes={shadowNodes} />
      </GlassPanel>
    </div>
  );
}
