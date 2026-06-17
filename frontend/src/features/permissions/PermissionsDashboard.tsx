import { motion } from "framer-motion";
import { Camera, Clipboard, Eye, Mic, MonitorUp, ShieldAlert } from "lucide-react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { RiskBadge } from "../../components/ui/RiskBadge";
import type { PermissionAccessRecord, PermissionEvent, PermissionKind } from "../../data/mockPermissions";

const permissionConfig: Record<PermissionKind, { label: string; icon: typeof Camera; color: string }> = {
  camera: { label: "Camera Access", icon: Camera, color: "#4586ff" },
  microphone: { label: "Microphone Access", icon: Mic, color: "#ff4d9d" },
  clipboard: { label: "Clipboard Access", icon: Clipboard, color: "#ffb84d" },
  "screen-recording": { label: "Screen Recording Access", icon: MonitorUp, color: "#9b5cff" },
};

const kinds = Object.keys(permissionConfig) as PermissionKind[];

function PermissionCard({ kind, records, index }: { kind: PermissionKind; records: PermissionAccessRecord[]; index: number }) {
  const config = permissionConfig[kind];
  const Icon = config.icon;
  const total = records.reduce((sum, record) => sum + record.frequency, 0);
  return (
    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }} transition={{ delay: index * 0.08 }}>
      <GlassPanel className="h-full overflow-hidden p-5" interactive>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl border bg-white/[0.03]" style={{ borderColor: `${config.color}44`, color: config.color, boxShadow: `0 0 20px ${config.color}22` }}><Icon size={17} /></div><div><p className="telemetry-label">{config.label}</p><p className="mt-1 font-display text-2xl font-semibold text-white">{total}<span className="ml-1 font-mono text-[9px] font-normal tracking-wider text-[#657089]">EVENTS</span></p></div></div>
        </div>
        <div className="mt-5 divide-y divide-white/[0.07]">
          {records.map((record) => (
            <div className="py-3" key={record.id}>
              <div className="flex items-center justify-between gap-3"><p className="text-sm text-white">{record.application}</p><RiskBadge risk={record.risk} /></div>
              <div className="mt-2 flex justify-between gap-3 font-mono text-[9px] tracking-wide text-[#657089]"><span>{record.frequency} ACCESSES</span><span>LAST / {record.lastAccess}</span></div>
              <p className="mt-2 text-xs leading-5 text-[#8792aa]">{record.note}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </motion.div>
  );
}

export function PermissionsDashboard({ records, events }: { records: PermissionAccessRecord[]; events: PermissionEvent[] }) {
  const totalAccesses = records.reduce((sum, record) => sum + record.frequency, 0);
  const riskyApps = new Set(records.filter((record) => record.risk === "high" || record.risk === "critical").map((record) => record.application)).size;
  const monitoredApps = new Set(records.map((record) => record.application)).size;

  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Sensitive Accesses", value: totalAccesses, icon: Eye, color: "text-cyan" },
          { label: "Monitored Applications", value: monitoredApps, icon: ShieldAlert, color: "text-purple" },
          { label: "High Risk Applications", value: riskyApps, icon: ShieldAlert, color: "text-pink" },
        ].map(({ label, value, icon: Icon, color }, index) => <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 8 }} key={label} transition={{ delay: index * 0.07 }}><GlassPanel className="flex items-center gap-4 px-4 py-3"><div className={`grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] ${color}`}><Icon size={16} /></div><div><p className="telemetry-label">{label}</p><p className="mt-1 font-display text-xl font-semibold text-white">{value}</p></div></GlassPanel></motion.div>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          {kinds.map((kind, index) => <PermissionCard index={index} key={kind} kind={kind} records={records.filter((record) => record.kind === kind)} />)}
        </div>
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between"><p className="telemetry-label">Permission Timeline</p><span className="font-mono text-[9px] tracking-wider text-cyan">LIVE AUDIT</span></div>
          <div className="mt-5">
            {events.map((event, index) => {
              const config = permissionConfig[event.kind];
              const Icon = config.icon;
              return (
                <motion.div animate={{ opacity: 1, x: 0 }} className="relative flex gap-3 pb-6" initial={{ opacity: 0, x: 10 }} key={event.id} transition={{ delay: index * 0.08 }}>
                  {index < events.length - 1 && <span className="absolute left-[13px] top-7 h-full w-px bg-white/[0.08]" />}
                  <div className="z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border bg-[#101827]" style={{ borderColor: `${config.color}55`, color: config.color, boxShadow: `0 0 14px ${config.color}22` }}><Icon size={13} /></div>
                  <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-xs text-white">{event.action}</p><span className="font-mono text-[9px] text-[#657089]">{event.timestamp}</span></div><p className="mt-1 text-[10px] text-[#8792aa]">{event.application} / {config.label}</p></div>
                </motion.div>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    </>
  );
}
