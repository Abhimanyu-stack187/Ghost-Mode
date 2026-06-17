import type { RiskLevel } from "../../types/telemetry";

const styles: Record<RiskLevel, string> = {
  low: "border-cyan/25 bg-cyan/10 text-cyan",
  medium: "border-amber/25 bg-amber/10 text-amber",
  high: "border-pink/25 bg-pink/10 text-pink",
  critical: "border-pink/40 bg-pink/15 text-pink shadow-[0_0_18px_rgba(255,77,157,0.18)]",
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span className={`rounded-md border px-2 py-1 font-mono text-[9px] font-bold tracking-[0.18em] ${styles[risk]}`}>
      {risk.toUpperCase()}
    </span>
  );
}
