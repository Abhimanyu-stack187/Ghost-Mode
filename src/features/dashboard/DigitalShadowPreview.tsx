import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassPanel } from "../../components/ui/GlassPanel";

const nodes = [
  { id: "you", label: "YOU", x: 50, y: 51, type: "user" },
  { id: "chrome", label: "Chrome", x: 28, y: 42, type: "app" },
  { id: "discord", label: "Discord", x: 73, y: 54, type: "app" },
  { id: "google", label: "Google", x: 13, y: 24, type: "company" },
  { id: "analytics", label: "Analytics", x: 20, y: 73, type: "tracker" },
  { id: "sentry", label: "Sentry", x: 88, y: 28, type: "tracker" },
  { id: "canva", label: "Canva", x: 83, y: 77, type: "company" },
];

const edges = [
  ["you", "chrome"],
  ["you", "discord"],
  ["chrome", "google"],
  ["chrome", "analytics"],
  ["discord", "sentry"],
  ["discord", "canva"],
];

const colors = {
  user: "#35e9ff",
  app: "#4586ff",
  company: "#9b5cff",
  tracker: "#ff4d9d",
};

export function DigitalShadowPreview() {
  const getNode = (id: string) => nodes.find((node) => node.id === id)!;

  return (
    <GlassPanel className="relative h-full overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="telemetry-label">Digital Shadow · Live</p>
          <p className="mt-1 text-xs text-[#8792aa]">Observed relationships assembling in real time</p>
        </div>
        <span className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.14em] text-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
          OBSERVING NOW
        </span>
      </div>

      <div className="relative mt-4 h-[292px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map(([sourceId, targetId], index) => {
            const source = getNode(sourceId);
            const target = getNode(targetId);
            return (
              <g key={`${sourceId}-${targetId}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="rgba(133, 152, 255, 0.24)"
                  strokeWidth="0.45"
                />
                <motion.circle
                  r="0.9"
                  fill={index % 3 === 0 ? "#ff4d9d" : "#35e9ff"}
                  initial={{ cx: `${source.x}%`, cy: `${source.y}%` }}
                  animate={{ cx: [`${source.x}%`, `${target.x}%`], cy: [`${source.y}%`, `${target.y}%`] }}
                  transition={{ duration: 2.2 + index * 0.2, repeat: Infinity, ease: "linear", delay: index * 0.32 }}
                />
              </g>
            );
          })}
        </svg>
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 * index, duration: 0.45 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div
              className={`mx-auto rounded-full border ${node.type === "user" ? "h-11 w-11" : "h-6 w-6"}`}
              style={{
                borderColor: colors[node.type as keyof typeof colors],
                backgroundColor: `${colors[node.type as keyof typeof colors]}22`,
                boxShadow: `0 0 24px ${colors[node.type as keyof typeof colors]}66`,
              }}
            />
            <span className="mt-2 block whitespace-nowrap font-mono text-[9px] tracking-wide text-[#a4aec4]">{node.label}</span>
          </motion.div>
        ))}
      </div>

      <Link to="/digital-shadow" className="absolute bottom-5 left-5 flex items-center gap-1.5 text-xs font-medium text-cyan transition hover:text-white">
        Open full graph <ArrowUpRight size={14} />
      </Link>
    </GlassPanel>
  );
}
