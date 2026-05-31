import type { LucideIcon } from "lucide-react";
import { GlassPanel } from "./GlassPanel";

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ eyebrow, title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="grid min-h-[calc(100vh-112px)] place-items-center">
      <GlassPanel className="relative max-w-xl overflow-hidden p-10 text-center">
        <div className="absolute inset-x-20 -top-24 h-40 rounded-full bg-purple/15 blur-[70px]" />
        <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan shadow-cyan">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <p className="telemetry-label mt-6">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">{title}</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#8792aa]">{description}</p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-purple/20 bg-purple/10 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.18em] text-purple">
          <span className="h-1.5 w-1.5 rounded-full bg-purple shadow-[0_0_12px_var(--purple)]" />
          MODULE INITIALIZED
        </div>
      </GlassPanel>
    </div>
  );
}
