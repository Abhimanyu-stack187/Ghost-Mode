import { permissionAccessRecords, permissionEvents } from "../data/mockPermissions";
import { PermissionsDashboard } from "../features/permissions/PermissionsDashboard";

export function PermissionsPage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6">
        <p className="telemetry-label text-cyan">Sensitive Access / Permission observatory</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Permissions</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#8792aa]">Track which applications access sensitive device capabilities, how often they request them, and where your attention is needed.</p>
      </div>
      <PermissionsDashboard events={permissionEvents} records={permissionAccessRecords} />
    </div>
  );
}
