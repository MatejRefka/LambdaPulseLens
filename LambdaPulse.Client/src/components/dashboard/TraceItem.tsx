import type { Trace } from "../../types/telemetry";
import { TraceItemStatusBadge } from "./TraceItemStatusBadge";

interface TraceItemProps {
  trace: Trace;
  isSelected: boolean;
  onClick: () => void;
}

export const TraceItem = ({ trace, isSelected, onClick }: TraceItemProps) => {
  const traceContainerStyle = isSelected
    ? "bg-surface-50 border-surface-50 text-black shadow-md"
    : "border-surface-40 cursor-pointer hover:bg-surface-30 hover:border-surface-30";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors border ${traceContainerStyle}`}
    >
      {/*method + status code*/}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold">{trace.request.method}</span>
        <TraceItemStatusBadge statusCode={trace.response.statusCode} responsePhrase={trace.response.responsePhrase} />
      </div>

      {/*path*/}
      <div className="truncate text-sm" title={trace.request.path}>
        {trace.request.path}
      </div>

      {/*duration + timestamp*/}
      <div className={`text-xs mt-1 flex justify-between ${isSelected ? "text-black" : "text-surface-60"}`}>
        <span>{trace.durationMs}ms</span>
        <span>{new Date(trace.timestampStart).toLocaleTimeString()}</span>
      </div>
    </button>
  );
};
