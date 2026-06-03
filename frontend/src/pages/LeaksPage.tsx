import { LeakDetectionPanel } from "../features/leaks/LeakDetectionPanel";
import { useTelemetryQuery } from "../hooks/useTelemetryQuery";
import { getLeakData } from "../services/telemetry";

export function LeaksPage() {
  const { data: exposure } = useTelemetryQuery(getLeakData);
  if (!exposure) return <p className="telemetry-label text-cyan">Loading breach telemetry...</p>;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6">
        <p className="telemetry-label text-cyan">Historical Exposure / Breach monitoring</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Leak Detection</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#8792aa]">Review compromised accounts, exposed credentials, and historical breach events linked to your identity.</p>
      </div>
      <LeakDetectionPanel exposure={exposure} lookupExposure={getLeakData} />
    </div>
  );
}
