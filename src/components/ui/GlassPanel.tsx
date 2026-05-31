import type { HTMLAttributes, PropsWithChildren } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function GlassPanel({ children, className = "", ...props }: PropsWithChildren<GlassPanelProps>) {
  return (
    <section className={`glass-panel ${className}`} {...props}>
      {children}
    </section>
  );
}
