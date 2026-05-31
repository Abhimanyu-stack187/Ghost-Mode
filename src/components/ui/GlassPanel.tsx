import type { HTMLAttributes, PropsWithChildren } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  interactive?: boolean;
  variant?: "default" | "raised";
}

export function GlassPanel({ children, className = "", interactive = false, variant = "default", ...props }: PropsWithChildren<GlassPanelProps>) {
  const variantClass = variant === "raised" ? "glass-panel-raised" : "";
  const interactiveClass = interactive ? "glass-panel-interactive" : "";
  return (
    <section className={`glass-panel ${variantClass} ${interactiveClass} ${className}`} {...props}>
      {children}
    </section>
  );
}
