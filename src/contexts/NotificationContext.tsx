import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { RiskLevel, TelemetryEventKind } from "../types/telemetry";

export interface GhostNotification {
  id: string;
  title: string;
  detail: string;
  risk: RiskLevel;
  kind: TelemetryEventKind;
  createdAt: number;
}

interface NotificationContextValue {
  notifications: GhostNotification[];
  dismissNotification: (id: string) => void;
  pushNotification: (notification: Omit<GhostNotification, "createdAt">) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);
const AUTO_DISMISS_MS = 5200;

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<GhostNotification[]>([]);
  const dismissNotification = useCallback((id: string) => setNotifications((current) => current.filter((notification) => notification.id !== id)), []);
  const pushNotification = useCallback((notification: Omit<GhostNotification, "createdAt">) => {
    setNotifications((current) => [{ ...notification, createdAt: Date.now() }, ...current].slice(0, 4));
    window.setTimeout(() => dismissNotification(notification.id), AUTO_DISMISS_MS);
  }, [dismissNotification]);
  const value = useMemo(() => ({ dismissNotification, notifications, pushNotification }), [dismissNotification, notifications, pushNotification]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
