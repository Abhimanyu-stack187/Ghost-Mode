import { AnimatePresence, motion } from "framer-motion";
import { Eye, KeyRound, RadioTower, ShieldAlert, X } from "lucide-react";
import { useNotifications, type GhostNotification } from "../../contexts/NotificationContext";
import type { RiskLevel, TelemetryEventKind } from "../../types/telemetry";

const riskStyles: Record<RiskLevel, { border: string; bg: string; text: string }> = {
  low: { border: "border-cyan/15", bg: "bg-cyan/5", text: "text-cyan" },
  medium: { border: "border-amber/15", bg: "bg-amber/5", text: "text-amber" },
  high: { border: "border-pink/20", bg: "bg-pink/5", text: "text-pink" },
  critical: { border: "border-danger/25", bg: "bg-danger/5", text: "text-danger" },
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
    <motion.article 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      className={`relative w-full overflow-hidden rounded-lg border bg-deep/60 p-3 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${style.border}`} 
      exit={{ opacity: 0, x: 20, scale: 0.95 }} 
      initial={{ opacity: 0, y: 15, scale: 0.95 }} 
      layout 
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.span 
        animate={{ scaleX: 0 }} 
        className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-current opacity-70" 
        initial={{ scaleX: 1 }} 
        style={{ color: notification.risk === "critical" ? "#ff4d6d" : notification.risk === "high" ? "#ff4d9d" : notification.risk === "medium" ? "#ffb84d" : "#35e9ff" }} 
        transition={{ duration: 4.5, ease: "linear" }} 
      />
      <div className="flex items-start gap-2.5">
        <div className={`grid h-6.5 w-6.5 shrink-0 place-items-center rounded-md border border-current/20 bg-current/5 ${style.text}`}>
          <Icon size={13} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate text-xs font-semibold text-text-primary">{notification.title}</span>
              <span className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider border ${style.border} ${style.bg} ${style.text}`}>
                {notification.risk}
              </span>
            </div>
            <button aria-label="Dismiss notification" className="text-text-muted hover:text-text-primary transition-colors" onClick={() => dismiss(notification.id)}>
              <X size={12} />
            </button>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">{notification.detail}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function NotificationViewport() {
  const { dismissNotification, notifications } = useNotifications();
  return (
    <aside aria-label="Live telemetry notifications" className="pointer-events-none fixed right-6 bottom-6 z-50 flex w-[min(340px,calc(100vw-3rem))] flex-col-reverse gap-2.5">
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <div className="pointer-events-auto" key={notification.id}>
            <NotificationToast dismiss={dismissNotification} notification={notification} />
          </div>
        ))}
      </AnimatePresence>
    </aside>
  );
}
