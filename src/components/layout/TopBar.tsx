import { Expand, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { mockTelemetry } from "../../data/mockTelemetry";
import { primaryNavigation, secondaryNavigation } from "../../app/navigation";

export function TopBar() {
  const location = useLocation();
  const navigation = [...primaryNavigation, ...secondaryNavigation];
  const page = navigation.find(({ to }) => to === location.pathname)?.label ?? "Overview";

  return (
    <header className="fixed left-[216px] right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#070912]/70 px-6 backdrop-blur-2xl">
      <div className="flex items-baseline gap-2">
        <h1 className="font-display text-base font-semibold tracking-wide text-white">{page}</h1>
        <span className="text-xs text-[#657089]">/ digital exposure observatory</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.16em] text-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
          LIVE
        </div>
        <span className="font-mono text-[10px] tracking-wide text-[#8792aa]">
          {mockTelemetry.eventCount.toLocaleString()} EVENTS
        </span>
        <button className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 font-mono text-[10px] tracking-wider text-[#a4aec4] transition hover:border-cyan/30 hover:text-white">
          TODAY ▾
        </button>
        <button aria-label="Search" className="text-[#8792aa] transition hover:text-cyan">
          <Search size={17} />
        </button>
        <button aria-label="Cinematic mode" className="text-[#8792aa] transition hover:text-cyan">
          <Expand size={17} />
        </button>
      </div>
    </header>
  );
}
