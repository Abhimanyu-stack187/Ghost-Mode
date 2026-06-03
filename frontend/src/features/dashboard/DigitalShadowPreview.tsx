import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassPanel } from "../../components/ui/GlassPanel";

const nodes = [
  { id: "google", label: "Google", x: 14, y: 28, type: "company" },
  { id: "chrome", label: "Chrome", x: 30, y: 50, type: "app" },
  { id: "you", label: "YOU", x: 50, y: 50, type: "user" },
  { id: "discord", label: "Discord", x: 70, y: 50, type: "app" },
  { id: "sentry", label: "Sentry", x: 86, y: 28, type: "tracker" },
  { id: "analytics", label: "Analytics", x: 14, y: 72, type: "tracker" },
  { id: "canva", label: "Canva", x: 86, y: 72, type: "company" },
];

const edges = [
  ["google", "chrome"], ["chrome", "you"], ["you", "discord"],
  ["discord", "sentry"], ["chrome", "analytics"], ["discord", "canva"],
];

const colors = { user: "#35e9ff", app: "#4586ff", company: "#9b5cff", tracker: "#ff4d9d" };

export function DigitalShadowPreview() {
  const getNode = (id: string) => nodes.find((node) => node.id === id)!;

  return (
    <GlassPanel className="relative h-full overflow-hidden p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="telemetry-label">Digital Shadow / Live</p>
          <p className="mt-1 text-xs text-[#8792aa]">Observed relationships assembling in real time</p>
        </div>
        <span className="flex shrink-0 items-center gap-2 font-mono text-[9px] font-bold tracking-[0.14em] text-cyan">
          <motion.span animate={{ opacity: [0.35, 1, 0.35] }} className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" transition={{ duration: 1.4, repeat: Infinity }} />
          OBSERVING NOW
        </span>
      </div>

      <div className="relative mt-4 h-[292px]">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          {edges.map(([sourceId, targetId], index) => {
            const source = getNode(sourceId);
            const target = getNode(targetId);
            const isUserSource = source.type === "user";
            const packetColor = isUserSource ? "#35e9ff" : "#ff4d9d"; // cyan or pink

            return (
              <g key={`${sourceId}-${targetId}`}>
                <line stroke="rgba(133, 152, 255, 0.16)" strokeWidth="0.4" x1={source.x} x2={target.x} y1={source.y} y2={target.y} />
                <motion.circle
                  animate={{ 
                    cx: [source.x, target.x], 
                    cy: [source.y, target.y],
                    opacity: [0, 0.85, 0.85, 0] 
                  }}
                  fill={packetColor}
                  initial={{ cx: source.x, cy: source.y, opacity: 0 }}
                  r="0.9"
                  transition={{ 
                    delay: index * 0.75, 
                    duration: 4.8, 
                    ease: "linear", 
                    repeat: Infinity 
                  }}
                />
              </g>
            );
          })}
        </svg>
        {nodes.map((node, index) => (
          <div
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            key={node.id}
            style={{
              height: node.type === "user" ? 40 : 20,
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: node.type === "user" ? 40 : 20,
            }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="h-full w-full rounded-full border"
              initial={{ opacity: 0, scale: 0.4 }}
              style={{ 
                backgroundColor: `${colors[node.type as keyof typeof colors]}12`, 
                borderColor: colors[node.type as keyof typeof colors], 
                boxShadow: `0 0 12px ${colors[node.type as keyof typeof colors]}22` 
              }}
              transition={{ delay: 0.08 * index, duration: 0.45 }}
            />
            <span className="absolute top-full mt-1.5 whitespace-nowrap font-mono text-[9px] tracking-wide text-[#a4aec4]">
              {node.label}
            </span>
          </div>
        ))}
      </div>

      <Link className="absolute bottom-5 left-5 flex items-center gap-1.5 text-xs font-medium text-cyan transition hover:text-white" to="/digital-shadow">
        Open full graph <ArrowUpRight size={14} />
      </Link>
    </GlassPanel>
  );
}
