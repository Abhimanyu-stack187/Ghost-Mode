import { Camera, Clipboard, Mic } from "lucide-react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import type { PermissionSummary } from "../../types/telemetry";

const icons = { microphone: Mic, camera: Camera, clipboard: Clipboard };

export function PermissionsStrip({ permissions }: { permissions: PermissionSummary[] }) {
  return (
    <GlassPanel className="flex items-center px-5 py-4">
      <div className="w-48">
        <p className="telemetry-label">Permissions Today</p>
        <p className="mt-2 text-xs text-[#8792aa]">Sensitive access observed</p>
      </div>
      <div className="grid flex-1 grid-cols-3 divide-x divide-white/[0.08]">
        {permissions.map((permission) => {
          const Icon = icons[permission.kind];
          return (
            <div className="flex items-center gap-3 px-5 first:pl-0" key={permission.kind}>
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-amber/20 bg-amber/10 text-amber">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs capitalize text-[#a4aec4]">{permission.kind}</p>
                <p className="mt-1 font-mono text-sm font-bold text-white">
                  {permission.count} <span className="text-[9px] font-normal text-[#657089]">EVENTS · {permission.leadingApp}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
