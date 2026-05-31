import { motion } from "framer-motion";
import { Ghost, Orbit } from "lucide-react";
import { NavLink } from "react-router-dom";
import { primaryNavigation, secondaryNavigation } from "../../app/navigation";

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] transition-colors ${
    isActive
      ? "bg-purple/10 text-white shadow-purple"
      : "text-[#8792aa] hover:bg-white/[0.035] hover:text-white"
  }`;

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[216px] flex-col border-r border-white/[0.06] bg-[#070912]/90 px-4 py-5 backdrop-blur-2xl lg:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan shadow-cyan">
          <Ghost size={18} strokeWidth={1.8} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
        </div>
        <div>
          <p className="font-display text-sm font-bold tracking-[0.18em]">GHOSTMODE</p>
          <p className="mt-0.5 font-mono text-[8px] tracking-[0.22em] text-purple">DIGITAL SHADOW</p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 px-2 font-mono text-[9px] font-bold tracking-[0.18em] text-cyan">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        OBSERVING LIVE
      </div>

      <nav className="mt-5 space-y-1">
        {primaryNavigation.map(({ label, to, icon: Icon }) => (
          <NavLink className={linkClassName} key={to} to={to}>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute -left-4 h-5 w-0.5 rounded-full bg-cyan shadow-cyan" />}
                <Icon size={16} strokeWidth={1.7} className={isActive ? "text-cyan" : "text-[#657089]"} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <nav className="space-y-1">
          {secondaryNavigation.map(({ label, to, icon: Icon }) => (
            <NavLink className={linkClassName} key={to} to={to}>
              <Icon size={16} strokeWidth={1.7} className="text-[#657089]" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 border-t border-white/[0.06] px-2 pt-4">
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-[#657089]">
            <Orbit size={12} className="text-purple" />
            v0.1 · TELEMETRY ON
          </div>
        </div>
      </div>
    </aside>
  );
}
