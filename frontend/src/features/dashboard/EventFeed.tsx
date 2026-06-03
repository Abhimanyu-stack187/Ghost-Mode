import { motion } from "framer-motion";
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
    <GlassPanel className="h-full p-5">
      <div className="flex items-center justify-between"><p className="telemetry-label">Recent Events</p><span className="font-mono text-[9px] text-cyan">LIVE</span></div>
      <div className="mt-5">
        {events.map((event, index) => {
          const Icon = icons[event.kind];
          return (
            <motion.div animate={{ opacity: 1, x: 0 }} className="relative flex items-start gap-3 pb-5" initial={{ opacity: 0, x: 10 }} key={event.id} transition={{ delay: index * 0.1 }}>
              {index < events.length - 1 && <span className="absolute left-[13px] top-7 h-full w-px bg-white/[0.08]" />}
              <div className="z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-cyan/20 bg-[#101827] text-cyan"><Icon size={13} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2"><p className="truncate text-xs text-white">{event.title}</p><span className="font-mono text-[9px] text-[#8792aa]">{event.timestamp}</span></div>
                <p className="mt-1 truncate text-[10px] text-[#657089]">{event.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
