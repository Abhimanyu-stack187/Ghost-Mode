import { AnimatePresence, motion } from "framer-motion";
import { AppWindow, ArrowUpRight, KeyRound, Pause, Play, RadioTower, RefreshCcw, ShieldAlert, Wifi } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import type { ReplayEvent, ReplayEventType, ReplayRisk } from "../../data/mockPrivacyReplay";

const typeConfig: Record<ReplayEventType, { label: string; icon: typeof AppWindow; color: string }> = {
  "application-launch": { label: "Application Launch", icon: AppWindow, color: "#4586ff" },
  "network-connection": { label: "Network Connection", icon: RadioTower, color: "#35e9ff" },
  "tracker-detection": { label: "Tracker Detection", icon: ShieldAlert, color: "#ff4d9d" },
  "permission-access": { label: "Permission Access", icon: KeyRound, color: "#ffb84d" },
  "wifi-change": { label: "WiFi Change", icon: Wifi, color: "#9b5cff" },
  "exposure-increase": { label: "Exposure Increase", icon: ArrowUpRight, color: "#ff4d6d" },
};

const riskStyles: Record<ReplayRisk, string> = {
  low: "border-cyan/20 bg-cyan/10 text-cyan",
  medium: "border-amber/20 bg-amber/10 text-amber",
  high: "border-pink/25 bg-pink/10 text-pink",
};

const formatTime = (minute: number) => `09:${String(Math.floor(minute)).padStart(2, "0")}`;

export function PrivacyReplayTimeline({ duration, events }: { duration: number; events: ReplayEvent[] }) {
  const [cursor, setCursor] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const visibleEvents = useMemo(() => events.filter((event) => event.minute <= cursor), [cursor, events]);
  const currentEvent = visibleEvents[visibleEvents.length - 1] ?? events[0];
  const currentExposure = currentEvent?.exposure ?? 0;
  const exposurePoints = events.map((event) => `${(event.minute / duration) * 100},${100 - event.exposure}`).join(" ");
  const areaPoints = `0,100 ${exposurePoints} 100,100`;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCursor((current) => {
        if (current >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return Math.min(current + 0.25, duration);
      });
    }, 110);
    return () => window.clearInterval(timer);
  }, [duration, isPlaying]);

  useEffect(() => {
    if (!isPlaying || !currentEvent) return;
    eventRefs.current[currentEvent.id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentEvent, isPlaying]);

  const play = () => {
    if (cursor >= duration) setCursor(0);
    setIsPlaying(true);
  };

  const restart = () => {
    setCursor(0);
    setIsPlaying(true);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <GlassPanel className="overflow-hidden p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="telemetry-label">Exposure Timeline / 09:00 - 09:45</p>
            <p className="mt-2 text-sm text-[#8792aa]">Replay observed privacy events and risk changes throughout the session.</p>
          </div>
          <div className="flex gap-2">
            <button aria-label="Play replay" className="grid h-10 w-10 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan transition hover:bg-cyan/20 disabled:opacity-40" disabled={isPlaying} onClick={play}>
              <Play size={16} />
            </button>
            <button aria-label="Pause replay" className="grid h-10 w-10 place-items-center rounded-xl border border-purple/25 bg-purple/10 text-purple transition hover:bg-purple/20 disabled:opacity-40" disabled={!isPlaying} onClick={() => setIsPlaying(false)}>
              <Pause size={16} />
            </button>
            <button aria-label="Restart replay" className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.1] bg-white/[0.03] text-[#8792aa] transition hover:border-purple/30 hover:text-purple" onClick={restart}>
              <RefreshCcw size={15} />
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-white/[0.06] bg-[#070b14]/65 p-4">
          <div className="flex items-center justify-between">
            <p className="telemetry-label">Exposure Spikes</p>
            <span className="font-mono text-[10px] text-cyan">{formatTime(cursor)} LIVE CURSOR</span>
          </div>
          <div className="relative mt-4 h-28">
            <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="replayArea" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#ff4d9d" stopOpacity="0.4" /><stop offset="1" stopColor="#9b5cff" stopOpacity="0" /></linearGradient>
              </defs>
              <motion.polygon animate={{ opacity: 1 }} fill="url(#replayArea)" initial={{ opacity: 0 }} points={areaPoints} transition={{ duration: 0.8 }} />
              <motion.polyline animate={{ pathLength: 1, opacity: 1 }} fill="none" initial={{ pathLength: 0, opacity: 0 }} points={exposurePoints} stroke="#ff4d9d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transition={{ duration: 1.3 }} />
              {events.map((event) => <motion.circle animate={event.minute <= cursor ? { opacity: [0.45, 1, 0.45], r: [1.4, 2.5, 1.4] } : { opacity: 0.16, r: 1.2 }} cx={`${(event.minute / duration) * 100}%`} cy={100 - event.exposure} fill={event.risk === "high" ? "#ff4d6d" : "#ffb84d"} key={event.id} transition={{ duration: 1.2, repeat: event.minute <= cursor ? Infinity : 0 }} />)}
              <motion.line animate={{ x1: `${(cursor / duration) * 100}%`, x2: `${(cursor / duration) * 100}%` }} stroke="#35e9ff" strokeDasharray="3 3" strokeWidth="0.8" transition={{ duration: 0.1, ease: "linear" }} y1="0" y2="100" />
            </svg>
          </div>
        </div>

        <div className="mt-6">
          <input aria-label="Replay timeline position" className="replay-scrubber w-full" max={duration} min="0" onChange={(event) => { setCursor(Number(event.target.value)); setIsPlaying(false); }} type="range" value={cursor} />
          <div className="mt-2 flex justify-between font-mono text-[9px] text-[#657089]"><span>09:00</span><span>09:15</span><span>09:30</span><span>09:45</span></div>
        </div>

        <div className="relative mt-8 max-h-[560px] overflow-y-auto pr-2">
          <div className="absolute bottom-0 left-[13px] top-0 w-px bg-white/[0.08]" />
          <motion.div animate={{ height: `${(cursor / duration) * 100}%` }} className="absolute left-[13px] top-0 w-px bg-cyan shadow-[0_0_14px_var(--cyan)]" />
          <AnimatePresence initial={false}>
            {visibleEvents.map((event) => {
              const config = typeConfig[event.type];
              const Icon = config.icon;
              return (
                <motion.div animate={{ opacity: 1, x: 0 }} className="relative flex gap-4 pb-6" exit={{ opacity: 0, x: -12 }} initial={{ opacity: 0, x: -12 }} key={event.id} layout ref={(element) => { eventRefs.current[event.id] = element; }}>
                  <motion.div animate={currentEvent?.id === event.id ? { scale: [1, 1.14, 1], boxShadow: [`0 0 12px ${config.color}50`, `0 0 24px ${config.color}90`, `0 0 12px ${config.color}50`] } : { scale: 1 }} className="z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border bg-[#0b1120]" style={{ borderColor: `${config.color}80`, color: config.color }} transition={{ duration: 1.2, repeat: currentEvent?.id === event.id && isPlaying ? Infinity : 0 }}><Icon size={13} /></motion.div>
                  <motion.div animate={currentEvent?.id === event.id ? { borderColor: `${config.color}66`, backgroundColor: `${config.color}0d` } : { borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.025)" }} className="min-w-0 flex-1 rounded-xl border px-4 py-3" transition={{ duration: 0.25 }}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2"><span className="font-mono text-[10px] text-white">{event.timestamp}</span><span className="font-mono text-[8px] uppercase tracking-wider" style={{ color: config.color }}>{config.label}</span></div>
                      <span className={`rounded border px-2 py-1 font-mono text-[8px] uppercase tracking-wider ${riskStyles[event.risk]}`}>{event.risk} risk</span>
                    </div>
                    <p className="mt-2 text-sm text-white">{event.title}</p>
                    <p className="mt-1 text-xs text-[#657089]">{event.detail}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </GlassPanel>

      <aside className="space-y-4">
        <GlassPanel className="p-5">
          <p className="telemetry-label">Replay Status</p>
          <div className="mt-5 flex items-end justify-between"><span className="font-display text-5xl font-semibold tracking-[-0.07em] text-white">{formatTime(cursor)}</span><span className="mb-1 font-mono text-[9px] text-cyan">{isPlaying ? "PLAYING" : "PAUSED"}</span></div>
          <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]"><motion.div animate={{ width: `${(cursor / duration) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan via-purple to-pink" /></div>
          <p className="mt-3 text-xs text-[#8792aa]">{visibleEvents.length} of {events.length} events reconstructed</p>
        </GlassPanel>
        <GlassPanel className="overflow-hidden p-5">
          <p className="telemetry-label">Live Exposure Score</p>
          <div className="mt-4 flex items-end gap-2"><motion.span animate={{ color: currentExposure >= 70 ? "#ff4d6d" : currentExposure >= 45 ? "#ffb84d" : "#35e9ff" }} className="font-display text-6xl font-semibold tracking-[-0.08em]">{currentExposure}</motion.span><span className="mb-2 font-mono text-[10px] text-[#657089]">/ 100</span></div>
          <p className="mt-3 text-xs leading-5 text-[#8792aa]">{currentEvent?.title ?? "Awaiting telemetry"}</p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="telemetry-label">Event Types</p>
          <div className="mt-4 space-y-3">
            {Object.values(typeConfig).map(({ color, label, icon: Icon }) => <div className="flex items-center gap-3" key={label}><Icon size={13} style={{ color }} /><span className="text-xs text-[#8792aa]">{label}</span></div>)}
          </div>
        </GlassPanel>
      </aside>
    </div>
  );
}
