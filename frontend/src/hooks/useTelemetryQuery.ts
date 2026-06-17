import { useEffect, useState } from "react";

export function useTelemetryQuery<T>(query: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let active = true;
    query().then((result) => {
      if (active) setData(result);
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason : new Error("Telemetry request failed"));
    });
    return () => {
      active = false;
    };
  }, [query]);

  return { data, error };
}
