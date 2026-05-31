import type { Variants } from "framer-motion";

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: motionEase } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const softPulse = {
  animate: { opacity: [0.35, 1, 0.35] },
  transition: { duration: 1.8, repeat: Infinity },
};
