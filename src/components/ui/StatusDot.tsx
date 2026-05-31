import { motion } from "framer-motion";

const colors = { cyan: "bg-cyan shadow-[0_0_12px_var(--cyan)]", purple: "bg-purple shadow-[0_0_12px_var(--purple)]", pink: "bg-pink shadow-[0_0_12px_var(--pink)]", amber: "bg-amber shadow-[0_0_12px_var(--amber)]" };

export function StatusDot({ color = "cyan", pulse = true }: { color?: keyof typeof colors; pulse?: boolean }) {
  return <motion.span animate={pulse ? { opacity: [0.35, 1, 0.35] } : undefined} className={`inline-block h-1.5 w-1.5 rounded-full ${colors[color]}`} transition={pulse ? { duration: 1.8, repeat: Infinity } : undefined} />;
}
