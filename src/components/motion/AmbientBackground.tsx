import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_12%,rgba(69,134,255,0.13),transparent_28%),radial-gradient(circle_at_18%_92%,rgba(155,92,255,0.12),transparent_30%)]" />
      <motion.div
        className="absolute -right-32 top-32 h-96 w-96 rounded-full bg-cyan/5 blur-[120px]"
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(rgba(133,152,255,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(133,152,255,0.24)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}
