import type { TraceSummary, Trace } from "../types/telemetry";

type SummaryResponse = {
  success: boolean;
  traces: TraceSummary[];
};

type TraceResponse = {
  success: boolean;
  trace: Trace;
};

export async function getTraceSummaries(): Promise<TraceSummary[]> {
  const response = await fetch("/api/telemetry/traces", { method: "GET", credentials: "include" });

  const summaryResponse = (await response.json().catch(() => null)) as SummaryResponse | null;

  if (!response.ok || !summaryResponse?.success) {
    throw new Error("Failed to load traces.");
  }

  return summaryResponse.traces;
}

export async function getTrace(traceId: string, signal?: AbortSignal): Promise<Trace> {
  const response = await fetch(`/api/telemetry/traces/${traceId}`, {
    method: "GET",
    credentials: "include",
    signal
  });

  const traceResponse = (await response.json().catch(() => null)) as TraceResponse | null;

  if (!response.ok || !traceResponse?.success) {
    throw new Error("Failed to load trace.");
  }

  return traceResponse.trace;
}
