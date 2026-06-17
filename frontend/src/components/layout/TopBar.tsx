import { Expand, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { primaryNavigation, secondaryNavigation } from "../../app/navigation";
import { useTelemetrySimulation } from "../../contexts/TelemetrySimulationContext";

export function TopBar() {
  const location = useLocation();
  const navigation = [...primaryNavigation, ...secondaryNavigation];
  const page = navigation.find(({ to }) => to === location.pathname)?.label ?? "Overview";
  const { backendLive, trackers } = useTelemetrySimulation();

  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#070912]/70 px-4 backdrop-blur-2xl sm:px-6 lg:left-[216px]">
      <div className="flex items-baseline gap-2">
        <h1 className="font-display text-base font-semibold tracking-wide text-white">{page}</h1>
        <span className="hidden text-xs text-[#657089] sm:inline">/ digital exposure observatory</span>
      </div>
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.16em] text-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
          {backendLive ? "BACKEND" : "LIVE"}
        </div>
        <span className="hidden font-mono text-[10px] tracking-wide text-[#8792aa] md:inline">{(trackers?.eventCount ?? 0).toLocaleString()} EVENTS</span>
        <button className="hidden rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 font-mono text-[10px] tracking-wider text-[#a4aec4] transition hover:border-cyan/30 hover:text-white sm:block">TODAY</button>
        <button aria-label="Search" className="text-[#8792aa] transition hover:text-cyan"><Search size={17} /></button>
        <button aria-label="Cinematic mode" className="hidden text-[#8792aa] transition hover:text-cyan sm:block"><Expand size={17} /></button>
      </div>
    </header>
  );
}
