import { motion } from "framer-motion";
import { ArrowUpRight, RadioTower, ScanSearch, Wifi } from "lucide-react";
import { GlassPanel } from "../../components/ui/GlassPanel";

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.55 }}>
      {value}
    </motion.span>
  );
}

export function TrackerActivityCard({ count, increase }: { count: number; increase: number }) {
  return (
    <GlassPanel className="relative overflow-hidden p-5">
      <div className="absolute -right-6 top-2 h-24 w-24 rounded-full bg-purple/10 blur-3xl" />
      <div className="flex items-center justify-between"><p className="telemetry-label">Tracker Activity</p><ScanSearch className="text-purple" size={17} /></div>
      <p className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em] text-white"><AnimatedNumber value={count} /></p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[#8792aa]">Detected today</span>
        <span className="flex items-center gap-1 font-mono text-[10px] text-pink"><ArrowUpRight size={12} /> {increase}%</span>
      </div>
    </GlassPanel>
  );
}

export function ConnectionsCard({ count }: { count: number }) {
  return (
    <GlassPanel className="relative overflow-hidden p-5">
      <div className="absolute -right-6 top-2 h-24 w-24 rounded-full bg-cyan/10 blur-3xl" />
      <div className="flex items-center justify-between"><p className="telemetry-label">Active Connections</p><Wifi className="text-cyan" size={17} /></div>
      <p className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em] text-white"><AnimatedNumber value={count} /></p>
      <div className="mt-4 flex items-center gap-2 text-xs text-[#8792aa]">
        <motion.span animate={{ opacity: [0.35, 1, 0.35] }} className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" transition={{ duration: 1.4, repeat: Infinity }} />
        Live network sockets
      </div>
    </GlassPanel>
  );
}

const companies = [
  { name: "Google", count: 18, width: "100%" },
  { name: "Meta", count: 12, width: "67%" },
  { name: "Microsoft", count: 8, width: "44%" },
  { name: "Spotify", count: 5, width: "28%" },
  { name: "Discord", count: 4, width: "22%" },
];

export function TrackingCompaniesCard() {
  return (
    <GlassPanel className="h-full p-5">
      <div className="flex items-center justify-between"><p className="telemetry-label">Top Tracking Companies</p><RadioTower className="text-pink" size={16} /></div>
      <div className="mt-5 space-y-4">
        {companies.map((company, index) => (
          <div key={company.name}>
            <div className="mb-1.5 flex items-center justify-between text-xs"><span className="text-[#a4aec4]">{company.name}</span><span className="font-mono text-[10px] text-white">{company.count}</span></div>
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div animate={{ width: company.width }} className="h-full rounded-full bg-gradient-to-r from-cyan via-purple to-pink" initial={{ width: 0 }} transition={{ delay: index * 0.08, duration: 0.8 }} />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
