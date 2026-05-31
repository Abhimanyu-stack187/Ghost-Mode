import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, AtSign, CheckCircle2, Database, KeyRound, Search, ShieldAlert } from "lucide-react";
import { type FormEvent, useState } from "react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import type { BreachRecord, BreachSeverity, LeakExposure } from "../../data/mockLeaks";

const severityStyles: Record<BreachSeverity, string> = {
  low: "border-cyan/25 bg-cyan/10 text-cyan",
  medium: "border-amber/25 bg-amber/10 text-amber",
  high: "border-pink/25 bg-pink/10 text-pink",
  critical: "border-[#ff4d6d]/35 bg-[#ff4d6d]/10 text-[#ff6b7d]",
};

function SeverityBadge({ severity }: { severity: BreachSeverity }) {
  return <span className={`rounded-md border px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.16em] ${severityStyles[severity]}`}>{severity}</span>;
}

function ImpactGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="-rotate-90" height="144" viewBox="0 0 144 144" width="144">
        <circle cx="72" cy="72" fill="none" r="54" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
        <motion.circle animate={{ strokeDashoffset: offset }} cx="72" cy="72" fill="none" initial={{ strokeDashoffset: circumference }} r="54" stroke="url(#impactGradient)" strokeDasharray={circumference} strokeLinecap="round" strokeWidth="9" transition={{ duration: 1.4 }} />
        <defs><linearGradient id="impactGradient"><stop stopColor="#ffb84d" /><stop offset="1" stopColor="#ff4d6d" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center"><div><p className="font-display text-4xl font-semibold tracking-[-0.08em] text-white">{score}</p><p className="font-mono text-[8px] tracking-[0.15em] text-[#657089]">IMPACT</p></div></div>
    </div>
  );
}

function BreachCard({ breach, index }: { breach: BreachRecord; index: number }) {
  return (
    <motion.article animate={{ opacity: 1, y: 0 }} className="relative rounded-xl border border-white/[0.07] bg-white/[0.025] p-4" initial={{ opacity: 0, y: 12 }} transition={{ delay: index * 0.1 }}>
      <div className="absolute inset-y-4 left-0 w-0.5 rounded-full" style={{ backgroundColor: breach.accent, boxShadow: `0 0 14px ${breach.accent}` }} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="font-display text-base font-semibold text-white">{breach.service}</p><p className="mt-1 font-mono text-[9px] tracking-wider text-[#657089]">{breach.date}</p></div>
        <SeverityBadge severity={breach.severity} />
      </div>
      <p className="mt-3 text-xs leading-5 text-[#8792aa]">{breach.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">{breach.exposedData.map((item) => <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[8px] tracking-wide text-[#a4aec4]" key={item}>{item}</span>)}</div>
      <div className="mt-4 flex items-center gap-3"><div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]"><motion.div animate={{ width: `${breach.impactScore}%` }} className="h-full rounded-full bg-gradient-to-r from-amber to-pink" initial={{ width: 0 }} transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }} /></div><span className="font-mono text-[9px] text-pink">{breach.impactScore}% IMPACT</span></div>
    </motion.article>
  );
}

export function LeakDetectionPanel({ exposure, lookupExposure }: { exposure: LeakExposure; lookupExposure: (email?: string) => Promise<LeakExposure> }) {
  const [email, setEmail] = useState(exposure.email);
  const [searchedEmail, setSearchedEmail] = useState(exposure.email);
  const [isScanning, setIsScanning] = useState(false);
  const [currentExposure, setCurrentExposure] = useState(exposure);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsScanning(true);
    try {
      const result = await lookupExposure(email.trim());
      setCurrentExposure(result);
      setSearchedEmail(result.email);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <GlassPanel className="overflow-hidden p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="telemetry-label">Account Exposure Search</p><p className="mt-2 text-sm text-[#8792aa]">Check an email address against monitored breach telemetry.</p></div>
          </div>
          <form className="mt-5 flex flex-col gap-2 sm:flex-row" onSubmit={submit}>
            <label className="relative flex-1"><span className="sr-only">Email address</span><AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#657089]" size={16} /><input className="h-11 w-full rounded-xl border border-white/[0.1] bg-[#070b14]/70 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-[#657089] focus:border-cyan/40" onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" type="email" value={email} /></label>
            <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan/30 bg-cyan/10 px-5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan transition hover:bg-cyan/20" type="submit"><Search size={14} />{isScanning ? "Scanning..." : "Scan email"}</button>
          </form>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div><p className="telemetry-label">Breach Timeline</p><p className="mt-2 text-xs text-[#8792aa]">Historical compromises linked to <span className="text-white">{searchedEmail}</span></p></div>
            <span className="font-mono text-[9px] tracking-wider text-pink">{currentExposure.breaches.length} RECORDS DETECTED</span>
          </div>
          <div className="relative mt-6 space-y-3">
            <AnimatePresence mode="popLayout">{!isScanning && currentExposure.breaches.map((breach, index) => <BreachCard breach={breach} index={index} key={`${searchedEmail}-${breach.id}`} />)}</AnimatePresence>
            {isScanning && <motion.div animate={{ opacity: 1 }} className="grid min-h-52 place-items-center font-mono text-[10px] tracking-[0.18em] text-cyan" initial={{ opacity: 0 }}>SCANNING BREACH INDEX...</motion.div>}
          </div>
        </GlassPanel>
      </div>

      <aside className="space-y-4">
        <GlassPanel className="overflow-hidden p-5 text-center">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-pink/10 blur-3xl" />
          <p className="telemetry-label">Exposure Status</p>
          <div className="mt-5"><ImpactGauge score={currentExposure.impactScore} /></div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-pink/25 bg-pink/10 px-3 py-2 font-mono text-[9px] font-bold tracking-wider text-pink"><ShieldAlert size={13} /> ACTION REQUIRED</div>
          <p className="mt-4 text-xs leading-5 text-[#8792aa]">This account appears in multiple historical breach records. Rotate reused passwords and enable MFA.</p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="telemetry-label">Exposure Summary</p>
          <div className="mt-4 space-y-4">
            {[
              { label: "Breaches found", value: currentExposure.breaches.length, icon: Database, color: "text-pink" },
              { label: "Credential leaks", value: 3, icon: KeyRound, color: "text-amber" },
              { label: "Monitoring active", value: "YES", icon: CheckCircle2, color: "text-cyan" },
            ].map(({ label, value, icon: Icon, color }) => <div className="flex items-center justify-between" key={label}><span className="flex items-center gap-2 text-xs text-[#8792aa]"><Icon className={color} size={14} />{label}</span><span className="font-mono text-xs font-bold text-white">{value}</span></div>)}
          </div>
        </GlassPanel>
        <GlassPanel className="flex items-start gap-3 border-amber/20 p-4"><AlertTriangle className="mt-0.5 shrink-0 text-amber" size={15} /><p className="text-xs leading-5 text-[#8792aa]">Historical breach data does not prove an active compromise. Treat exposed credentials as unsafe.</p></GlassPanel>
      </aside>
    </div>
  );
}
