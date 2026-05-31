import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { AmbientBackground } from "../motion/AmbientBackground";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-void text-white">
      <AmbientBackground />
      <Sidebar />
      <div className="relative ml-[216px] min-h-screen">
        <TopBar />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 pb-6 pt-[88px]"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
