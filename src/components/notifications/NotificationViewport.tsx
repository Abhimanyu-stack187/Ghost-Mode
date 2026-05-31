import { AnimatePresence, motion } from "framer-motion";
import { Eye, KeyRound, RadioTower, ShieldAlert, X } from "lucide-react";
import { useNotifications, type GhostNotification } from "../../contexts/NotificationContext";
import type { RiskLevel, TelemetryEventKind } from "../../types/telemetry";

const riskStyles: Record<RiskLevel, { border: string; glow: string; text: string }> = {
  low: { border: "border-cyan/30", glow: "shadow-cyan", text: "text-cyan" },
  medium: { border: "border-amber/30", glow: "shadow-amber", text: "text-amber" },
  high: { border: "border-pink/35", glow: "shadow-pink", text: "text-pink" },
  critical: { border: "border-danger/45", glow: "shadow-danger", text: "text-danger" },
};

const icons: Record<TelemetryEventKind, typeof Eye> = {
  tracker: Eye,
  network: RadioTower,
  permission: KeyRound,
  app: ShieldAlert,
};

function NotificationToast({ notification, dismiss }: { notification: GhostNotification; dismiss: (id: string) => void }) {
  const style = riskStyles[notification.risk];
  const Icon = icons[notification.kind];
  return (
    <motion.article animate={{ opacity: 1, x: 0, scale: 1 }} className={`relative w-full overflow-hidden rounded-xl border bg-[#090d18]/95 p-4 backdrop-blur-2xl ${style.border} ${style.glow}`} exit={{ opacity: 0, x: 28, scale: 0.97 }} initial={{ opacity: 0, x: 42, scale: 0.96 }} layout transition={{ duration: 0.28 }}>
      <motion.span animate={{ scaleX: 0 }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-current" initial={{ scaleX: 1 }} style={{ color: notification.risk === "critical" ? "#ff4d6d" : notification.risk === "high" ? "#ff4d9d" : notification.risk === "medium" ? "#ffb84d" : "#35e9ff" }} transition={{ duration: 5.2, ease: "linear" }} />
      <div className="flex items-start gap-3">
        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-current bg-current/10 ${style.text}`}><Icon size={15} /></div>
        <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-white">{notification.title}</p><button aria-label="Dismiss notification" className="text-[#657089] transition hover:text-white" onClick={() => dismiss(notification.id)}><X size={13} /></button></div><p className="mt-1 text-[11px] leading-4 text-[#8792aa]">{notification.detail}</p><p className={`mt-2 font-mono text-[8px] uppercase tracking-[0.16em] ${style.text}`}>{notification.risk} risk / live telemetry</p></div>
      </div>
    </motion.article>
  );
}

export function NotificationViewport() {
  const { dismissNotification, notifications } = useNotifications();
  return <aside aria-label="Live telemetry notifications" className="pointer-events-none fixed right-4 top-20 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3"><AnimatePresence initial={false}>{notifications.map((notification) => <div className="pointer-events-auto" key={notification.id}><NotificationToast dismiss={dismissNotification} notification={notification} /></div>)}</AnimatePresence></aside>;
}
