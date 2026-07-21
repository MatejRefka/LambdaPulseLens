import { useEffect, useState } from "react";
import type { TraceSummary, Trace } from "../../../types/telemetry";
import { getTraceSummaries, getTrace, openLiveTraceConnection } from "../../../api/telemetryApi";

export const useTraces = () => {
  const [summaries, setSummaries] = useState<TraceSummary[]>([]);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(true);
  const [isLoadingTrace, setIsLoadingTrace] = useState(false);
  const [summariesError, setSummariesError] = useState<string | null>(null);
  const [traceError, setTraceError] = useState<string | null>(null);
  const [liveTracesError, setLiveTracesError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummaries() {
      try {
        const traces = await getTraceSummaries();
        setSummaries(traces);
        if (traces.length > 0) {
          setSelectedTraceId(traces[0].id);
        }
      } catch (loadError) {
        setSummariesError(loadError instanceof Error ? loadError.message : "Failed to load traces.");
      } finally {
        setIsLoadingSummaries(false);
      }
    }
    void loadSummaries();
  }, []);

  useEffect(() => {
    const eventSource = openLiveTraceConnection({
      onTrace: (traceSummary) => {
        setLiveTracesError(null);
        setSummaries((currentSummaries) => [
          traceSummary,
          ...currentSummaries.filter((summary) => summary.id !== traceSummary.id)
        ]);
        setSelectedTraceId((currentSelectedTraceId) => currentSelectedTraceId ?? traceSummary.id);
      },
      onError: () => {
        setLiveTracesError("Live trace stream disconnected.");
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (selectedTraceId === null) {
      return;
    }

    const controller = new AbortController();
    setSelectedTrace(null);
    setTraceError(null);
    setIsLoadingTrace(true);
    async function loadTrace(traceId: string) {
      try {
        const trace = await getTrace(traceId, controller.signal);
        if (!controller.signal.aborted) {
          setSelectedTrace(trace);
        }
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }
        setTraceError(loadError instanceof Error ? loadError.message : "Failed to load trace.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTrace(false);
        }
      }
    }
    void loadTrace(selectedTraceId);

    return () => {
      controller.abort();
    };
  }, [selectedTraceId]);

  const selectTrace = (traceId: string) => {
    setSelectedTraceId(traceId);
  };

  return {
    summaries,
    selectedTraceId,
    selectedTrace,
    selectTrace,
    isLoadingSummaries,
    isLoadingTrace,
    summariesError,
    traceError,
    liveTracesError
  };
};
