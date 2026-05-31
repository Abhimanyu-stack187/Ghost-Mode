import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type CyberButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const styles: Record<CyberButtonVariant, string> = {
  primary: "border-cyan/30 bg-cyan/10 text-cyan hover:bg-cyan/20 hover:shadow-cyan",
  secondary: "border-purple/30 bg-purple/10 text-purple hover:bg-purple/20 hover:shadow-purple",
  danger: "border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 hover:shadow-danger",
  ghost: "border-white/[0.08] bg-white/[0.025] text-[#a4aec4] hover:border-cyan/25 hover:text-white",
};

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CyberButtonVariant;
}

export function CyberButton({ children, className = "", variant = "primary", ...props }: PropsWithChildren<CyberButtonProps>) {
  return <button className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition ${styles[variant]} ${className}`} {...props}>{children}</button>;
}
